import React, { JSX } from 'react';

enum TagTypeStyles {
  ON_TRACK = 'bg-purple-100 text-purple-700 ',
  WARNING = 'bg-orange-100 text-orange-700 ',
  ERROR = 'bg-red-100 text-red-700',
  ACTIVE = 'bg-green-100 text-green-700 ',
  INFO = 'bg-blue-100 text-blue-700 ',
  INACTIVE = 'bg-gray-100 text-gray-700',
}

enum TagDotColors {
  ON_TRACK = 'bg-purple-700',
  WARNING = 'bg-orange-700',
  ERROR = 'bg-red-700',
  ACTIVE = 'bg-green-700',
  INFO = 'bg-blue-700',
  INACTIVE = 'bg-gray-700',
}

enum TagIconColors {
  ON_TRACK = 'text-purple-700',
  WARNING = 'text-orange-700',
  ERROR = 'text-red-700',
  ACTIVE = 'text-green-700',
  INFO = 'text-blue-700',
  INACTIVE = 'text-gray-700',
}

type TagProps = {
  type: TagTypeStyles;
  label: string;
  className?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  showDot?: boolean;
};

type TagComponent = {
  (props: TagProps): JSX.Element;
  type: typeof TagTypeStyles;
};

export const Tag: TagComponent = ({
  type = TagTypeStyles.ON_TRACK,
  label,
  className = '',
  onClick,
  icon,
  showDot = true,
}: TagProps) => {
  const dotColor =
    type === TagTypeStyles.ON_TRACK
      ? TagDotColors.ON_TRACK
      : type === TagTypeStyles.WARNING
        ? TagDotColors.WARNING
        : type === TagTypeStyles.ERROR
          ? TagDotColors.ERROR
          : type === TagTypeStyles.ACTIVE
            ? TagDotColors.ACTIVE
            : type === TagTypeStyles.INFO
              ? TagDotColors.INFO
              : TagDotColors.INACTIVE;

  const iconColor =
    type === TagTypeStyles.ON_TRACK
      ? TagIconColors.ON_TRACK
      : type === TagTypeStyles.WARNING
        ? TagIconColors.WARNING
        : type === TagTypeStyles.ERROR
          ? TagIconColors.ERROR
          : type === TagTypeStyles.ACTIVE
            ? TagIconColors.ACTIVE
            : type === TagTypeStyles.INFO
              ? TagIconColors.INFO
              : TagIconColors.INACTIVE;

  const renderIndicator = () => {
    if (icon) {
      return (
        <div className={`mr-2 ${iconColor} `} aria-hidden="true">
          {/* {React.isValidElement(icon)
            ? React.cloneElement(icon as React.ReactElement, {
                className: `w-3 h-3 ${
                  (icon as React.ReactElement).props?.className || ""
                }`,
              })
            : icon} */}
          {icon}
        </div>
      );
    }

    if (showDot) {
      return <span className={`mr-2 h-2 w-2 rounded-full ${dotColor}`} aria-hidden="true"></span>;
    }

    return null;
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium ${type} ${className} ${
        onClick ? 'cursor-pointer transition-opacity hover:opacity-80' : ''
      }`}
      onClick={onClick}
    >
      {renderIndicator()}
      <div>{label}</div>
    </div>
  );
};

Tag.type = TagTypeStyles;

// Example usage with different icons:
/*
// With custom icon
<Tag 
  type={Tag.type.ACTIVE} 
  label="Active" 
  icon={<CheckIcon />} 
/>

// With dot (default behavior)
<Tag 
  type={Tag.type.WARNING} 
  label="Warning" 
/>

// Without dot or icon
<Tag 
  type={Tag.type.INFO} 
  label="Info" 
  showDot={false} 
/>

// Different icon examples based on tag type:
<Tag 
  type={Tag.type.ACTIVE} 
  label="Completed" 
  icon={<CheckCircleIcon />} 
/>

<Tag 
  type={Tag.type.WARNING} 
  label="Pending" 
  icon={<ClockIcon />} 
/>

<Tag 
  type={Tag.type.ERROR} 
  label="Failed" 
  icon={<XCircleIcon />} 
/>

<Tag 
  type={Tag.type.INFO} 
  label="Processing" 
  icon={<InformationCircleIcon />} 
/>
*/
