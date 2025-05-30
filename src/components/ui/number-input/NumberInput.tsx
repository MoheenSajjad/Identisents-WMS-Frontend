import React from "react";
import { Input, InputSize } from "../input";

type NumberInputProps = {
  label?: string;
  placeholder?: string;
  value?: number;
  onChange?: (value: number | undefined) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  icon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  size?: InputSize;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  decimalPlaces?: number;
};

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  placeholder,
  value,
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
  step = 1,
  decimalPlaces,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(
    value !== undefined ? value.toString() : ""
  );

  React.useEffect(() => {
    setInputValue(value !== undefined ? value.toString() : "");
  }, [value]);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (newValue === "") {
      onChange?.(undefined);
      return;
    }

    const numValue = parseFloat(newValue);
    if (!isNaN(numValue)) {
      const clampedValue =
        min !== undefined && max !== undefined
          ? Math.min(Math.max(numValue, min), max)
          : min !== undefined
          ? Math.max(numValue, min)
          : max !== undefined
          ? Math.min(numValue, max)
          : numValue;

      const finalValue =
        decimalPlaces !== undefined
          ? parseFloat(clampedValue.toFixed(decimalPlaces))
          : clampedValue;

      onChange?.(finalValue);
    }
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
            type="number"
            value={inputValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            className="w-full h-full bg-transparent border-none outline-none text-sm px-3"
          />
        </Input.Control>
        {suffixIcon && <Input.Handler>{suffixIcon}</Input.Handler>}
      </Input.Border>
      {error && <Input.Feedback value={error} />}
    </Input>
  );
};
