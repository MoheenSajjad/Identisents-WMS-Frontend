import { ApiResponse, PaginatedResponse } from '@/types/api';
import { ICompany, CreateCompanyData, UpdateCompanyData } from '@/types/company';
import { apiClient } from '@/utils/apiClient';
import { successHandlers } from '@/utils/handlers/successHandler';
import { errorHandler } from '@/utils/handlers/errorHandler';

const ENTITY = 'Company';

class CompanyServices {
  static async getCompanies(
    page: number,
    signal: AbortSignal
  ): Promise<ApiResponse<PaginatedResponse<ICompany[]>>> {
    try {
      const response = await apiClient.post<ApiResponse<PaginatedResponse<ICompany[]>>>(
        `api/company?page=${page}`,
        undefined,
        { signal }
      );
      return response;
    } catch (error) {
      errorHandler(error);
      throw error;
    }
  }

  static async createCompany(
    data: CreateCompanyData,
    signal: AbortSignal
  ): Promise<ApiResponse<ICompany>> {
    try {
      const response = await apiClient.post<ApiResponse<ICompany>>('api/company/create', data, {
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

  static async updateCompany(
    id: string,
    data: UpdateCompanyData,
    signal: AbortSignal
  ): Promise<ApiResponse<ICompany>> {
    try {
      const response = await apiClient.put<ApiResponse<ICompany>>(`api/company/${id}`, data, {
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

  static async deleteCompany(id: string, signal: AbortSignal): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`api/company/${id}`, { signal });

      if (!response.success) throw response;

      successHandlers.delete(response, ENTITY);
      return response;
    } catch (error) {
      errorHandler(error);
      throw error;
    }
  }

  static async getAllCompanies(signal: AbortSignal): Promise<ApiResponse<ICompany[]>> {
    try {
      const response = await apiClient.get<ApiResponse<ICompany[]>>(`api/company/all`, { signal });
      return response;
    } catch (error) {
      errorHandler(error);
      throw error;
    }
  }
}

export const CompanyService = CompanyServices;
