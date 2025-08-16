import React from 'react';
import AnimatedNotification from './AnimatedNotification';

interface NotificationContainerProps {
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }>;
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onClose,
  position = 'top-right'
}) => {
  // Position styles based on the position prop
  const containerStyles = {
    'top-right': 'fixed top-0 right-0 z-50 p-4 space-y-4',
    'top-left': 'fixed top-0 left-0 z-50 p-4 space-y-4',
    'bottom-right': 'fixed bottom-0 right-0 z-50 p-4 space-y-4',
    'bottom-left': 'fixed bottom-0 left-0 z-50 p-4 space-y-4',
    'top-center': 'fixed top-0 left-1/2 transform -translate-x-1/2 z-50 p-4 space-y-4',
    'bottom-center': 'fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 p-4 space-y-4'
  };
  
  if (notifications.length === 0) return null;
  
  return (
    <div className={containerStyles[position]}>
      {notifications.map(notification => (
        <AnimatedNotification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          duration={notification.duration}
          position={position}
          onClose={() => onClose(notification.id)}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;