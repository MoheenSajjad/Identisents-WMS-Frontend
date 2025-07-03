import { ApiResponse, PaginatedResponse } from '@/types/api';
import { ICompany, CreateCompanyData, UpdateCompanyData } from '@/types/company';
import { apiClient } from '@/utils/apiClient';

class CompanyServices {
  static async getCompanies(
    page: number,
    signal: AbortSignal
  ): Promise<ApiResponse<PaginatedResponse<ICompany[]>>> {
    return apiClient.post<ApiResponse<PaginatedResponse<ICompany[]>>>(
      `/company?page=${page}`,
      undefined,
      { signal }
    );
  }

  static async getCompanyById(id: string, signal: AbortSignal): Promise<ApiResponse<ICompany>> {
    return apiClient.get<ApiResponse<ICompany>>(`/company/${id}`, { signal });
  }

  static async createCompany(
    data: CreateCompanyData,
    signal: AbortSignal
  ): Promise<ApiResponse<ICompany>> {
    return apiClient.post<ApiResponse<ICompany>>('/company/create', data, { signal });
  }

  static async updateCompany(
    id: string,
    data: UpdateCompanyData,
    signal: AbortSignal
  ): Promise<ApiResponse<ICompany>> {
    return apiClient.put<ApiResponse<ICompany>>(`/company/${id}`, data, { signal });
  }

  static async deleteCompany(id: string, signal: AbortSignal): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/company/${id}`, { signal });
  }

  static async searchCompanies(
    query: string,
    page: number = 1,
    limit: number = 10,
    signal: AbortSignal
  ): Promise<ApiResponse<PaginatedResponse<ICompany>>> {
    return apiClient.get<ApiResponse<PaginatedResponse<ICompany>>>(
      `/companies/search?search=${query}&page=${page}&limit=${limit}`,
      { signal }
    );
  }

  static async getCompaniesByStatus(
    isActive: boolean,
    page: number = 1,
    limit: number = 10,
    signal: AbortSignal
  ): Promise<ApiResponse<PaginatedResponse<ICompany>>> {
    return apiClient.get<ApiResponse<PaginatedResponse<ICompany>>>(
      `/companies?isActive=${isActive}&page=${page}&limit=${limit}`,
      { signal }
    );
  }
}

export const CompanyService = CompanyServices;
