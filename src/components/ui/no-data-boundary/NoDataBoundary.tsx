import React from 'react';
import { Empty } from '../Empty';

export interface INoDataBoundaryProps {
  condition?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const NoDataBoundary: React.FC<INoDataBoundaryProps> = ({
  condition = true,
  children,
  fallback = <Empty label="No Data Found" />,
}) => {
  return condition ? <>{children}</> : <>{fallback}</>;
};
