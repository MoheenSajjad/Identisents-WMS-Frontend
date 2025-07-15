import { ApiResponse } from '@/types/api';
import { IAllBinSubLevels, IBinSubLevels, ICreateBinSubLevel } from '@/types/bin-sub-levels';
import { apiClient } from '@/utils/apiClient';
import { successHandlers } from '@/utils/handlers/successHandler';
import { errorHandler } from '@/utils/handlers/errorHandler';

const ENTITY = 'Bin Sub Level';

class BinSubLevelServices {
  static async getBinSubLevels(signal: AbortSignal): Promise<ApiResponse<IBinSubLevels[]>> {
    try {
      const response = await apiClient.get<ApiResponse<IBinSubLevels[]>>(`api/binLocSubLev`, {
        signal,
      });
      return response;
    } catch (error) {
      errorHandler(error);
      throw error;
    }
  }

  static async getAll(signal: AbortSignal): Promise<ApiResponse<IAllBinSubLevels[]>> {
    try {
      const response = await apiClient.get<ApiResponse<IAllBinSubLevels[]>>(
        `api/binLocSubLev/all`,
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

  static async createBinSubLevel(
    data: ICreateBinSubLevel,
    signal: AbortSignal
  ): Promise<ApiResponse<IBinSubLevels>> {
    try {
      const response = await apiClient.post<ApiResponse<IBinSubLevels>>(
        'api/binLocSubLev/create',
        data,
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

  static async updateBinSubLevel(
    id: string,
    data: ICreateBinSubLevel,
    signal: AbortSignal
  ): Promise<ApiResponse<IBinSubLevels>> {
    try {
      const response = await apiClient.put<ApiResponse<IBinSubLevels>>(
        `api/binLocSubLev/${id}`,
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

  static async deleteBinSubLevel(
    id: string,
    isDeleted: boolean,
    signal: AbortSignal
  ): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(
        `api/binLocSubLev/${id}?isDelete=${!isDeleted}`,
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

export const BinSubLevelService = BinSubLevelServices;
