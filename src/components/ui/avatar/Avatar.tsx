import React, { useState } from 'react';

export enum AvatarSize {
  XS = 'xs', // 16px
  SM = 'sm', // 24px
  MD = 'md', // 32px
  LG = 'lg', // 40px
  XL = 'xl', // 48px
  XXL = '2xl', // 56px
  XXXL = '3xl', // 64px
}

export enum AvatarVariant {
  CIRCLE = 'circle',
  ROUNDED = 'rounded',
  SQUARE = 'square',
}

export enum AvatarStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  AWAY = 'away',
  BUSY = 'busy',
}

export interface AvatarProps {
  // Image props
  src?: string;
  alt?: string;

  // Fallback props
  name?: string;
  initials?: string;
  fallbackSrc?: string;

  // Styling props
  size?: AvatarSize;
  variant?: AvatarVariant;
  className?: string;

  // Status indicator
  status?: AvatarStatus;
  showStatus?: boolean;

  // Interactive props
  onClick?: () => void;
  onError?: (error: Event) => void;

  // Loading and placeholder
  loading?: boolean;
  placeholder?: React.ReactNode;

  // Badge/notification
  badge?: string | number;
  showBadge?: boolean;

  // Custom styling
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
}

interface AvatarImageProps extends Pick<AvatarProps, 'src' | 'alt' | 'fallbackSrc' | 'onError'> {
  onImageError: () => void;
  className: string;
}

export const AvatarImage: React.FC<AvatarImageProps> = ({
  src,
  alt,
  fallbackSrc,
  onError,
  onImageError,
  className,
}) => {
  const [imageError, setImageError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);

  const handleError = (error: React.SyntheticEvent<HTMLImageElement>) => {
    if (!imageError && fallbackSrc) {
      setImageError(true);
      return;
    }

    if (!fallbackError) {
      setFallbackError(true);
    }

    onError?.(error.nativeEvent);
    onImageError();
  };

  const imageSrc = imageError && fallbackSrc ? fallbackSrc : src;

  if (!imageSrc || (imageError && fallbackError)) {
    return null;
  }

  return (
    <img
      src={imageSrc}
      alt={alt || 'Avatar'}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

interface AvatarFallbackProps
  extends Pick<AvatarProps, 'name' | 'initials' | 'size' | 'backgroundColor' | 'textColor'> {
  className: string;
}

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({
  name,
  initials,
  size,
  backgroundColor,
  textColor,
  className,
}) => {
  const displayInitials = initials || generateInitials(name || '');
  const gradientClass = backgroundColor || generateGradientFromName(name || '');

  const textSizeClasses = {
    [AvatarSize.XS]: 'text-xs',
    [AvatarSize.SM]: 'text-xs',
    [AvatarSize.MD]: 'text-sm',
    [AvatarSize.LG]: 'text-base',
    [AvatarSize.XL]: 'text-lg',
    [AvatarSize.XXL]: 'text-xl',
    [AvatarSize.XXXL]: 'text-2xl',
  };

  return (
    <div
      className={` ${className} bg-gradient-to-br ${gradientClass} flex items-center justify-center font-semibold ${textSizeClasses[size || AvatarSize.MD]} ${textColor || 'text-white'} `}
    >
      {displayInitials}
    </div>
  );
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  initials,
  fallbackSrc,
  size = AvatarSize.MD,
  variant = AvatarVariant.CIRCLE,
  className = '',
  status,
  showStatus = false,
  onClick,
  onError,
  loading = false,
  placeholder,
  badge,
  showBadge = false,
  borderColor,
  backgroundColor,
  textColor,
}) => {
  const [showFallback, setShowFallback] = useState(!src);

  const sizeClasses = {
    [AvatarSize.XS]: 'w-4 h-4',
    [AvatarSize.SM]: 'w-6 h-6',
    [AvatarSize.MD]: 'w-8 h-8',
    [AvatarSize.LG]: 'w-10 h-10',
    [AvatarSize.XL]: 'w-12 h-12',
    [AvatarSize.XXL]: 'w-14 h-14',
    [AvatarSize.XXXL]: 'w-16 h-16',
  };

  const variantClasses = {
    [AvatarVariant.CIRCLE]: 'rounded-full',
    [AvatarVariant.ROUNDED]: 'rounded-lg',
    [AvatarVariant.SQUARE]: 'rounded-none',
  };

  const baseClasses = `
    relative inline-flex
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    overflow-hidden
    ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
    ${borderColor ? `border-2 ${borderColor}` : ''}
    ${className}
  `;

  const imageClasses = `
    w-full h-full object-cover
    ${variantClasses[variant]}
  `;

  const handleImageError = () => {
    setShowFallback(true);
  };

  if (loading) {
    return (
      <div className={`${baseClasses} animate-pulse bg-gray-200`}>
        {placeholder || <div className="h-full w-full animate-pulse bg-gray-300" />}
      </div>
    );
  }

  return (
    <div className={baseClasses} onClick={onClick}>
      {!showFallback && src ? (
        <AvatarImage
          src={src}
          alt={alt || name}
          fallbackSrc={fallbackSrc}
          onError={onError}
          onImageError={handleImageError}
          className={imageClasses}
        />
      ) : (
        <AvatarFallback
          name={name}
          initials={initials}
          size={size}
          backgroundColor={backgroundColor}
          textColor={textColor}
          className={imageClasses}
        />
      )}
    </div>
  );
};

export const generateInitials = (name: string): string => {
  if (!name) return '';

  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

export const generateGradientFromName = (name: string): string => {
  if (!name) return 'from-gray-400 to-gray-600';

  const colors = [
    'from-red-400 to-red-600',
    'from-blue-400 to-blue-600',
    'from-green-400 to-green-600',
    'from-yellow-400 to-yellow-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-indigo-400 to-indigo-600',
    'from-teal-400 to-teal-600',
    'from-orange-400 to-orange-600',
    'from-cyan-400 to-cyan-600',
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};
