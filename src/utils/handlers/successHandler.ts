import { notify } from '../notify/notify';
import { NotificationConfig } from '@/components/parts/notifications/notification.types';

interface SuccessHandlerOptions {
  message?: string;
  showNotification?: boolean;
  notificationConfig?: NotificationConfig;
  onSuccess?: (data: any) => void;
  customMessage?: (data: any) => string;
}

/**
 * Success handler utility for API responses
 * @param data - The response data from API
 * @param options - Configuration options
 * @returns The original data for chaining
 */
export const successHandler = <T = any>(data: T, options: SuccessHandlerOptions = {}): T => {
  const {
    message,
    showNotification = true,
    notificationConfig,
    onSuccess,
    customMessage,
  } = options;

  if (onSuccess) {
    onSuccess(data);
  }

  if (showNotification) {
    let notificationMessage = message;

    if (customMessage) {
      notificationMessage = customMessage(data);
    }

    if (!notificationMessage) {
      notificationMessage = getDefaultSuccessMessage(data);
    }

    notify.success(notificationMessage, notificationConfig);
  }

  return data;
};

/**
 * Get default success message based on response data
 */
const getDefaultSuccessMessage = (data: any): string => {
  if (data?.message) {
    return data.message;
  }

  // Default success messages
  return '✨ Operation completed successfully!';
};

/**
 * Specific success handlers for common operations
 */
export const successHandlers = {
  create: (data: any, entityName = 'Item') =>
    successHandler(data, {
      message: `${entityName} created successfully!`,
    }),

  update: (data: any, entityName = 'Item') =>
    successHandler(data, {
      message: `${entityName} updated successfully!`,
    }),

  delete: (data: any, entityName = 'Item') =>
    successHandler(data, {
      message: `${entityName} deleted successfully!`,
    }),

  login: (data: any) =>
    successHandler(data, {
      message: 'Welcome! Login successful!',
    }),

  logout: (data: any) =>
    successHandler(data, {
      message: 'Logged out successfully!',
    }),
};

/**
 * Success handler with custom notification position and duration
 */
export const successWithConfig = (data: any, message: string, config: NotificationConfig) => {
  return successHandler(data, {
    message,
    notificationConfig: config,
  });
};

/**
 * Silent success handler (no notification)
 */
export const silentSuccess = <T = any>(data: T): T => {
  return successHandler(data, { showNotification: false });
};

// import codeMessage from "../response-codes/ResponseCode";
// import { ApiResponse } from "@/types/api";
// import { notify } from "../notify/notify";

// const successHandler = (
//   response: ApiResponse,
//   options = { notifyOnSuccess: true, notifyOnFailed: true }
// ) => {
//   if (response && response.success === true) {
//     const message = response.message;

//     if (message) {
//       notify.show("success", message);
//       return;
//     }

//     if (options.notifyOnSuccess) {
//       notify.show("success", "Your request was successful.");
//     }
//   } else {
//     const message = response.message;

//     if (options.notifyOnFailed) {
//       notify.show("error", "Error occured while processing your request");
//     }
//   }
// };

// export default successHandler;
