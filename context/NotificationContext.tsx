import React, { createContext, useState, ReactNode } from 'react';

interface NotificationAction {
  label: string;
  path: string;
}

interface Notification {
  title: string;
  message: string;
  type: 'success' | 'error';
  action?: NotificationAction;
}

interface NotificationContextType {
  showNotification: (title: string, message: string, type?: 'success' | 'error', action?: NotificationAction) => void;
  notification: Notification | null;
  hideNotification: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (title: string, message: string, type: 'success' | 'error' = 'success', action?: NotificationAction) => {
    setNotification({ title, message, type, action });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, notification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};