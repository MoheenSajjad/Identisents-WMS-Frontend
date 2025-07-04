import React, { JSX } from 'react';
import { Input } from '../input';

interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  isRequired?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  size?: SwitchSize;
  color?: string;
  label?: string;
  onLabel?: React.ReactNode;
  offLabel?: React.ReactNode;
  id?: string;
  name?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  transitionDuration?: number;
  onIcon?: React.ReactNode;
  offIcon?: React.ReactNode;
  tabIndex?: number;
  role?: string;
  dataTestId?: string;
  tooltip?: string;
}

enum SwitchSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

type SwicthComponenet = {
  (props: SwitchProps): JSX.Element;
  size: typeof SwitchSize;
};

export const Switch: SwicthComponenet = ({
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  className = '',
  isRequired = true,
  style,
  size = SwitchSize.MEDIUM,
  color = 'bg-blue-500',
  label,
  onLabel,
  offLabel,
  id,
  name,
  ariaLabel,
  ariaLabelledBy,
  transitionDuration = 300,
  onIcon,
  offIcon,
  tabIndex = 0,
  role = 'switch',
  dataTestId,
  tooltip,
}) => {
  const sizeClasses = {
    small: 'w-10 h-6',
    medium: 'w-12 h-6',
    large: 'w-16 h-8',
  };

  const circleClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
  };

  const [isChecked, setIsChecked] = React.useState<boolean>(defaultChecked || true);

  const handleToggle = () => {
    if (disabled) return;
    const newState = !isChecked;
    setIsChecked(newState);
    onChange?.(newState);
  };

  React.useEffect(() => {
    if (typeof checked === 'boolean') {
      setIsChecked(checked);
    }
  }, [checked]);

  return (
    <>
      {label && <Input.Label value={label} isRequired={isRequired} />}

      <div
        id={id}
        role={role}
        aria-checked={isChecked}
        aria-disabled={disabled}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        tabIndex={disabled ? -1 : tabIndex}
        className={`relative ${
          sizeClasses[size]
        } mt-2 flex-shrink-0 cursor-pointer rounded-full transition-all duration-${transitionDuration} ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        } ${isChecked ? color : 'bg-gray-300'}`}
        onClick={handleToggle}
        data-testid={dataTestId}
      >
        <span
          className={`absolute inset-y-0 left-0 transform rounded-full shadow transition-all duration-${transitionDuration} ${
            circleClasses[size]
          } ${isChecked ? `right-0 translate-x-full bg-white` : 'bg-white'}`}
        ></span>

        {onIcon && isChecked && (
          <span className="absolute top-1/2 left-1 -translate-y-1/2 transform">{onIcon}</span>
        )}

        {offIcon && !isChecked && (
          <span className="absolute top-1/2 right-1 -translate-y-1/2 transform">{offIcon}</span>
        )}
      </div>

      {(isChecked && onLabel) || (!isChecked && offLabel) ? (
        <span className="text-sm font-medium">{isChecked ? onLabel : offLabel}</span>
      ) : null}
    </>
  );
};

Switch.size = SwitchSize;
