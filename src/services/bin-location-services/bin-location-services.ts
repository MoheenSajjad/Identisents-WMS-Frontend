import { IGeneratedBinLocation } from '@/components/parts/modals/bin-location-generated-codes-modal/columns';
import { ApiResponse } from '@/types/api';
import {
  IBinLocation,
  ICreateBinLocation,
  IGenerateBinLocationCodesProps,
} from '@/types/bin-location';
import { apiClient } from '@/utils/apiClient';

class BinLocationServices {
  static async getBinLocations(signal: AbortSignal): Promise<ApiResponse<IBinLocation[]>> {
    return apiClient.get<ApiResponse<IBinLocation[]>>('api/binLocation', { signal });
  }

  static async createBulkBinLocations(
    data: IGeneratedBinLocation[],
    signal: AbortSignal
  ): Promise<ApiResponse<IBinLocation[]>> {
    return apiClient.post<ApiResponse<IBinLocation[]>>(
      'api/binLocation/bulk-create',
      { binLocations: data },
      {
        signal,
      }
    );
  }

  static async generateCodes(
    data: IGenerateBinLocationCodesProps,
    signal: AbortSignal
  ): Promise<ApiResponse<IGeneratedBinLocation[]>> {
    return apiClient.post<ApiResponse<IGeneratedBinLocation[]>>(
      'api/binLocation/generate-codes',
      data,
      {
        signal,
      }
    );
  }

  static async updateBinLocation(
    id: string,
    data: ICreateBinLocation,
    signal: AbortSignal
  ): Promise<ApiResponse<IBinLocation>> {
    return apiClient.put<ApiResponse<IBinLocation>>(`api/binLocation/${id}`, data, { signal });
  }

  static async deleteBinLocation(
    id: string,
    isDelete: boolean,
    signal: AbortSignal
  ): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`api/binLocation/${id}?isDelete=${!isDelete}`, {
      signal,
    });
  }
}

export const BinLocationService = BinLocationServices;
