import React from 'react';

export interface ILoadingBoundaryProps {
  isLoading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LoadingBoundary: React.FC<ILoadingBoundaryProps> = ({
  isLoading = false,
  children,
  fallback = <div>Loading...</div>,
}) => {
  return isLoading ? <>{fallback}</> : <>{children}</>;
};
