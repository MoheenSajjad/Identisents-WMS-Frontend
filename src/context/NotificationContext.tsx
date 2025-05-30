import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { generateId } from "@/utils/helpers";

// Notification types
export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Context state
interface NotificationState {
  notifications: Notification[];
}

// Context actions
type NotificationAction =
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "CLEAR_ALL" };

// Context value
interface NotificationContextValue {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  // Convenience methods
  success: (
    message: string,
    title?: string,
    options?: Partial<Notification>
  ) => void;
  error: (
    message: string,
    title?: string,
    options?: Partial<Notification>
  ) => void;
  warning: (
    message: string,
    title?: string,
    options?: Partial<Notification>
  ) => void;
  info: (
    message: string,
    title?: string,
    options?: Partial<Notification>
  ) => void;
}

// Initial state
const initialState: NotificationState = {
  notifications: [],
};

// Reducer
const notificationReducer = (
  state: NotificationState,
  action: NotificationAction
): NotificationState => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload
        ),
      };
    case "CLEAR_ALL":
      return {
        ...state,
        notifications: [],
      };
    default:
      return state;
  }
};

// Create context
const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
);

// Provider component
interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Add notification
  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = generateId();
    const newNotification: Notification = {
      id,
      duration: 5000, // Default 5 seconds
      ...notification,
    };

    dispatch({ type: "ADD_NOTIFICATION", payload: newNotification });

    // Auto remove notification after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  };

  // Remove notification
  const removeNotification = (id: string) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
  };

  // Clear all notifications
  const clearAll = () => {
    dispatch({ type: "CLEAR_ALL" });
  };

  // Convenience methods
  const success = (
    message: string,
    title?: string,
    options?: Partial<Notification>
  ) => {
    addNotification({
      type: "success",
      title,
      message,
      ...options,
    });
  };

  const error = (
    message: string,
    title?: string,
    options?: Partial<Notification>
  ) => {
    addNotification({
      type: "error",
      title,
      message,
      duration: 0, // Error notifications don't auto-dismiss
      ...options,
    });
  };

  const warning = (
    message: string,
    title?: string,
    options?: Partial<Notification>
  ) => {
    addNotification({
      type: "warning",
      title,
      message,
      ...options,
    });
  };

  const info = (
    message: string,
    title?: string,
    options?: Partial<Notification>
  ) => {
    addNotification({
      type: "info",
      title,
      message,
      ...options,
    });
  };

  const value: NotificationContextValue = {
    notifications: state.notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use notification context
export const useNotification = (): NotificationContextValue => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

export default NotificationContext;
