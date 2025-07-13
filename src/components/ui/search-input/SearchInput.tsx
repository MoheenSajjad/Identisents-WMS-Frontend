import React from 'react';
import { Input, InputSize } from '../input';

type SearchInputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  icon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  error?: string;
  showErrorMessage?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  size?: InputSize;
  className?: string;
  borderClassName?: string;
  maxLength?: number;
  hasError?: boolean;
  type?: 'text' | 'email' | 'password' | 'url' | 'tel';
};

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({
    label,
    icon,
    value,
    placeholder,
    className,
    isRequired,
    hasError,
    isDisabled,
    onChange,
    onFocus,
    type = 'text',
  }) => {
    const [hasFocus, setHasFocus] = React.useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    };
    const handleFocus = () => {
      setHasFocus(true);
      onFocus?.();
    };
    return (
      <Input
        className={className}
        isRequired={isRequired}
        hasFocus={hasFocus}
        hasError={hasError}
        isDisabled={isDisabled}
      >
        {label && <Input.Label value={label} isRequired={isRequired} />}
        <Input.Border hasError={hasError} className="!mb-0 rounded-md">
          {typeof icon !== 'undefined' && <Input.Icon>{icon}</Input.Icon>}
          <Input.Control
            className={`${!icon && 'px-2'} ${isDisabled && 'rounded-lg bg-[#f3f0f0]'}`}
          >
            <Input.Control className={`${!icon && 'px-3'}`}>
              <input
                type={type}
                value={value}
                onChange={handleChange}
                onFocus={handleFocus}
                placeholder={placeholder}
                disabled={isDisabled}
                className="h-full w-full border-none bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
            </Input.Control>
          </Input.Control>
        </Input.Border>
      </Input>
    );
  }
);
