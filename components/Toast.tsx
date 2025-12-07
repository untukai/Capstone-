import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose, duration]);

  return (
    <div className="fixed bottom-5 right-5 bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-800 py-3 px-6 rounded-lg shadow-lg animate-fade-in-up font-semibold">
      {message}
    </div>
  );
};

export default Toast;