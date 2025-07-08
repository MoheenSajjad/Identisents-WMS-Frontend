import { ApiResponse } from '@/types/api';
import { IBinSubLevels, ICreateBinSubLevel } from '@/types/bin-sub-levels';
import { apiClient } from '@/utils/apiClient';

class BinSubLevelServices {
  static async getBinSubLevels(signal: AbortSignal): Promise<ApiResponse<IBinSubLevels[]>> {
    return apiClient.get<ApiResponse<IBinSubLevels[]>>(`api/binLocSubLev`, { signal });
  }

  static async createBinSubLevel(
    data: ICreateBinSubLevel,
    signal: AbortSignal
  ): Promise<ApiResponse<IBinSubLevels>> {
    return apiClient.post<ApiResponse<IBinSubLevels>>('api/binLocSubLev/create', data, { signal });
  }

  static async updateBinSubLevel(
    id: string,
    data: ICreateBinSubLevel,
    signal: AbortSignal
  ): Promise<ApiResponse<IBinSubLevels>> {
    return apiClient.put<ApiResponse<IBinSubLevels>>(`api/binLocSubLev/${id}`, data, { signal });
  }

  static async deleteBinSubLevel(
    id: string,
    isDeleted: boolean,
    signal: AbortSignal
  ): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`api/binLocSubLev/${id}?isDelete=${!isDeleted}`, {
      signal,
    });
  }
}

export const BinSubLevelService = BinSubLevelServices;
