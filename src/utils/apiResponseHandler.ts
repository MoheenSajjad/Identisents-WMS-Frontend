import { successHandler } from './handlers/successHandler';
import { ApiResponse } from '@/types/api';

export function handleApiResponse<T>(response: ApiResponse<T>): void {
  if (response.success) {
    successHandler(response);
  } else {
    // errorHandler(response);
    throw response;
  }
}
