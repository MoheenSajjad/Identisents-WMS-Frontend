import * as React from 'react';

import { Input } from '../input';
import { TextInputType } from '../text-input';
import { IconButton } from '../icon-button';
import { Icons } from '@/components/Icons';
import { Shake } from '@/components/parts/animations';

type PasswordInputProps = {
  label?: string;
  icon?: React.ReactNode;
  value?: string;
  placeholder?: string;
  tabIndex?: number;
  error?: string;
  showErrorMessage?: boolean;
  className?: string;
  isRequired?: boolean;
  hasInitialFocus?: boolean;
  hasError?: boolean;
  isDisabled?: boolean;
  onChange: (value: string) => void;
};

export const PasswordInput = ({
  label = 'Password',
  icon,
  value,
  placeholder,
  error,
  showErrorMessage,
  className,
  isRequired,
  hasInitialFocus = false,
  hasError,
  isDisabled,
  onChange,
}: PasswordInputProps): React.JSX.Element => {
  const [hasFocus, setHasFocus] = React.useState<boolean>(hasInitialFocus);

  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false);

  const handleTogglePasswordVisibility = () => {
    setPasswordVisible(passwordVisible => !passwordVisible);
  };

  return (
    <Input
      className={className}
      isRequired={isRequired}
      hasFocus={hasFocus}
      hasError={hasError}
      isDisabled={isDisabled}
    >
      <Shake shouldShake={!!hasError}>
        <Input.Label value={label} isRequired={isRequired} hasError={hasError} />
        <Input.Border hasError={hasError}>
          {typeof icon !== 'undefined' && <Input.Icon>{icon}</Input.Icon>}
          <Input.Control
            className={`${!icon && 'px-2'} ${isDisabled && 'rounded-lg bg-[#f3f0f0]'}`}
          >
            <input
              type={passwordVisible ? TextInputType.TEXT : TextInputType.PASSWORD}
              value={value}
              onChange={e => onChange(e.target.value)}
              onFocus={() => setHasFocus}
              placeholder={placeholder}
              disabled={isDisabled}
              className="h-full w-full border-none bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </Input.Control>
          <div className="flex items-center">
            <IconButton
              icon={passwordVisible ? <Icons.EyeOff /> : <Icons.Eye />}
              isDisabled={isDisabled}
              variant={IconButton.Variant.GHOST}
              color={IconButton.Color.TRANSPARENT}
              size={IconButton.Size.SMALL}
              onClick={handleTogglePasswordVisibility}
            />
          </div>
        </Input.Border>
        {error && showErrorMessage && <Input.Feedback value={error} />}
      </Shake>
    </Input>
  );
};
