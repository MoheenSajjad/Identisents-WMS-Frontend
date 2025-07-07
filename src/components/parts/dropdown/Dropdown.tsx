import { Icons } from '@/components/Icons';
import { Button } from '@/components/ui/Button';
import { CheckIcon, ChevronsUpDown, X } from 'lucide-react';
import React, { useState, useRef, ReactNode, forwardRef, useEffect } from 'react';
import { Shake } from '../animations';

type DropdownProps = {
  children: ReactNode;
  className?: string;
};

interface DropdownItemImageProps {
  src: string;
  alt?: string;
  className?: string;
  size?: number;
  fallbackSrc?: string;
}

export const DropdownItemImage = React.memo(
  ({
    src,
    alt = 'image',
    className,
    size = 28,
    fallbackSrc = '/images/fallback.png',
  }: DropdownItemImageProps) => {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        width={size}
        height={size}
        onError={e => {
          e.currentTarget.src = fallbackSrc;
        }}
        className={`h-6 w-6 shrink-0 rounded-md object-cover ${className}`}
      />
    );
  }
);

export const Dropdown: React.FC<DropdownProps> = ({ children }) => (
  <div className="w-full">{children}</div>
);

export const DropdownLabel = forwardRef<HTMLDivElement, { label: string; isRequired?: boolean }>(
  ({ label, isRequired = false }, ref) => {
    return (
      <label
        className={`text-darker-grey mb-1 block text-xs font-medium transition-colors duration-150 ${
          isRequired && "relative after:ml-1 after:text-red-500 after:content-['*']"
        }`}
      >
        {label}
      </label>
    );
  }
);

export const DropdownDialog = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; className?: string; isOpen?: boolean }
>(({ children, className, isOpen = false }, ref) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [shouldShowAbove, setShouldShowAbove] = useState(false);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      const rect = dialogRef.current.getBoundingClientRect();
      const isInsideTable = dialogRef.current.closest('table, .table-container, [role="table"]');
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      setShouldShowAbove(!!isInsideTable || (spaceBelow < 200 && spaceAbove > 200));
    }
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <div ref={dialogRef}>
        {React.Children.map(children, child =>
          React.isValidElement(child) && child.type === DropdownContent
            ? React.cloneElement(child as React.ReactElement<any>, { shouldShowAbove })
            : child
        )}
      </div>
    </div>
  );
});

export const DropdownTrigger = ({
  selectedItems = [],
  placeholder,
  error,
  toggleDropdown,
  className,
  isLoading = false,
  isDisabled = false,
  Icon = null,
  showImg = false,
  imgUrl = '',
  hasError = false,
  isMultiple = false,
  renderSelected,
  onRemoveItem,
}: {
  selectedItems?: any[];
  placeholder: string;
  error?: string;
  toggleDropdown: () => void;
  className?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  Icon?: React.ReactNode;
  showImg?: boolean;
  imgUrl?: string;
  hasError?: boolean;
  isMultiple?: boolean;
  renderSelected?: (item: any) => string;
  onRemoveItem?: (item: any) => void;
}) => {
  const onClick = !isDisabled ? toggleDropdown : () => {};
  const isError = (error && selectedItems.length === 0) || hasError;

  const getDisplayContent = () => {
    if (selectedItems.length === 0) {
      return <span className="text-medium-grey">{placeholder}</span>;
    }

    if (!isMultiple || selectedItems.length === 1) {
      const item = selectedItems[0];
      const displayText = renderSelected
        ? renderSelected(item)
        : typeof item === 'object'
          ? item.name || item.label || JSON.stringify(item)
          : String(item);

      return (
        <span className="flex items-center">
          {showImg && selectedItems.length === 1 && (
            <DropdownItemImage
              className="-m-2 mr-2 h-6 w-6"
              src={imgUrl || item.image || item.imgUrl || ''}
            />
          )}
          <span className="block truncate font-medium">
            {isLoading ? 'Loading...' : displayText}
          </span>
        </span>
      );
    }

    return (
      <div className="flex w-full items-center justify-between">
        <span className="truncate font-medium text-gray-700">
          {selectedItems.length} item{selectedItems.length === 1 ? '' : 's'} selected
        </span>
        {onRemoveItem && (
          <div className="ml-2 flex flex-shrink-0 items-center space-x-1">
            <button
              type="button"
              className="p-0.5 text-gray-400 hover:text-gray-600"
              onClick={e => {
                e.stopPropagation();
                selectedItems.forEach(item => onRemoveItem(item));
              }}
              title="Clear all selections"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <Shake shouldShake={hasError}>
      <button
        type="button"
        className={`hover:border-primary-orange/55 relative min-h-8 w-full min-w-52 cursor-default rounded-lg border py-1.5 pr-10 pl-3 text-left text-gray-500 transition-all duration-300 hover:text-gray-700 focus:outline-none sm:text-xs ${isError ? 'border-red-600 hover:border-red-600' : ''} ${isDisabled ? 'bg-gray-100' : 'cursor-pointer bg-white'} ${className} `}
        onClick={onClick}
      >
        <div className="flex min-h-5 items-center">{getDisplayContent()}</div>
        <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
          {isLoading ? (
            <Icons.Loader className="h-5 w-5 animate-spin" />
          ) : Icon ? (
            Icon
          ) : (
            <Icons.ChevronUpDown />
          )}
        </span>
      </button>
    </Shake>
  );
};

type DropdownContentProps = {
  children: ReactNode;
  isOpen?: boolean;
  className?: string;
  shouldShowAbove?: boolean;
};

export const DropdownContent = ({
  children,
  className,
  isOpen,
  shouldShowAbove = false,
}: DropdownContentProps) => {
  if (!isOpen) return null;

  const positionClasses = shouldShowAbove ? 'bottom-15 left-0' : 'top-15 left-0';

  return (
    <div
      id="selectContent"
      className={`absolute ${positionClasses} z-50 mt-1 w-full overflow-clip rounded-md bg-white text-base shadow-lg ring-1 ring-black/5 transition-all duration-150 ease-linear focus:outline-none ${className}`}
      style={{ transformOrigin: shouldShowAbove ? 'bottom' : 'top' }}
    >
      {children}
    </div>
  );
};

export const DropdownInput: React.FC<{
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ placeholder = 'Search...', value, onChange }) => (
  <div className="relative h-10 w-full border-b border-gray-300">
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      className="h-full w-full bg-white bg-none pl-9 text-xs focus-visible:outline-none"
      onChange={onChange}
    />
    <div className="absolute top-2.5 left-1.5 text-gray-400">
      <Icons.Search />
    </div>
  </div>
);

export const DropdownList: React.FC<DropdownProps> = ({ children }) => (
  <ul className="custom-scrollbar max-h-52 w-full overflow-auto sm:text-sm" role="listbox">
    {children}
  </ul>
);

export const DropdownEmpty: React.FC<{
  message?: string;
  children?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  showIcon?: boolean;
}> = ({ message = 'No results found.', children, className = '', icon, showIcon = true }) => {
  const defaultIcon = <Icons.Search className="mx-auto mb-2 h-8 w-8 text-gray-300" />;

  return (
    <div className={`px-4 py-8 text-center text-gray-500 ${className}`}>
      {showIcon && (icon || defaultIcon)}
      {children ? (
        children
      ) : (
        <div>
          <p className="text-sm font-medium text-gray-400">{message}</p>
          <p className="mt-1 text-xs text-gray-300">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export const DropdownGroup: React.FC<{
  heading: string;
  children: React.ReactNode;
}> = ({ heading, children }) => (
  <>
    <div className="mt-2 ml-1">
      <div className="text-sm font-semibold text-gray-500">{heading}</div>
    </div>
    {children}
  </>
);

export const DropdownItem: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
  isSelected: boolean;
  showCheckMark?: boolean;
}> = ({ children, className, onClick, isSelected, showCheckMark = true }) => (
  <li
    role="option"
    onClick={onClick}
    className={`relative mx-1 my-1 flex cursor-default rounded-lg py-2 pr-9 pl-1 text-xs text-gray-600 select-none ${
      isSelected
        ? 'bg-gray-100 text-gray-500 transition-all duration-300 ease-in-out'
        : 'hover:bg-gray-200/50'
    } ${className}`}
  >
    {children}
    {isSelected && showCheckMark && (
      <Icons.Check className="text-primary absolute right-0 flex w-8 items-center pr-4" />
    )}
  </li>
);

export const DropdownItemName: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className="flex items-center">
    <span className="ml-3 block font-normal">{children}</span>
  </div>
);

export const DropdownShortcut: React.FC<{ shortcut: string }> = ({ shortcut }) => (
  <span className="ml-auto text-xs text-gray-500">{shortcut}</span>
);

export const DropdownSeparator: React.FC = () => <hr className="m-2 border-gray-300" />;

export const DropdownSelected: React.FC<{
  selectedItems: any[];
  onRemoveItem?: (item: any) => void;
  renderItem?: (item: any) => string;
  className?: string;
  showRemove?: boolean;
}> = ({ selectedItems, onRemoveItem, renderItem, className = '', showRemove = true }) => {
  if (selectedItems.length === 0) return null;

  return (
    <div className={`border-b border-gray-200 p-2 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {selectedItems.map((item, index) => {
          const displayText = renderItem
            ? renderItem(item)
            : typeof item === 'object'
              ? item.name || item.label || JSON.stringify(item)
              : String(item);

          return (
            <div
              key={index}
              className="flex items-center rounded-md bg-blue-100 px-2 py-1 text-sm text-blue-800"
            >
              <span>{displayText}</span>
              {showRemove && onRemoveItem && (
                <button
                  onClick={() => onRemoveItem(item)}
                  className="ml-1 rounded-full p-0.5 hover:bg-blue-200"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
