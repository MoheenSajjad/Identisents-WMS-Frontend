import { ApiResponse } from '@/types/api';
import { useState } from 'react';

export function useApi<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (apiCall: () => Promise<ApiResponse<T>>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();

      if (response.success) {
        setData(response.data);
        return response;
      } else {
        setError(response.message);
        throw new Error(response.message);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Something went wrong';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { data, loading, error, execute, reset };
}
