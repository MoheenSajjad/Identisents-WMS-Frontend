import React from 'react';
import { Notification, NotificationConfig } from './notification.types';
import { NotificationItem } from './NotificationItem';

export const NotificationContainer: React.FC<{
  notifications: Notification[];
  onRemove: (id: string) => void;
}> = ({ notifications, onRemove }) => {
  const getPositionStyles = (position: NotificationConfig['position']) => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  const groupedNotifications = notifications.reduce(
    (groups, notification) => {
      const position = notification.config?.position || 'top-right';
      if (!groups[position]) {
        groups[position] = [];
      }
      groups[position].push(notification);
      return groups;
    },
    {} as Record<string, Notification[]>
  );

  return (
    <>
      {Object.entries(groupedNotifications).map(([position, notifs]) => (
        <div
          key={position}
          className={`fixed z-50 flex flex-col gap-2 ${getPositionStyles(
            position as NotificationConfig['position']
          )} pointer-events-none w-full max-w-sm`}
        >
          {notifs.map(notification => (
            <div key={notification.id} className="pointer-events-auto">
              <NotificationItem notification={notification} onRemove={onRemove} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
};
