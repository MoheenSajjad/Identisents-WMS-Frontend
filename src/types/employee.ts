export interface IEmployeeDropdown {
  _id: string;
  employeeCode: string;
  employeeName: string;
}

export interface IEmployee {
  _id: string;
  employeeCode: string;
  employeeName: string;
  userName: string;
  companies?: IEmployeeAssignedCompanies[];
  email: string;
  mobilePhone: string;
  isMobileUser: boolean;
  isPortalUser: boolean;
  permissions: IEmployeePermissions;
  userCode: string;
  password: string;
  lastLoginAt: string | null;
  passwordChangedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IEmployeeAssignedCompanies {
  id: string;
  isDefault: boolean;
  name: string;
  logoUrl: string;
}

export interface ICreateEmployee {
  employeeCode: string;
  employeeName: string;
  userName: string;
  email: string;
  mobilePhone: string;
  isMobileUser: boolean;
  isPortalUser: boolean;
  password?: string;
  companies: {
    id: string;
    isDefault: boolean;
  }[];
}

export interface IEmployeePermissions {
  mobilePermissions: IMobilePermission[];
  portalPermissions: IPortalPermission[];
}

export interface IMobilePermission {
  module: MOBILE_MODULES;
  fullAccess: boolean;
  noAccess: boolean;
}

export interface IPortalPermission {
  module: PORTAL_MODULES;
  isRead: boolean;
  fullAccess: boolean;
  noAccess: boolean;
}

export enum MOBILE_MODULES {
  STOCK_INBOUND = 'Stock inbound',
  STOCK_OUTBOUND = 'Stock outbound',
  STOCK_COUNTING = 'Stock counting',
  STOCK_TRANSFER = 'Stock transfer',
  STOCK_OVERVIEW = 'Stock overview',
}

export enum PORTAL_MODULES {
  COMPANY = 'Company',
  EMPLOYEES = 'Employees',
  WAREHOUSES = 'Warehouses',
  BIN_SUB_LEVELS = 'Bin sub levels',
  BIN_LOCATIONS = 'Bin locations',
  JOBS = 'Jobs',
}
