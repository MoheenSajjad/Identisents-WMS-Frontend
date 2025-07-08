import { ApiResponse } from '@/types/api';
import { IEmployeeDropdown } from '@/types/employee';
import { apiClient } from '@/utils/apiClient';

class EmployeeServices {
  static async getAllEmployees(signal: AbortSignal): Promise<ApiResponse<IEmployeeDropdown[]>> {
    return apiClient.get<ApiResponse<IEmployeeDropdown[]>>(`api/employee/all`, { signal });
  }
}

export const EmployeeService = EmployeeServices;
