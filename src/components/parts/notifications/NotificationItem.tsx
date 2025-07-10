import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, XCircle, Info, Sparkles, AlertCircle } from 'lucide-react';
import { Notification, NotificationConfig } from './notification.types';

interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

export const NotificationItem: React.FC<{
  notification: Notification;
  onRemove: (id: string) => void;
}> = ({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const defaultConfig: NotificationConfig = {
    duration: 2500,
    position: 'top-right',
    showCloseButton: true,
    pauseOnHover: true,
  };

  const config = { ...defaultConfig, ...notification.config };

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (config.duration && config.duration > 0 && !isPaused) {
      const timer = setTimeout(() => {
        handleRemove();
      }, config.duration);

      return () => clearTimeout(timer);
    }
  }, [config.duration, isPaused, notification.id]);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(notification.id), 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'error':
        return <XCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5" />;
      case 'info':
        return <Info className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getStyles = () => {
    const baseStyles =
      'flex items-start gap-3 p-4 rounded-lg shadow-lg border backdrop-blur-sm transition-all duration-300 transform';

    switch (notification.type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-200 text-green-800`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-200 text-red-800`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-200 text-yellow-800`;
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-200 text-blue-800`;
      default:
        return `${baseStyles} bg-gray-50 border-gray-200 text-gray-800`;
    }
  };

  const getIconColor = () => {
    switch (notification.type) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div
      className={`${getStyles()} ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      onMouseEnter={() => config.pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => config.pauseOnHover && setIsPaused(false)}
    >
      <div className={`flex-shrink-0 ${getIconColor()}`}>{getIcon()}</div>

      <div className="min-w-0 flex-1">
        <p className="text-sm leading-5 font-medium">{notification.message}</p>
      </div>

      {config.showCloseButton && (
        <button
          onClick={handleRemove}
          className="ml-2 flex-shrink-0 text-gray-400 transition-colors hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
