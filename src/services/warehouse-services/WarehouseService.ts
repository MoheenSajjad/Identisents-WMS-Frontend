import { apiClient } from '@/utils/apiClient';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { IWarehouse, IWarehouseDropdown, IWarehouseUpdate } from '@/types/warehouse';
import { successHandlers } from '@/utils/handlers/successHandler';
import { errorHandler } from '@/utils/handlers/errorHandler';

const ENTITY = 'Warehouse';

class WarehouseService {
  static async getWarehouses(
    page: number,
    signal: AbortSignal
  ): Promise<ApiResponse<PaginatedResponse<IWarehouse[]>>> {
    try {
      const response = await apiClient.post<ApiResponse<PaginatedResponse<IWarehouse[]>>>(
        `api/warehouse?page=${page}`,
        undefined,
        { signal }
      );
      return response;
    } catch (error) {
      errorHandler(error);
      throw error;
    }
  }

  static async getAllWarehouses(signal: AbortSignal): Promise<ApiResponse<IWarehouseDropdown[]>> {
    try {
      const response = await apiClient.get<ApiResponse<IWarehouseDropdown[]>>(`api/warehouse/all`, {
        signal,
      });
      return response;
    } catch (error) {
      errorHandler(error);
      throw error;
    }
  }

  static async updateWarehouse(
    id: string,
    data: IWarehouseUpdate,
    signal: AbortSignal
  ): Promise<ApiResponse<IWarehouse>> {
    try {
      const response = await apiClient.put<ApiResponse<IWarehouse>>(`api/warehouse/${id}`, data, {
        signal,
      });

      if (!response.success) throw response;

      successHandlers.update(response, ENTITY);
      return response;
    } catch (error) {
      errorHandler(error);
      throw error;
    }
  }

  static async createWarehouse(
    data: IWarehouseUpdate,
    signal: AbortSignal
  ): Promise<ApiResponse<IWarehouse>> {
    try {
      const response = await apiClient.post<ApiResponse<IWarehouse>>(`api/warehouse/create`, data, {
        signal,
      });

      if (!response.success) throw response;

      successHandlers.create(response, ENTITY);
      return response;
    } catch (error) {
      errorHandler(error);
      throw error;
    }
  }

  static async deleteWarehouse(id: string, signal: AbortSignal): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(
        `api/warehouse/${id}?isDelete=true`,
        { signal }
      );

      if (!response.success) throw response;

      successHandlers.delete(response, ENTITY);
      return response;
    } catch (error) {
      errorHandler(error);
      throw error;
    }
  }
}

export { WarehouseService };
