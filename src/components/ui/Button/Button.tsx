import { Icons } from '@/components/Icons';
import * as React from 'react';
import { TableCell } from '../Table';

type ButtonComponent = {
  (props: ButtonProps): React.JSX.Element;
  Color: typeof ButtonColor;
  Size: typeof ButtonSize;
  Variant: typeof ButtonVariant;
  Role: typeof ButtonRole;
  Roundness: typeof ButtonRoundness;
};

enum ButtonColor {
  PRIMARY = 'primary',
  DEFAULT = 'default',
  DANGER = 'danger',
  SUCCESS = 'success',
  WARNING = 'warning',
}

enum ButtonSize {
  SMALL = 'sm',
  DEFAULT = 'default',
  LARGE = 'lg',
  ICON = 'icon',
}

enum ButtonVariant {
  PRIMARY = 'primary',
  DEFAULT = 'default',
  SECONDARY = 'secondary',
  OUTLINE = 'outline',
  GHOST = 'ghost',
  LINK = 'link',
  DESTRUCTIVE = 'destructive',
  DASHED = 'dashed',
}

enum ButtonRoundness {
  NONE = 'none',
  SMALL = 'sm',
  DEFAULT = 'default',
  MEDIUM = 'md',
  LARGE = 'lg',
  FULL = 'full',
}

enum ButtonRole {
  BUTTON = 'button',
  CHECKBOX = 'checkbox',
}

type ButtonProps = {
  color?: ButtonColor;
  size?: ButtonSize;
  variant?: ButtonVariant;
  role?: ButtonRole;
  roundness?: ButtonRoundness;
  icon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  'aria-label'?: string;
  'aria-controls'?: string;
};

export const Button: ButtonComponent = ({
  color = ButtonColor.DEFAULT,
  size = ButtonSize.DEFAULT,
  variant = ButtonVariant.OUTLINE,
  role = ButtonRole.BUTTON,
  roundness = ButtonRoundness.MEDIUM,
  icon,
  suffixIcon,
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  children,
  ...ariaProps
}: ButtonProps): React.JSX.Element => {
  const baseClasses = `
    inline-flex items-center justify-center gap-2 transition-colors duration-300 
    cursor-pointer font-medium transition-colors duration-200
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    disabled:pointer-events-none disabled:opacity-50
    [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0
    
  `;

  const roundnessClasses = {
    [ButtonRoundness.NONE]: 'rounded-none',
    [ButtonRoundness.SMALL]: 'rounded-sm',
    [ButtonRoundness.DEFAULT]: 'rounded-md',
    [ButtonRoundness.MEDIUM]: 'rounded-lg',
    [ButtonRoundness.LARGE]: 'rounded-xl',
    [ButtonRoundness.FULL]: 'rounded-full',
  };

  const variantClasses = {
    [ButtonVariant.PRIMARY]:
      'bg-linear-to-r from-black via-gray-[#333333] to-gray-[#333333] text-white hover:bg-linear-to-l from-black via-gray-[#333333] to-gray-600 focus-visible:ring-gray-500 transition delay-150 duration-300 ease-in-out',
    [ButtonVariant.DEFAULT]: 'bg-gray-900 text-white hover:bg-gray-800 focus-visible:ring-gray-500',
    [ButtonVariant.SECONDARY]:
      'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500',
    [ButtonVariant.OUTLINE]:
      'border border-gray-800 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-500 hover:text-black focus-visible:ring-gray-500',
    [ButtonVariant.GHOST]: 'text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500',
    [ButtonVariant.LINK]:
      'text-orange-600 underline-offset-4 hover:underline focus-visible:ring-orange-500',
    [ButtonVariant.DESTRUCTIVE]:
      'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500',
    [ButtonVariant.DASHED]:
      'border border-dashed border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500',
  };

  const sizeClasses = {
    [ButtonSize.SMALL]: 'h-8 px-3 text-sm',
    [ButtonSize.DEFAULT]: 'h-10 px-4 text-xs',
    [ButtonSize.LARGE]: 'h-11 px-8 text-base',
    [ButtonSize.ICON]: 'h-8 w-8 p-0',
  };

  const colorModifiers: Record<ButtonColor, Partial<Record<ButtonVariant, string>>> = {
    [ButtonColor.PRIMARY]: {
      [ButtonVariant.OUTLINE]: 'hover:border-orange-500 hover:text-orange-600',
      [ButtonVariant.GHOST]: 'text-blue-600 hover:bg-blue-50',
      [ButtonVariant.LINK]: 'text-orange-600',
    },
    [ButtonColor.DANGER]: {
      [ButtonVariant.OUTLINE]: 'hover:border-red-500 hover:text-red-600',
      [ButtonVariant.GHOST]: 'text-red-600 hover:bg-red-500 hover:text-white',
      [ButtonVariant.LINK]: 'text-red-600',
    },
    [ButtonColor.SUCCESS]: {
      [ButtonVariant.OUTLINE]: 'hover:border-green-500 hover:text-green-600',
      [ButtonVariant.GHOST]: 'text-green-600 hover:bg-green-50',
      [ButtonVariant.LINK]: 'text-green-600',
    },
    [ButtonColor.WARNING]: {
      [ButtonVariant.OUTLINE]: 'hover:border-yellow-500 hover:text-yellow-600',
      [ButtonVariant.GHOST]: 'text-yellow-600 hover:bg-yellow-50',
      [ButtonVariant.LINK]: 'text-yellow-600',
    },
    [ButtonColor.DEFAULT]: {},
  };

  const getColorModifier = (): string => {
    return colorModifiers[color]?.[variant] || '';
  };

  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${getColorModifier()}
    ${roundnessClasses[roundness]}
    ${className}
  `
    .replace(/\s+/g, ' ')
    .trim();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  return (
    <button
      type={type}
      role={role}
      disabled={disabled || loading}
      onClick={handleClick}
      className={classes}
      {...ariaProps}
    >
      {loading ? <Icons.Spinner className="animate-spin" /> : icon && <span>{icon}</span>}

      {children}

      {suffixIcon && <span>{suffixIcon}</span>}
    </button>
  );
};

Button.Color = ButtonColor;
Button.Size = ButtonSize;
Button.Variant = ButtonVariant;
Button.Role = ButtonRole;
Button.Roundness = ButtonRoundness;
