import { ApiResponse, PaginatedResponse } from '@/types/api';
import { ICreateEmployee, IEmployee, IEmployeeDropdown } from '@/types/employee';
import { apiClient } from '@/utils/apiClient';
import { successHandlers } from '@/utils/handlers/successHandler';
import { errorHandler } from '@/utils/handlers/errorHandler';

const ENTITY = 'Employee';

class EmployeeServices {
  static async getAllEmployees(signal: AbortSignal): Promise<ApiResponse<IEmployeeDropdown[]>> {
    try {
      const response = await apiClient.get<ApiResponse<IEmployeeDropdown[]>>(`api/employee/all`, {
        signal,
      });
      return response;
    } catch (error) {
      errorHandler(error);
      throw error;
    }
  }

  static async get(signal: AbortSignal): Promise<ApiResponse<PaginatedResponse<IEmployee[]>>> {
    try {
      const response = await apiClient.post<ApiResponse<PaginatedResponse<IEmployee[]>>>(
        `api/employee`,
        undefined,
        { signal }
      );
      return response;
    } catch (error) {
      errorHandler(error);
      throw error;
    }
  }

  static async create(data: ICreateEmployee, signal: AbortSignal): Promise<ApiResponse<IEmployee>> {
    try {
      const response = await apiClient.post<ApiResponse<IEmployee>>('api/employee/create', data, {
        signal,
      });

      if (!response.success) throw response;

      successHandlers.create(response, ENTITY);
      return response;
    } catch (error) {
      errorHandler(error);
      throw error;
    }
  }

  static async update(
    id: string,
    data: ICreateEmployee,
    signal: AbortSignal
  ): Promise<ApiResponse<IEmployee>> {
    try {
      const response = await apiClient.put<ApiResponse<IEmployee>>(`api/employee/${id}`, data, {
        signal,
      });

      if (!response.success) throw response;

      successHandlers.update(response, ENTITY);
      return response;
    } catch (error) {
      errorHandler(error);
      throw error;
    }
  }

  static async delete(
    id: string,
    isDeleted: boolean,
    signal: AbortSignal
  ): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(
        `api/employee/${id}?isDelete=${!isDeleted}`,
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

export const EmployeeService = EmployeeServices;
