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
  isRequired?: boolean;
  isDisabled?: boolean;
  size?: InputSize;
  className?: string;
  borderClassName?: string;
  maxLength?: number;
  hasError?: boolean;
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
  isRequired = false,
  isDisabled = false,
  size = InputSize.DEFAULT,
  className,
  borderClassName,
  maxLength,
  type = 'text',
  hasError,
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
      isRequired={isRequired}
      hasFocus={isFocused}
      hasError={!!error}
      isDisabled={isDisabled}
    >
      {label && <Input.Label value={label} hasError={!!error} isRequired={isRequired} />}
      <Input.Border className={borderClassName} hasError={true} showErrorMessage={showErrorMessage}>
        {icon && <Input.Icon>{icon}</Input.Icon>}
        <Input.Control className={`${!icon && 'px-3'}`}>
          <input
            type={type}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={isDisabled}
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
