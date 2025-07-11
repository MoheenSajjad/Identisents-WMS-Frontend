import { ApiResponse } from '@/types/api';
import { ISubLevels } from '@/types/sub-levels';
import { apiClient } from '@/utils/apiClient';
import { errorHandler } from '@/utils/handlers/errorHandler';

class SubLevelServices {
  static async getSubLevels(signal: AbortSignal): Promise<ApiResponse<ISubLevels[]>> {
    try {
      const response = await apiClient.get<ApiResponse<ISubLevels[]>>(`api/binLocAct`, {
        signal,
      });
      return response;
    } catch (error) {
      errorHandler(error);
      throw error;
    }
  }
}

export const SubLevelService = SubLevelServices;
