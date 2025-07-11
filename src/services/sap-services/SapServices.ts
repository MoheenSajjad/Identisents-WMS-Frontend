import { apiClient } from '@/utils/apiClient';
import { ApiResponse } from '@/types/api';
import { ISAPWarehouses } from '@/types/warehouse';

class SAPServices {
  static async getSAPWarehouses(
    companyId: string,
    signal: AbortSignal
  ): Promise<ApiResponse<ISAPWarehouses[]>> {
    return apiClient.get<ApiResponse<ISAPWarehouses[]>>(`sap/warehouses?companyId=${companyId}`, {
      signal,
    });
  }
}

export { SAPServices };
