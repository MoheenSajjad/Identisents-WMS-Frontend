import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loginUser, logoutUser, restoreAuth, clearError } from '@/redux/slices/authSlice';
import { RootState, AppDispatch } from '@/redux/store';
import { useAppDispatch, useTSelector } from '../use-redux';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      dispatch(restoreAuth());
    }
  }, [dispatch, auth.isAuthenticated]);

  const login = async (username: string, password: string) => {
    const result = await dispatch(loginUser({ username, password })).unwrap();
    return result;
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    ...auth,
    login,
    logout,
    clearError: clearAuthError,
  };
};
