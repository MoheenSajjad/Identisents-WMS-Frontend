import { apiClient } from '@/utils/apiClient';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { IWarehouse, IWarehouseUpdate } from '@/types/warehouse';

class WarehouseService {
  static async getWarehouses(
    page: number,
    signal: AbortSignal
  ): Promise<ApiResponse<PaginatedResponse<IWarehouse[]>>> {
    return apiClient.post<ApiResponse<PaginatedResponse<IWarehouse[]>>>(
      `api/warehouse?page=${page}`,
      undefined,
      { signal }
    );
  }

  static async getWarehouseById(id: string, signal: AbortSignal): Promise<ApiResponse<IWarehouse>> {
    return apiClient.get<ApiResponse<IWarehouse>>(`/warehouse/${id}`, { signal });
  }

  static async updateWarehouse(
    id: string,
    data: IWarehouseUpdate,
    signal: AbortSignal
  ): Promise<ApiResponse<IWarehouse>> {
    return apiClient.put<ApiResponse<IWarehouse>>(`api/warehouse/${id}`, data, { signal });
  }

  static async createWarehouse(
    data: IWarehouseUpdate,
    signal: AbortSignal
  ): Promise<ApiResponse<IWarehouse>> {
    return apiClient.post<ApiResponse<IWarehouse>>(`api/warehouse/create`, data, { signal });
  }

  static async deleteWarehouse(id: string, signal: AbortSignal): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`api/warehouse/${id}?isDelete=true`, { signal });
  }
}

export { WarehouseService };
