import { useState, useCallback } from 'react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Generate a unique ID for notifications
  const generateId = () => `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Add a notification
  const addNotification = useCallback((type: NotificationType, message: string, duration = 3000) => {
    const id = generateId();
    setNotifications(prev => [...prev, { id, type, message, duration }]);
    return id;
  }, []);
  
  // Remove a notification by ID
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  
  // Shorthand methods for different notification types
  const success = useCallback((message: string, duration?: number) => {
    return addNotification('success', message, duration);
  }, [addNotification]);
  
  const error = useCallback((message: string, duration?: number) => {
    return addNotification('error', message, duration);
  }, [addNotification]);
  
  const warning = useCallback((message: string, duration?: number) => {
    return addNotification('warning', message, duration);
  }, [addNotification]);
  
  const info = useCallback((message: string, duration?: number) => {
    return addNotification('info', message, duration);
  }, [addNotification]);
  
  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info
  };
};

export default useNotification;