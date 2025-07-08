export interface ApiResponse<T = any> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

export interface PaginationFilters {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationInfo {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export interface PaginatedResponse<T> {
  records: T;
  pagination: PaginationInfo;
}
