import { ApiResponse, PaginatedResponse, PaginationFilters, PaginationInfo } from '@/types/api';
import { useState } from 'react';

export function usePagination<T>(initialFilters: PaginationFilters) {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [filters, setFilters] = useState<PaginationFilters>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (
    apiCall: (filters: PaginationFilters) => Promise<ApiResponse<PaginatedResponse<T>>>
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall(filters);

      if (response.success) {
        setData(response.data.records);
        setPagination(response.data.pagination);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Something went wrong';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: Partial<PaginationFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1,
    }));
  };

  const goToPage = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const changeLimit = (limit: number) => {
    setFilters(prev => ({ ...prev, limit, page: 1 }));
  };

  const reset = () => {
    setData([]);
    setPagination(null);
    setError(null);
    setFilters(initialFilters);
  };

  return {
    data,
    pagination,
    filters,
    loading,
    error,
    fetchData,
    updateFilters,
    goToPage,
    changeLimit,

    reset,
  };
}
