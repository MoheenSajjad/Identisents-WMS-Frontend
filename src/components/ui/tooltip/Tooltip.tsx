import React, { useState, useRef, useEffect } from 'react';

// Enums for tooltip configuration
export enum TooltipPosition {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
}

enum TooltipSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

enum TooltipTheme {
  DARK = 'dark',
  LIGHT = 'light',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

enum TooltipTrigger {
  HOVER = 'hover',
  CLICK = 'click',
}

// Interface for tooltip props
interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: TooltipPosition;
  size?: TooltipSize;
  theme?: TooltipTheme;
  trigger?: TooltipTrigger;
  delay?: number;
  disabled?: boolean;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = TooltipPosition.TOP,
  size = TooltipSize.MEDIUM,
  theme = TooltipTheme.DARK,
  trigger = TooltipTrigger.HOVER,
  delay = 200,
  disabled = false,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Position classes mapping
  const positionClasses = {
    [TooltipPosition.TOP]: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    [TooltipPosition.BOTTOM]: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    [TooltipPosition.LEFT]: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    [TooltipPosition.RIGHT]: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  // Arrow classes mapping
  const arrowClasses = {
    [TooltipPosition.TOP]:
      'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
    [TooltipPosition.BOTTOM]:
      'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
    [TooltipPosition.LEFT]:
      'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
    [TooltipPosition.RIGHT]:
      'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent',
  };

  // Size classes mapping
  const sizeClasses = {
    [TooltipSize.SMALL]: 'px-2 py-1 text-xs max-w-xs',
    [TooltipSize.MEDIUM]: 'px-3 py-2 text-sm max-w-sm',
    [TooltipSize.LARGE]: 'px-4 py-3 text-base max-w-md',
  };

  // Theme classes mapping
  const themeClasses = {
    [TooltipTheme.DARK]: 'bg-gray-900 text-white border-gray-900',
    [TooltipTheme.LIGHT]: 'bg-white text-gray-900 border-gray-200 shadow-lg',
    [TooltipTheme.SUCCESS]: 'bg-green-600 text-white border-green-600',
    [TooltipTheme.WARNING]: 'bg-yellow-500 text-white border-yellow-500',
    [TooltipTheme.ERROR]: 'bg-red-600 text-white border-red-600',
  };

  // Arrow color classes mapping
  const arrowColorClasses = {
    [TooltipTheme.DARK]: 'border-gray-900',
    [TooltipTheme.LIGHT]: 'border-gray-200',
    [TooltipTheme.SUCCESS]: 'border-green-600',
    [TooltipTheme.WARNING]: 'border-yellow-500',
    [TooltipTheme.ERROR]: 'border-red-600',
  };

  const showTooltip = () => {
    if (disabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Add a small delay before hiding to allow moving to tooltip
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

  const keepTooltipVisible = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleClick = () => {
    if (disabled) return;
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const eventHandlers =
    trigger === TooltipTrigger.HOVER
      ? { onMouseEnter: showTooltip, onMouseLeave: hideTooltip }
      : { onClick: handleClick };

  return (
    <div ref={triggerRef} className={`relative inline-block ${className}`} {...eventHandlers}>
      {children}

      {isVisible && content && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 rounded-md border break-words whitespace-normal ${positionClasses[position]} ${sizeClasses[size]} ${themeClasses[theme]} animate-in fade-in-0 zoom-in-95 duration-200`}
          role="tooltip"
          onMouseEnter={trigger === TooltipTrigger.HOVER ? keepTooltipVisible : undefined}
          onMouseLeave={trigger === TooltipTrigger.HOVER ? hideTooltip : undefined}
        >
          {content}

          {/* Arrow */}
          <div
            className={`absolute h-0 w-0 border-4 ${arrowClasses[position]} ${arrowColorClasses[theme]} `}
          />
        </div>
      )}
    </div>
  );
};
