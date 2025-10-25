import React, { useState } from 'react';
import type { App } from '../types';

interface AppDetailModalProps {
  app: App;
  onClose: () => void;
  onInstall: (id: number) => void;
}

const AppDetailModal: React.FC<AppDetailModalProps> = ({ app, onClose, onInstall }) => {
  const [installStatus, setInstallStatus] = useState<'idle' | 'installing' | 'installed'>(
    app.installed ? 'installed' : 'idle'
  );

  const handleInstallClick = () => {
    if (installStatus !== 'idle') return;
    setInstallStatus('installing');
    setTimeout(() => {
      onInstall(app.id);
      setInstallStatus('installed');
       setTimeout(onClose, 500); // Close modal after showing installed status briefly
    }, 1500); // Simulate install time
  };

  const getButtonState = () => {
    switch (installStatus) {
      case 'installing':
        return { text: 'Đang cài...', disabled: true, className: 'bg-yellow-600' };
      case 'installed':
        return { text: 'Đã cài đặt', disabled: true, className: 'bg-green-700' };
      case 'idle':
      default:
        return { text: 'Cài đặt', disabled: false, className: 'bg-sky-600 hover:bg-sky-500' };
    }
  };

  const buttonState = getButtonState();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl mx-4 overflow-hidden border border-cyan-500/30">
        <div className="relative">
          <img src={app.icon} alt={`${app.name} banner`} className="w-full h-48 object-cover opacity-30" />
           <button
              onClick={onClose}
              className="absolute top-3 right-3 inline-flex items-center justify-center rounded-full bg-slate-900/50 text-slate-300 h-8 w-8 hover:bg-slate-700/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label="Đóng"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
        </div>
        <div className="p-8 -mt-20">
            <div className='flex items-end space-x-6'>
                <img src={app.icon} alt={app.name} className="w-32 h-32 rounded-lg object-cover shadow-lg border-4 border-slate-700" />
                 <div className="flex-1">
                    <h2 className="text-4xl font-bold text-white tracking-tight">{app.name}</h2>
                    <p className="text-cyan-400 font-semibold">{app.category}</p>
                 </div>
                <button
                    onClick={handleInstallClick}
                    disabled={buttonState.disabled}
                    className={`px-8 py-3 text-white font-bold text-lg rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white ${buttonState.className}`}
                >
                {buttonState.text}
                </button>
            </div>
          
            <div className="mt-6">
                <h3 className="text-xl font-semibold text-slate-300 mb-2">Mô tả</h3>
                <p className="text-slate-400 text-base leading-relaxed max-h-48 overflow-y-auto">
                    {app.description}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AppDetailModal;
