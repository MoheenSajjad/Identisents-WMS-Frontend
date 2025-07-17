import { IGeneratedBinLocation } from '@/components/parts/modals/bin-location-generated-codes-modal/columns';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import {
  IBinLocation,
  ICreateBinLocation,
  IUpdateBinLocation,
  IGenerateBinLocationCodesProps,
} from '@/types/bin-location';
import { apiClient } from '@/utils/apiClient';
import { successHandler, successHandlers } from '@/utils/handlers/successHandler';
import { errorHandler } from '@/utils/handlers/errorHandler';

const ENTITY = 'Bin Location';

class BinLocationServices {
  static async getBinLocations(
    page: number,
    signal: AbortSignal
  ): Promise<ApiResponse<PaginatedResponse<IBinLocation[]>>> {
    try {
      const response = await apiClient.get<ApiResponse<PaginatedResponse<IBinLocation[]>>>(
        `api/binLocation?page=${page}`,
        {
          signal,
        }
      );
      return response;
    } catch (error) {
      errorHandler(error);
      throw error;
    }
  }

  static async createBulkBinLocations(
    data: IGeneratedBinLocation[],
    signal: AbortSignal
  ): Promise<ApiResponse<IBinLocation[]>> {
    try {
      const response = await apiClient.post<ApiResponse<IBinLocation[]>>(
        'api/binLocation/bulk-create',
        { binLocations: data },
        { signal }
      );

      if (!response.success) throw response;

      successHandlers.create(response, ENTITY);
      return response;
    } catch (error) {
      errorHandler(error);
      throw error;
    }
  }

  static async generateCodes(
    data: IGenerateBinLocationCodesProps,
    signal: AbortSignal
  ): Promise<ApiResponse<IGeneratedBinLocation[]>> {
    try {
      const response = await apiClient.post<ApiResponse<IGeneratedBinLocation[]>>(
        'api/binLocation/generate-codes',
        data,
        { signal }
      );
      successHandler(response);
      return response;
    } catch (error) {
      errorHandler(error);
      throw error;
    }
  }

  static async updateBinLocation(
    id: string,
    data: IUpdateBinLocation,
    signal: AbortSignal
  ): Promise<ApiResponse<IBinLocation>> {
    try {
      const response = await apiClient.put<ApiResponse<IBinLocation>>(
        `api/binLocation/${id}`,
        data,
        { signal }
      );

      if (!response.success) throw response;

      successHandlers.update(response, ENTITY);
      return response;
    } catch (error) {
      errorHandler(error);
      throw error;
    }
  }

  static async deleteBinLocation(
    id: string,
    isDelete: boolean,
    signal: AbortSignal
  ): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(
        `api/binLocation/${id}?isDelete=${!isDelete}`,
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

export const BinLocationService = BinLocationServices;
