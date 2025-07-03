import { apiClient } from '@/utils/apiClient';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { IWarehouse } from '@/types/warehouse';

class WarehouseService {
  static async getWarehouses(
    page: number,
    signal: AbortSignal
  ): Promise<ApiResponse<PaginatedResponse<IWarehouse[]>>> {
    return apiClient.post<ApiResponse<PaginatedResponse<IWarehouse[]>>>(
      `/warehouse?page=${page}`,
      undefined,
      { signal }
    );
  }

  static async getWarehouseById(id: string, signal: AbortSignal): Promise<ApiResponse<IWarehouse>> {
    return apiClient.get<ApiResponse<IWarehouse>>(`/warehouse/${id}`, { signal });
  }
}

export { WarehouseService };
