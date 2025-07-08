import * as React from 'react';

type SvgIconProps = {
  width?: number;
  height?: number;
  className?: string;
  children: React.ReactNode;
  strokeWidth?: number;
  fill?: string;
};

export const SvgIcon = (props: SvgIconProps): React.JSX.Element => {
  const { width = 18, height = 18, className, children, fill = 'none', strokeWidth = 1 } = props;

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
};
