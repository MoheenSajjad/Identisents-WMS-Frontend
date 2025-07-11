import {
  NotificationConfig,
  NotificationType,
} from '@/components/parts/notifications/notification.types';
import { getGlobalNotify } from '@/components/parts/notifications';

const createNotifyFunction = (
  type: NotificationType,
  message: string,
  config?: NotificationConfig
) => {
  const globalNotifyFn = getGlobalNotify();
  if (globalNotifyFn) {
    globalNotifyFn(type, message, config);
  } else {
    console.warn(
      'Notification system not initialized. Make sure to wrap your app with NotificationProvider.'
    );
  }
};

export const notify = {
  success: (message: string, config?: NotificationConfig) => {
    createNotifyFunction('success', message, config);
  },
  error: (message: string, config?: NotificationConfig) => {
    createNotifyFunction('error', message, config);
  },
  warning: (message: string, config?: NotificationConfig) => {
    createNotifyFunction('warning', message, config);
  },
  info: (message: string, config?: NotificationConfig) => {
    createNotifyFunction('info', message, config);
  },
  show: (type: NotificationType, message: string, config?: NotificationConfig) => {
    createNotifyFunction(type, message, config);
  },
};
