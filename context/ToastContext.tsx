import React, { createContext, useState, ReactNode } from 'react';

interface ToastContextType {
  showToast: (message: string) => void;
  toastMessage: string | null;
  hideToast: () => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  const hideToast = () => {
    setToastMessage(null);
  };

  return (
    <ToastContext.Provider value={{ showToast, toastMessage, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
};
