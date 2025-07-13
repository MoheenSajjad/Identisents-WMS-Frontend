export interface IEmployeeDropdown {
  _id: string;
  employeeCode: string;
  employeeName: string;
}

export interface IEmployee {
  _id: string;
  employeeCode: string;
  employeeName: string;
  companies?: IEmployeeAssignedCompanies[];
  email: string;
  mobilePhone: string;
  isMobileUser: boolean;
  isPortalUser: boolean;
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
