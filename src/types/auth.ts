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
  success: boolean;
  id: string;
}
