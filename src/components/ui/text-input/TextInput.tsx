import React from 'react';
import { Input, InputSize } from '../input';

type TextInputProps = {
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
  required?: boolean;
  disabled?: boolean;
  size?: InputSize;
  className?: string;
  borderClassName?: string;
  maxLength?: number;
  type?: 'text' | 'email' | 'password' | 'url' | 'tel';
};

export const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  value = '',
  onChange,
  onBlur,
  onFocus,
  icon,
  suffixIcon,
  error,
  showErrorMessage = false,
  required = false,
  disabled = false,
  size = InputSize.DEFAULT,
  className,
  borderClassName,
  maxLength,
  type = 'text',
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <Input
      size={size}
      className={className}
      isRequired={required}
      hasFocus={isFocused}
      hasError={!!error}
      isDisabled={disabled}
    >
      {label && <Input.Label value={label} hasError={!!error} isRequired={required} />}
      <Input.Border
        className={borderClassName}
        hasError={!!error}
        showErrorMessage={showErrorMessage}
      >
        {icon && <Input.Icon>{icon}</Input.Icon>}
        <Input.Control className={`${!icon && 'px-3'}`}>
          <input
            type={type}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            className="h-full w-full border-none bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </Input.Control>
        {suffixIcon && <Input.Handler>{suffixIcon}</Input.Handler>}
      </Input.Border>
      {error && showErrorMessage && <Input.Feedback value={error} />}
    </Input>
  );
};
