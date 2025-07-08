import React from 'react';

interface OpacityWrapperProps {
  children: React.ReactNode;
  disabled?: boolean;
  opacity?: number;
}

export const OpacityWrapper: React.FC<OpacityWrapperProps> = ({
  children,
  disabled = false,
  opacity = 0.5,
}) => {
  return (
    <div className="relative">
      <div
        style={{ opacity: disabled ? opacity : 1 }}
        className={`transition-opacity duration-300 ${disabled ? 'pointer-events-none' : ''}`}
      >
        {children}
      </div>

      {disabled && <div className="absolute inset-0 z-10 bg-white opacity-50" />}
    </div>
  );
};
