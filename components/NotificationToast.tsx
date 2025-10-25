import React, { useEffect } from 'react';
import type { App } from '../types';

interface NotificationToastProps {
  app: App;
  onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ app, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-close after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 z-50 w-full max-w-sm bg-slate-800 rounded-xl shadow-lg border border-cyan-500/50 animate-fade-in-up">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <img className="h-16 w-16 rounded-lg object-cover" src={app.icon} alt={app.name} />
          </div>
          <div className="ml-4 w-0 flex-1">
            <p className="text-base font-bold text-cyan-300">{app.name}</p>
            <p className="mt-1 text-sm font-medium text-green-400">Đã cài đặt thành công!</p>
            <p className="mt-1 text-sm text-slate-300 overflow-hidden text-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {app.description}
            </p>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              onClick={onClose}
              className="inline-flex rounded-md bg-slate-800 text-slate-400 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-800"
              aria-label="Đóng"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;