export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationConfig {
  duration?: number;
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center';
  showCloseButton?: boolean;
  pauseOnHover?: boolean;
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  config?: NotificationConfig;
}

export interface NotificationContextType {
  notifications: Notification[];
  notify: (type: NotificationType, message: string, config?: NotificationConfig) => void;
  removeNotification: (id: string) => void;
}
