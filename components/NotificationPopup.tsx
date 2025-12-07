import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon } from './Icons';
import Button from './Button';

interface NotificationPopupProps {
  notification: {
    title: string;
    message: string;
    type: 'success' | 'error';
    action?: {
      label: string;
      path: string;
    };
  };
  onClose: () => void;
  duration?: number;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ notification, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircleIcon className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" />,
    error: <XCircleIcon className="w-10 h-10 sm:w-12 sm:h-12 text-red-500" />,
  };

  const iconBgColor = {
    success: 'bg-green-100 dark:bg-green-500/20',
    error: 'bg-red-100 dark:bg-red-500/20',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in-overlay">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl p-6 sm:p-8 text-center w-full max-w-sm transform animate-popup-in">
        <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto ${iconBgColor[notification.type]} rounded-full flex items-center justify-center`}>
          <div className="transform scale-0 animate-icon-in">
             {icons[notification.type]}
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-neutral-800 dark:text-neutral-100 mt-4">{notification.title}</h3>
        <p className="text-neutral-600 dark:text-neutral-300 mt-2">{notification.message}</p>
        
        {notification.action && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button variant="secondary" onClick={onClose} className="w-full">
              Tutup
            </Button>
            <Link to={notification.action.path} onClick={onClose} className="w-full">
               <Button className="w-full">{notification.action.label}</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPopup;