import { apiClient } from '@/utils/apiClient';
import { ApiResponse } from '@/types/api';
import { ISAPWarehouses } from '@/types/warehouse';
import { ISAPItemGroup } from '@/components/parts/dropdowns/sap-item-group-dropdown';
import { ISAPItem } from '@/components/parts/dropdowns/sap-items-dropdown';

class SAPServices {
  static async getSAPWarehouses(
    companyId: string,
    signal: AbortSignal
  ): Promise<ApiResponse<ISAPWarehouses[]>> {
    return apiClient.get<ApiResponse<ISAPWarehouses[]>>(`sap/warehouses?companyId=${companyId}`, {
      signal,
    });
  }

  static async getSAPItemGroups(
    companyId: string,
    signal: AbortSignal
  ): Promise<ApiResponse<ISAPItemGroup[]>> {
    return apiClient.get<ApiResponse<ISAPItemGroup[]>>(`sap/item-groups?companyId=${companyId}`, {
      signal,
    });
  }

  static async getSAPItems(
    params: {
      companyId: string;
      GroupCode: string;
    },
    signal: AbortSignal
  ): Promise<ApiResponse<ISAPItem[]>> {
    return apiClient.get<ApiResponse<ISAPItem[]>>(
      `sap/items?companyId=${params.companyId}&GroupCode=${params.GroupCode}`,
      {
        signal,
      }
    );
  }
}

export { SAPServices };
