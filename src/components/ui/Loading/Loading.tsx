import React from 'react';

interface LoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
  text?: string;
  showLoader?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  isLoading,
  showLoader = true,
  children,
  text = 'Loading...',
}) => {
  return (
    <div className="relative">
      {isLoading && showLoader && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <span className="animate-spin-slow relative flex h-10 w-10 flex-wrap items-center justify-center gap-x-2">
              <span className="bg-primary/90 animate_fade animate_delay_1 h-3 w-3 rounded-full delay-200"></span>
              <span className="bg-primary/90 animate_fade animate_delay_4 h-3 w-3 rounded-full delay-1000"></span>
              <span className="bg-primary/90 animate_fade animate_delay_6 h-3 w-3 rounded-full delay-700"></span>
              <span className="bg-primary/90 animate_fade animate_delay_8 h-3 w-3 rounded-full"></span>
            </span>
            <div className="text-primary-light text-lg font-medium">{text}</div>
          </div>
        </div>
      )}
      <div className={isLoading ? 'opacity-50' : 'opacity-100'}>{children}</div>
    </div>
  );
};
