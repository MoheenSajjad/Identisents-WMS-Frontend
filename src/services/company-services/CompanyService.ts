import { ApiResponse, PaginatedResponse, PaginationFilters } from '@/types/api';
import { CompanyFilters, CreateCompanyData, ICompany, UpdateCompanyData } from '@/types/company';

import { apiClient } from '@/utils/apiClient';
class CompanyService {
  async getCompanies(filters: CompanyFilters): Promise<ApiResponse<PaginatedResponse<ICompany>>> {
    const params: any = {
      page: filters.page,
      limit: filters.limit,
    };

    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;
    if (filters.search) params.search = filters.search;
    if (filters.name) params.name = filters.name;
    if (filters.serverUrl) params.serverUrl = filters.serverUrl;
    if (filters.databaseId) params.databaseId = filters.databaseId;

    return apiClient.post('/company', filters);
  }

  async createCompany(data: CreateCompanyData): Promise<ApiResponse<ICompany>> {
    return apiClient.post('/company', data);
  }

  async updateCompany(id: string, data: UpdateCompanyData): Promise<ApiResponse<ICompany>> {
    return apiClient.patch(`/company/${id}`, data);
  }

  async deleteCompany(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/company/${id}`);
  }

  async getCompanyById(id: string): Promise<ApiResponse<ICompany>> {
    return apiClient.get(`/company/${id}`);
  }
}

export const companyService = new CompanyService();
