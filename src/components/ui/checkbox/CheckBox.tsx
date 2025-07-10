import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, className = '', ...props }) => {
  return (
    <label className="inline-flex cursor-pointer items-center space-x-2 text-xs">
      <input
        type="checkbox"
        className={`h-4 w-4 cursor-pointer rounded border border-gray-300 text-blue-600 focus:ring-0 focus:outline-none ${className}`}
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  );
};
