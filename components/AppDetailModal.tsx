
import React, { useState, useEffect } from 'react';
import type { App } from '../types.ts';

interface AppDetailModalProps {
  app: App;
  onClose: () => void;
  onDownload: (app: App) => void;
}

const AppDetailModal: React.FC<AppDetailModalProps> = ({ app, onClose, onDownload }) => {
  const [installStatus, setInstallStatus] = useState<'idle' | 'installing' | 'installed'>(
    app.installed ? 'installed' : 'idle'
  );
  const [iconUrl, setIconUrl] = useState('');

  useEffect(() => {
    let objectUrl: string | null = null;
    if (app.icon instanceof File) {
      objectUrl = URL.createObjectURL(app.icon);
      setIconUrl(objectUrl);
    } else {
      setIconUrl(app.icon);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [app.icon]);

  const handleDownloadClick = () => {
    if (!app.apk && !app.apkUrl || installStatus !== 'idle') return;
    setInstallStatus('installing');
    // Short delay to simulate preparation before download
    setTimeout(() => {
      onDownload(app);
      setInstallStatus('installed');
      setTimeout(onClose, 500); // Close modal after showing status briefly
    }, 500); 
  };

  const getButtonState = () => {
    if (!app.apk && !app.apkUrl) {
      return { text: 'Không có sẵn', disabled: true, className: 'bg-slate-600 cursor-not-allowed' };
    }
    switch (installStatus) {
      case 'installing':
        return { text: 'Đang chuẩn bị...', disabled: true, className: 'bg-yellow-600' };
      case 'installed':
        return { text: 'Đã tải xuống', disabled: true, className: 'bg-green-700' };
      case 'idle':
      default:
        return { text: 'Tải xuống APK', disabled: false, className: 'bg-sky-600 hover:bg-sky-500' };
    }
  };

  const buttonState = getButtonState();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl mx-4 overflow-hidden border border-cyan-500/30">
        <div className="relative">
          {iconUrl && <img src={iconUrl} alt={`${app.name} banner`} className="w-full h-48 object-cover opacity-30" />}
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
                {iconUrl && <img src={iconUrl} alt={app.name} className="w-32 h-32 rounded-lg object-cover shadow-lg border-4 border-slate-700" />}
                 <div className="flex-1">
                    <h2 className="text-4xl font-bold text-white tracking-tight">{app.name}</h2>
                    <p className="text-cyan-400 font-semibold">{app.category}</p>
                 </div>
                <button
                    onClick={handleDownloadClick}
                    disabled={buttonState.disabled}
                    className={`px-8 py-3 text-white font-bold text-lg rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white ${buttonState.className}`}
                >
                {buttonState.text}
                </button>
            </div>
          
            <div className="mt-10">
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
