import { ApiResponse, PaginatedResponse } from '@/types/api';
import { ICreateEmployee, IEmployee, IEmployeeDropdown } from '@/types/employee';
import { apiClient } from '@/utils/apiClient';

class EmployeeServices {
  static async getAllEmployees(signal: AbortSignal): Promise<ApiResponse<IEmployeeDropdown[]>> {
    return apiClient.get<ApiResponse<IEmployeeDropdown[]>>(`api/employee/all`, { signal });
  }

  static async get(signal: AbortSignal): Promise<ApiResponse<PaginatedResponse<IEmployee[]>>> {
    return apiClient.post<ApiResponse<PaginatedResponse<IEmployee[]>>>(`api/employee`, undefined, {
      signal,
    });
  }

  static async create(data: ICreateEmployee, signal: AbortSignal): Promise<ApiResponse<IEmployee>> {
    return apiClient.post<ApiResponse<IEmployee>>('api/employee/create', data, { signal });
  }

  static async update(
    id: string,
    data: ICreateEmployee,
    signal: AbortSignal
  ): Promise<ApiResponse<IEmployee>> {
    return apiClient.put<ApiResponse<IEmployee>>(`api/company/${id}`, data, { signal });
  }

  static async delete(
    id: string,
    isDeleted: boolean,
    signal: AbortSignal
  ): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`api/binLocSubLev/${id}?isDelete=${!isDeleted}`, {
      signal,
    });
  }
}

export const EmployeeService = EmployeeServices;
