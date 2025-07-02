import { PaginationFilters } from './api';

export interface ICompany {
  _id: string;
  name: string;
  username: string;
  database: string;
  serverUrl: string;
  password: string;
  logoUrl: string;
  createdAt: string;
}

export interface CompanyFilters extends PaginationFilters {
  search?: string;
  name?: string;
  serverUrl?: string;
  database?: string;
}

export interface CreateCompanyData {
  name: string;
  database: string;
  serverUrl: string;
  password: string;
  logoUrl?: string;
}

export interface UpdateCompanyData {
  name?: string;
  database?: string;
  serverUrl?: string;
  password?: string;
  logoUrl?: string;
}
