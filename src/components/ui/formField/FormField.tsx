import { Controller, FieldError, FieldValues, Path, Control } from 'react-hook-form';
import { TextInput, TextInputType } from '../text-input';
import { PasswordInput } from '../password-input';

interface FormFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label?: string;
  placeholder?: string;
  className?: string;
  control: Control<TFieldValues>;
  error?: FieldError;
  hasError?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  type?: TextInputType;
}

export const TextFormField = <TFieldValues extends FieldValues>({
  name,
  label,
  placeholder,
  className,
  control,
  error,
  hasError,
  isDisabled,
  isRequired,
  type = TextInputType.TEXT,
}: FormFieldProps<TFieldValues>) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <TextInput
        {...field}
        type={type}
        label={label}
        className={`w-full ${className}`}
        placeholder={`Enter ${placeholder ?? label}`}
        hasError={hasError}
        error={error?.message}
        isRequired={isRequired}
        isDisabled={isDisabled}
      />
    )}
  />
);

export const NumberFormField = <TFieldValues extends FieldValues>({
  name,
  label,
  placeholder,
  className,
  control,
  error,
  hasError,
  isDisabled,
  isRequired,
  type = TextInputType.NUMBER,
}: FormFieldProps<TFieldValues>) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <TextInput
        {...field}
        type={type}
        label={label}
        onChange={value => {
          const parsedValue = parseFloat(value);
          field.onChange(parsedValue);
        }}
        className={`w-full ${className}`}
        placeholder={`Enter ${placeholder ?? label}`}
        hasError={hasError}
        error={error?.message}
        isRequired={isRequired}
        isDisabled={isDisabled}
      />
    )}
  />
);

export const PasswordFormField = <TFieldValues extends FieldValues>({
  name,
  label,
  placeholder,
  className,
  control,
  error,
  hasError,
  isDisabled,
  isRequired,
}: FormFieldProps<TFieldValues>) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <PasswordInput
        {...field}
        label={label}
        className={`w-full ${className}`}
        placeholder={`Enter ${placeholder ?? label}`}
        hasError={hasError}
        error={error?.message}
        isRequired={isRequired}
        isDisabled={isDisabled}
      />
    )}
  />
);
