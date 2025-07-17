import { useState, useCallback, useRef } from 'react';

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
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      controllerRef.current = new AbortController();
      const currentController = controllerRef.current;

      try {
        setIsSubmitting(true);
        setError(null);

        const result = await submitFunction(formData, currentController.signal);

        if (!currentController.signal.aborted) {
          setData(result);

          onSuccess?.(result);

          if (resetOnSuccess) {
            setTimeout(() => {
              if (!currentController.signal.aborted) {
                setData(null);
              }
            }, 100);
          }

          return result;
        }
      } catch (err: any) {
        if (!currentController.signal.aborted && err.name !== 'AbortError') {
          setError(err);

          if (globalErrorHandling) {
            console.error('Form submission error:', err);
          }

          onError?.(err);

          throw err;
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
