import { ApiResponse } from '@/types/api';
import { ISubLevels } from '@/types/sub-levels';
import { apiClient } from '@/utils/apiClient';

class SubLevelServices {
  static async getSubLevels(signal: AbortSignal): Promise<ApiResponse<ISubLevels[]>> {
    return apiClient.get<ApiResponse<ISubLevels[]>>(`api/binLocAct`, { signal });
  }
}

export const SubLevelService = SubLevelServices;
