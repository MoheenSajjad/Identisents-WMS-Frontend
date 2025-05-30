import * as React from 'react';
import { JSX } from 'react';

export enum InputSize {
  DEFAULT = 'default',
  LARGE = 'large',
}

export type InputProps = {
  size?: InputSize;
  children?: React.ReactNode;
  className?: string;
  isRequired?: boolean;
  hasFocus?: boolean;
  hasError?: boolean;
  isDisabled?: boolean;
};

type InputComponent = {
  (props: InputProps): JSX.Element;
  Size: typeof InputSize;
  Label: typeof InputLabel;
  Border: typeof InputBorder;
  Icon: typeof InputIcon;
  Control: typeof InputControl;
  Handler: typeof InputHandler;
  Feedback: typeof InputFeedback;
};

export const Input: InputComponent = ({
  size = InputSize.DEFAULT,
  children,
  className,
  isRequired = false,
  hasFocus = false,
  hasError = false,
  isDisabled = false,
}: InputProps): JSX.Element => {
  const inputClasses = `
    inline-block ${isDisabled ? 'cursor-default' : ''} 
    ${isRequired ? 'input--is-required' : ''}
    ${hasFocus ? 'input--has-focus' : ''}
    ${hasError ? 'input--has-error' : ''}
    ${isDisabled ? 'input--is-disabled' : ''} 
    ${className ?? ''}
  `;

  return <div className={`${inputClasses} relative`}>{children}</div>;
};

type InputLabelProps = {
  value: string;
  hasError?: boolean;
  isRequired?: boolean;
};

const InputLabel = ({ value, hasError, isRequired = false }: InputLabelProps): JSX.Element => {
  return (
    <label
      className={`text-darker-grey mb-1 block text-xs font-medium transition-colors duration-150 ${
        hasError ? 'text-red-600' : ''
      } ${isRequired && "relative after:ml-1 after:text-red-500 after:content-['*']"}`}
    >
      {value}
    </label>
  );
};

type InputBorderProps = {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  hasError?: boolean;
  showErrorMessage?: boolean;
};

const InputBorder = ({
  className,
  onClick,
  children,
  hasError = false,
  showErrorMessage,
}: InputBorderProps): JSX.Element => {
  return (
    <div
      className={`flex h-8 w-full rounded-lg border bg-white ${
        showErrorMessage && 'mb-5'
      } ${hasError ? 'border-DANGER' : 'border-light-grey'} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

type InputIconProps = {
  children: React.ReactNode;
};

const InputIcon = ({ children }: InputIconProps): JSX.Element => {
  return (
    <div className="flex h-full w-10 items-center justify-center text-xl text-slate-600">
      {children}
    </div>
  );
};

type InputControlProps = {
  children: React.ReactNode;
  className?: string;
};

const InputControl = ({ children, className }: InputControlProps): JSX.Element => {
  return <div className={`flex h-full flex-1 items-center ${className}`}>{children}</div>;
};

type InputHandlerProps = {
  children: React.ReactNode;
};

const InputHandler = ({ children }: InputHandlerProps): JSX.Element => {
  return <div className="flex h-full w-8 items-center justify-center">{children}</div>;
};

type InputFeedbackProps = {
  value: string;
};

const InputFeedback = ({ value }: InputFeedbackProps): JSX.Element => {
  return <div className="absolute bottom-0 text-sm text-red-600 dark:text-red-500">{value}</div>;
};

Input.Size = InputSize;
Input.Label = InputLabel;
Input.Border = InputBorder;
Input.Icon = InputIcon;
Input.Control = InputControl;
Input.Handler = InputHandler;
Input.Feedback = InputFeedback;
