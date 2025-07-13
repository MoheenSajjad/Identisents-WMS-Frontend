import React from 'react';
import GearSvg from '@/assets/setting_asset.gif';

interface LoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
  text?: string;
}

export const GearLoading: React.FC<LoadingProps> = ({
  isLoading,
  children,
  text = 'Loading...',
}) => {
  return (
    <div className="relative">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <img src={GearSvg} alt="gears" className="w-50" />
            <div className="text-primary-light text-lg font-medium">{text}</div>
          </div>
        </div>
      )}
      <div className={isLoading ? 'opacity-30' : 'opacity-100'}>{children}</div>
    </div>
  );
};
