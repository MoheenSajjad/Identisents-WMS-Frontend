import React from "react";
import { Input, InputSize } from "../input";
import { Icons } from "@/components/Icons";

type DateInputProps = {
  label?: string;
  placeholder?: string;
  value?: string; // ISO date string (YYYY-MM-DD)
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  icon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  size?: InputSize;
  className?: string;
  min?: string; // ISO date string
  max?: string; // ISO date string
  showCalendarIcon?: boolean;
};

export const DateInput: React.FC<DateInputProps> = ({
  label,
  placeholder,
  value = "",
  onChange,
  onBlur,
  onFocus,
  icon,
  suffixIcon,
  error,
  required = false,
  disabled = false,
  size = InputSize.DEFAULT,
  className,
  min,
  max,
  showCalendarIcon = true,
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
      {label && (
        <Input.Label value={label} hasError={!!error} isRequired={required} />
      )}
      <Input.Border hasError={!!error}>
        {icon && <Input.Icon>{icon}</Input.Icon>}
        <Input.Control>
          <input
            type="date"
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            min={min}
            max={max}
            className="w-full h-full bg-transparent border-none outline-none text-sm px-3"
          />
        </Input.Control>
        {showCalendarIcon && !suffixIcon && (
          <Input.Handler>
            <Icons.Calender />
          </Input.Handler>
        )}
        {suffixIcon && <Input.Handler>{suffixIcon}</Input.Handler>}
      </Input.Border>
      {error && <Input.Feedback value={error} />}
    </Input>
  );
};
