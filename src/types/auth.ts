export interface AuthState {
  user: { id: string } | null;
  credentials: { username: string; password: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  data: {
    token: string;
    user: {
      _id: string;
      employeeCode: string;
      employeeName: string;
      email: string;
      isMobileUser: true;
      isPortalUser: false;
      companies: [
        {
          isDefault: true;
          _id: string;
          name: string;
        },
        {
          isDefault: false;
          _id: string;
          name: string;
        },
      ];
    };
  };
}
