import { createContext, useContext, useState, ReactNode } from 'react';
import { Alert, AlertProps } from './Alert';

interface NotifyContextType {
  notify: (props: AlertProps) => void;
}

const NotifyContext = createContext<NotifyContextType | undefined>(undefined);

export const useNotify = () => {
  const context = useContext(NotifyContext);
  if (!context) {
    throw new Error('useNotify must be used within a NotifyProvider');
  }
  return context;
};

export const NotifyProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<AlertProps[]>([]);

  const notify = (props: AlertProps) => {
    setAlerts(prev => [...prev, props]);

    if (props.duration !== 0) {
      setTimeout(() => {
        setAlerts(prev => prev.filter(alert => alert !== props));
      }, props.duration || 3000);
    }
  };

  return (
    <NotifyContext.Provider value={{ notify }}>
      {children}
      <div className="fixed top-4 right-4 z-[60] space-y-2">
        {alerts.map((alert, index) => (
          <Alert
            key={index}
            {...alert}
            onClose={() => {
              setAlerts(prev => prev.filter(a => a !== alert));
            }}
          />
        ))}
      </div>
    </NotifyContext.Provider>
  );
};
