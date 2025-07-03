import { useState, useCallback, useRef } from 'react';

// Types
type SubmitFunction<TData, TResponse> = (data: TData, signal: AbortSignal) => Promise<TResponse>;

interface UseFormSubmitConfig<TResponse> {
  onSuccess?: (response: TResponse) => void;
  onError?: (error: any) => void;
  onFinally?: () => void;
  resetOnSuccess?: boolean;
  globalErrorHandling?: boolean;
}

interface UseFormSubmitResult<TData, TResponse> {
  submit: (data: TData) => Promise<TResponse | void>;
  isSubmitting: boolean;
  error: any | null;
  data: TResponse | null;
  reset: () => void;
  cancel: () => void;
  isSuccess: boolean;
  isError: boolean;
  isIdle: boolean;
}

export function useFormSubmit<TData = any, TResponse = any>(
  submitFunction: SubmitFunction<TData, TResponse>,
  config: UseFormSubmitConfig<TResponse> = {}
): UseFormSubmitResult<TData, TResponse> {
  const {
    onSuccess,
    onError,
    onFinally,
    resetOnSuccess = true,
    globalErrorHandling = true,
  } = config;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<any | null>(null);
  const [data, setData] = useState<TResponse | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const submit = useCallback(
    async (formData: TData): Promise<TResponse | void> => {
      // Cancel any previous submission
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      // Create new controller
      controllerRef.current = new AbortController();
      const currentController = controllerRef.current;

      try {
        setIsSubmitting(true);
        setError(null);

        // Call the submit function with form data and signal
        const result = await submitFunction(formData, currentController.signal);

        // Only update state if not aborted
        if (!currentController.signal.aborted) {
          setData(result);

          // Call success callback
          onSuccess?.(result);

          // Reset state on success if configured
          if (resetOnSuccess) {
            setTimeout(() => {
              if (!currentController.signal.aborted) {
                setData(null);
              }
            }, 100); // Small delay to allow UI to show success state
          }

          return result;
        }
      } catch (err: any) {
        if (!currentController.signal.aborted && err.name !== 'AbortError') {
          setError(err);

          // Handle error globally if enabled
          if (globalErrorHandling) {
            // You can integrate with your global error handler here
            console.error('Form submission error:', err);
          }

          // Call error callback
          onError?.(err);

          throw err; // Re-throw so form can handle it if needed
        }
      } finally {
        if (!currentController.signal.aborted) {
          setIsSubmitting(false);
          onFinally?.();
        }
      }
    },
    [submitFunction, onSuccess, onError, onFinally, resetOnSuccess, globalErrorHandling]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsSubmitting(false);
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  }, []);

  const cancel = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  }, []);

  // Computed values
  const isSuccess = !isSubmitting && !error && data !== null;
  const isError = !isSubmitting && error !== null;
  const isIdle = !isSubmitting && error === null && data === null;

  return {
    submit,
    isSubmitting,
    error,
    data,
    reset,
    cancel,
    isSuccess,
    isError,
    isIdle,
  };
}
