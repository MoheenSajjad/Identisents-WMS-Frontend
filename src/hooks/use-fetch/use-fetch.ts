import { useState, useEffect, useCallback, useRef } from 'react';

type ApiFunction<T> = (signal: AbortSignal) => Promise<T>;

interface UseApiConfig {
  enabled?: boolean;
  autoFetch?: boolean;
  retries?: number;
  retryDelay?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface UseApiResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  cancel: () => void;
  execute: () => void;
  reset: () => void;
  isSuccess: boolean;
  isError: boolean;
  isIdle: boolean;
}

export function useFetch<T>(
  apiFunction: ApiFunction<T>,
  config: UseApiConfig = {}
): UseApiResult<T> {
  const {
    enabled = true,
    autoFetch = true,
    retries = 0,
    retryDelay = 1000,
    onSuccess,
    onError,
  } = config;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(
    async (retryCount = 0) => {
      if (!enabled) return;

      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      controllerRef.current = new AbortController();
      const currentController = controllerRef.current;

      try {
        setIsLoading(true);
        setError(null);

        const result = await apiFunction(currentController.signal);

        if (!currentController.signal.aborted) {
          setData(result);
          onSuccess?.(result);
        }
      } catch (err: any) {
        if (!currentController.signal.aborted && err.name !== 'AbortError') {
          if (retryCount < retries) {
            setTimeout(() => {
              if (!currentController.signal.aborted) {
                fetchData(retryCount + 1);
              }
            }, retryDelay);
            return;
          }

          const errorObj = err instanceof Error ? err : new Error('Unknown error');
          setError(errorObj);
          onError?.(errorObj);
        }
      } finally {
        if (!currentController.signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [apiFunction, enabled, retries, retryDelay, onSuccess, onError]
  );

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const execute = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const cancel = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  }, []);

  useEffect(() => {
    if (autoFetch && enabled) {
      fetchData();
    }

    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [fetchData, autoFetch, enabled]);

  const isSuccess = !isLoading && !error && data !== null;
  const isError = !isLoading && error !== null;
  const isIdle = !isLoading && error === null && data === null;

  return {
    data,
    isLoading,
    error,
    refetch,
    cancel,
    execute,
    reset,
    isSuccess,
    isError,
    isIdle,
  };
}

// const { data, isLoading, error } = useApi(
//   signal => warehouseService.getWarehouses(page, 5, signal),
//   {
//     retries: 3,
//     retryDelay: 2000,
//     onSuccess: data => console.log('Loaded:', data),
//     onError: error => toast.error(error.message),
//     enabled: !!warehouseId,
//     autoFetch: true
//   }
// );
