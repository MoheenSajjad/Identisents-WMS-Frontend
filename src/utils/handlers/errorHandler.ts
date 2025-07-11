import { notify } from '../notify/notify';
import { NotificationConfig } from '@/components/parts/notifications/notification.types';

interface ErrorHandlerOptions {
  message?: string;
  showNotification?: boolean;
  notificationConfig?: NotificationConfig;
  onError?: (error: any) => void;
  customMessage?: (error: any) => string;
  logError?: boolean;
  fallbackMessage?: string;
}

/**
 * Error handler utility for API responses and general errors
 * @param error - The error object
 * @param options - Configuration options
 * @throws Re-throws the error after handling
 */
export const errorHandler = (error: any, options: ErrorHandlerOptions = {}): never => {
  const {
    message,
    showNotification = true,
    notificationConfig,
    onError,
    customMessage,
    logError = true,
    fallbackMessage = '❌ Something went wrong. Please try again.',
  } = options;

  if (logError && process.env.NODE_ENV === 'development') {
    console.error('Error occurred:', error);
  }

  if (onError) {
    onError(error);
  }

  if (showNotification) {
    let notificationMessage = message;

    if (customMessage) {
      notificationMessage = customMessage(error);
    }

    if (!notificationMessage) {
      notificationMessage = extractErrorMessage(error, fallbackMessage);
    }

    notify.error(notificationMessage, notificationConfig);
  }

  throw error;
};

const extractErrorMessage = (error: any, fallback: string): string => {
  if (error?.response?.data) {
    const data = error.response.data;

    if (data.message) return data.message;
  }

  if (error?.message) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error?.code === 'ERR_NETWORK') {
    return '🌐 Network error. Please check your connection.';
  }

  if (error?.code === 'ECONNABORTED') {
    return '⏱️ Request timeout. Please try again.';
  }

  if (error?.response?.status === 401) {
    return '🔐 Unauthorized. Please login again.';
  }

  if (error?.response?.status === 403) {
    return "🚫 Access denied. You don't have permission.";
  }

  if (error?.response?.status === 404) {
    return '🔍 Resource not found.';
  }

  if (error?.response?.status === 500) {
    return '🔧 Server error. Please try again later.';
  }

  return fallback;
};

export const errorHandlers = {
  create: (error: any, entityName = 'item') =>
    errorHandler(error, {
      fallbackMessage: `❌ Failed to create ${entityName}. Please try again.`,
    }),

  update: (error: any, entityName = 'item') =>
    errorHandler(error, {
      fallbackMessage: `❌ Failed to update ${entityName}. Please try again.`,
    }),

  delete: (error: any, entityName = 'item') =>
    errorHandler(error, {
      fallbackMessage: `❌ Failed to delete ${entityName}. Please try again.`,
    }),

  fetch: (error: any, entityName = 'data') =>
    errorHandler(error, {
      fallbackMessage: `❌ Failed to load ${entityName}. Please refresh the page.`,
    }),

  upload: (error: any) =>
    errorHandler(error, {
      fallbackMessage: '📤 File upload failed. Please try again.',
    }),

  download: (error: any) =>
    errorHandler(error, {
      fallbackMessage: '📥 Download failed. Please try again.',
    }),

  login: (error: any) =>
    errorHandler(error, {
      fallbackMessage: '🔐 Login failed. Please check your credentials.',
    }),

  register: (error: any) =>
    errorHandler(error, {
      fallbackMessage: '📝 Registration failed. Please try again.',
    }),

  passwordReset: (error: any) =>
    errorHandler(error, {
      fallbackMessage: '🔐 Password reset failed. Please try again.',
    }),

  emailVerification: (error: any) =>
    errorHandler(error, {
      fallbackMessage: '✉️ Email verification failed. Please try again.',
    }),

  payment: (error: any) =>
    errorHandler(error, {
      fallbackMessage: '💳 Payment failed. Please try again.',
    }),

  validation: (error: any) =>
    errorHandler(error, {
      fallbackMessage: '⚠️ Please check your input and try again.',
    }),
};

export const errorWithConfig = (error: any, message: string, config: NotificationConfig) => {
  return errorHandler(error, {
    message,
    notificationConfig: config,
  });
};

export const silentError = (error: any): never => {
  return errorHandler(error, {
    showNotification: false,
    logError: true,
  });
};

export const handleErrorSafely = (error: any, options: ErrorHandlerOptions = {}): void => {
  try {
    errorHandler(error, options);
  } catch {
    // Swallow the re-thrown error
  }
};
