import React, { createContext, useContext, useState } from 'react';

// Types
interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

// Context
const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
};

// Tabs Root Component
export const Tabs: React.FC<TabsProps> = ({
  defaultValue = '',
  value,
  onValueChange,
  children,
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);

  const activeTab = value !== undefined ? value : internalValue;

  const setActiveTab = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`w-full ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
};

// TabsList Component
export const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex border-b border-gray-200 ${className}`} role="tablist">
      {children}
    </div>
  );
};

// TabsTrigger Component
export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  className = '',
  disabled = false,
}) => {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      disabled={disabled}
      className={`relative px-4 py-3 text-sm font-medium transition-colors duration-200 focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
        isActive
          ? 'border-primary border-b-2 text-gray-800'
          : 'border-b-2 border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-900'
      } ${className}`}
      onClick={() => !disabled && setActiveTab(value)}
    >
      {children}
    </button>
  );
};

// TabsContent Component
export const TabsContent: React.FC<TabsContentProps> = ({ value, children, className = '' }) => {
  const { activeTab } = useTabsContext();
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <div
      id={`tabpanel-${value}`}
      role="tabpanel"
      aria-labelledby={`tab-${value}`}
      className={`mt-6 focus:outline-none ${className}`}
    >
      {children}
    </div>
  );
};
