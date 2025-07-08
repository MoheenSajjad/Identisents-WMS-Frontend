import { ApiResponse, PaginatedResponse } from '@/types/api';
import { ICompany, CreateCompanyData, UpdateCompanyData } from '@/types/company';
import { apiClient } from '@/utils/apiClient';

class CompanyServices {
  static async getCompanies(
    page: number,
    signal: AbortSignal
  ): Promise<ApiResponse<PaginatedResponse<ICompany[]>>> {
    return apiClient.post<ApiResponse<PaginatedResponse<ICompany[]>>>(
      `api/company?page=${page}`,
      undefined,
      { signal }
    );
  }

  static async createCompany(
    data: CreateCompanyData,
    signal: AbortSignal
  ): Promise<ApiResponse<ICompany>> {
    return apiClient.post<ApiResponse<ICompany>>('api/company/create', data, { signal });
  }

  static async updateCompany(
    id: string,
    data: UpdateCompanyData,
    signal: AbortSignal
  ): Promise<ApiResponse<ICompany>> {
    return apiClient.put<ApiResponse<ICompany>>(`api/company/${id}`, data, { signal });
  }

  static async deleteCompany(id: string, signal: AbortSignal): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`api/company/${id}`, { signal });
  }

  static async getAllCompanies(signal: AbortSignal): Promise<ApiResponse<ICompany[]>> {
    return apiClient.get<ApiResponse<ICompany[]>>(`api/company/all`, { signal });
  }
}

export const CompanyService = CompanyServices;
