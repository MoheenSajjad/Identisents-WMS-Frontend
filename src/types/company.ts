import { PaginationFilters } from './api';

export interface ICompany {
  id: string;
  name: string;
  databaseId: string;
  serverUrl: string;
  password: string;
  logoUrl: string;
  createdAt: string;
}

export interface CompanyFilters extends PaginationFilters {
  search?: string;
  name?: string;
  serverUrl?: string;
  databaseId?: string;
}

export interface CreateCompanyData {
  name: string;
  databaseId: string;
  serverUrl: string;
  password: string;
  logoUrl?: string;
}

export interface UpdateCompanyData {
  name?: string;
  databaseId?: string;
  serverUrl?: string;
  password?: string;
  logoUrl?: string;
}
