import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { AuthState, LoginCredentials, LoginResponse } from '@/types/auth';
import { apiUrl } from '@/config';

export const loginUser = createAsyncThunk<
  { username: string; password: string; userId: string },
  LoginCredentials,
  { rejectValue: string }
>('auth/loginUser', async ({ username, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post<LoginResponse>(
      `${apiUrl}/api/auth/login`,
      {
        username,
        password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(response, 'response');

    if (response.data.success) {
      const authData = {
        username,
        password,
        userId: response.data.id,
        isAuthenticated: true,
      };

      // sessionStorage.setItem('authData', JSON.stringify(authData));

      return { username, password, userId: response.data.id };
    } else {
      return rejectWithValue('Login failed');
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return rejectWithValue(axiosError.response?.data?.message || 'Login failed');
  }
});

export const logoutUser = createAsyncThunk<void, void>('auth/logoutUser', async () => {
  sessionStorage.removeItem('authData');
});

const loadAuthFromStorage = (): Partial<AuthState> => {
  try {
    const storedAuth = sessionStorage.getItem('authData');
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      return {
        user: { id: authData.userId },
        credentials: {
          username: authData.username,
          password: authData.password,
        },
        isAuthenticated: true,
      };
    }
    return {};
  } catch (error) {
    sessionStorage.removeItem('authData');
    return {};
  }
};

const initialState: AuthState = {
  user: null,
  credentials: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  ...loadAuthFromStorage(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    restoreAuth: state => {
      const authData = loadAuthFromStorage();
      if (authData.user && authData.credentials) {
        state.user = authData.user;
        state.credentials = authData.credentials;
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: builder => {
    builder

      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = { id: action.payload.userId };
        state.credentials = {
          username: action.payload.username,
          password: action.payload.password,
        };
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.credentials = null;
        state.error = action.payload || 'Login failed';
      })

      .addCase(logoutUser.fulfilled, state => {
        state.isAuthenticated = false;
        state.user = null;
        state.credentials = null;
        state.error = null;
        state.isLoading = false;
      });
  },
});

export const { clearError, restoreAuth } = authSlice.actions;
export default authSlice.reducer;
