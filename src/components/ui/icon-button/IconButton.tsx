import { JSX } from "react";

type IconButtonComponent = {
  (props: IconButtonProps): JSX.Element;
  Color: typeof IconButtonColor;
  Size: typeof ButtonSize;
  Variant: typeof IconButtonVariant;
};

enum IconButtonColor {
  TRANSPARENT = "transparent",
  PRIMARY = "primary",
  DEFAULT = "default",
  DANGER = "red",
  SUCCESS = "green",
  WARNING = "yellow",
}

enum IconButtonVariant {
  DEFAULT = "default",
  OUTLINE = "outline",
  GHOST = "ghost",
  SOLID = "solid",
  SOFT = "soft",
}

enum ButtonSize {
  DEFAULT = "default",
  SMALL = "small",
  LARGE = "large",
}

type IconButtonProps = {
  color?: IconButtonColor;
  size?: ButtonSize;
  variant?: IconButtonVariant;
  icon: React.ReactNode;
  tabIndex?: number;
  className?: string;
  isDisabled?: boolean;
  onClick?: () => void;
};

export const IconButton: IconButtonComponent = ({
  color = IconButtonColor.DEFAULT,
  size = ButtonSize.DEFAULT,
  variant = IconButtonVariant.DEFAULT,
  icon,
  tabIndex,
  className,
  isDisabled = false,
  onClick,
}: IconButtonProps): JSX.Element => {
  const handleClick =
    typeof onClick !== "undefined"
      ? () => {
          if (isDisabled) {
            return;
          }
          onClick();
        }
      : undefined;

  const sizeClasses = {
    [ButtonSize.SMALL]: "w-7 h-7 p-1.5",
    [ButtonSize.DEFAULT]: "w-9 h-9 p-2",
    [ButtonSize.LARGE]: "w-11 h-11 p-2.5",
  }[size];

  const getVariantClasses = (
    color: IconButtonColor,
    variant: IconButtonVariant
  ) => {
    const colorVariantMap = {
      [IconButtonColor.TRANSPARENT]: {
        [IconButtonVariant.DEFAULT]: "text-gray-500 hover:bg-gray-100",
        [IconButtonVariant.OUTLINE]:
          "text-gray-500 border border-gray-300 hover:bg-gray-50",
        [IconButtonVariant.GHOST]: "text-gray-500 hover:bg-gray-100",
        [IconButtonVariant.SOLID]: "bg-gray-500 text-white hover:bg-gray-600",
        [IconButtonVariant.SOFT]: "bg-gray-100 text-gray-600 hover:bg-gray-200",
      },
      [IconButtonColor.DEFAULT]: {
        [IconButtonVariant.DEFAULT]:
          "bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white",
        [IconButtonVariant.OUTLINE]:
          "text-blue-500 border border-blue-300 hover:bg-blue-50",
        [IconButtonVariant.GHOST]: "text-blue-500 hover:bg-blue-100",
        [IconButtonVariant.SOLID]: "bg-blue-500 text-white hover:bg-blue-600",
        [IconButtonVariant.SOFT]: "bg-blue-100 text-blue-600 hover:bg-blue-200",
      },
      [IconButtonColor.PRIMARY]: {
        [IconButtonVariant.DEFAULT]:
          "bg-orange-100 text-orange-500 hover:bg-orange-500 hover:text-white",
        [IconButtonVariant.OUTLINE]:
          "text-orange-500 border border-orange-300 hover:bg-orange-50",
        [IconButtonVariant.GHOST]: "text-orange-500 hover:bg-orange-100",
        [IconButtonVariant.SOLID]:
          "bg-orange-500 text-white hover:bg-orange-600",
        [IconButtonVariant.SOFT]:
          "bg-orange-100 text-orange-600 hover:bg-orange-200",
      },
      [IconButtonColor.DANGER]: {
        [IconButtonVariant.DEFAULT]:
          "bg-red-100 text-red-500 hover:bg-red-500 hover:text-white",
        [IconButtonVariant.OUTLINE]:
          "text-red-500 border border-red-300 hover:bg-red-50",
        [IconButtonVariant.GHOST]: "text-red-500 hover:bg-red-100",
        [IconButtonVariant.SOLID]: "bg-red-500 text-white hover:bg-red-600",
        [IconButtonVariant.SOFT]: "bg-red-100 text-red-600 hover:bg-red-200",
      },
      [IconButtonColor.SUCCESS]: {
        [IconButtonVariant.DEFAULT]:
          "bg-green-100 text-green-500 hover:bg-green-500 hover:text-white",
        [IconButtonVariant.OUTLINE]:
          "text-green-500 border border-green-300 hover:bg-green-50",
        [IconButtonVariant.GHOST]: "text-green-500 hover:bg-green-100",
        [IconButtonVariant.SOLID]: "bg-green-500 text-white hover:bg-green-600",
        [IconButtonVariant.SOFT]:
          "bg-green-100 text-green-600 hover:bg-green-200",
      },
      [IconButtonColor.WARNING]: {
        [IconButtonVariant.DEFAULT]:
          "bg-yellow-100 text-yellow-600 hover:bg-yellow-500 hover:text-white",
        [IconButtonVariant.OUTLINE]:
          "text-yellow-600 border border-yellow-300 hover:bg-yellow-50",
        [IconButtonVariant.GHOST]: "text-yellow-600 hover:bg-yellow-100",
        [IconButtonVariant.SOLID]:
          "bg-yellow-500 text-white hover:bg-yellow-600",
        [IconButtonVariant.SOFT]:
          "bg-yellow-100 text-yellow-600 hover:bg-yellow-200",
      },
    };

    return colorVariantMap[color][variant];
  };

  const variantClasses = getVariantClasses(color, variant);

  return (
    <button
      className={`inline-flex items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        isDisabled && "opacity-50 cursor-not-allowed"
      } ${sizeClasses} ${variantClasses} ${className}`}
      type="button"
      tabIndex={tabIndex}
      disabled={isDisabled}
      onClick={handleClick}
    >
      {icon}
    </button>
  );
};

IconButton.Color = IconButtonColor;
IconButton.Size = ButtonSize;
IconButton.Variant = IconButtonVariant;
