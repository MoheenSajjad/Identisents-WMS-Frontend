import React, { createContext, useState, useCallback, useEffect } from 'react';
import {
  Notification,
  NotificationContextType,
  NotificationType,
  NotificationConfig,
} from './notification.types';
import { NotificationContainer } from './NotificationContainer';

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

let globalNotify:
  | ((type: NotificationType, message: string, config?: NotificationConfig) => void)
  | null = null;

export const setGlobalNotify = (
  notifyFn: (type: NotificationType, message: string, config?: NotificationConfig) => void
) => {
  globalNotify = notifyFn;
};

export const clearGlobalNotify = () => {
  globalNotify = null;
};

export const getGlobalNotify = () => globalNotify;

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (type: NotificationType, message: string, config?: NotificationConfig) => {
      const id = Math.random().toString(36).substr(2, 9);
      const notification: Notification = {
        id,
        type,
        message,
        config,
      };

      setNotifications(prev => [...prev, notification]);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  useEffect(() => {
    setGlobalNotify(addNotification);
    return () => {
      clearGlobalNotify();
    };
  }, [addNotification]);

  const contextValue: NotificationContextType = {
    notifications,
    notify: addNotification,
    removeNotification,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  );
};
