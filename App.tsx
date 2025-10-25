
import React, { useState, useCallback, useEffect } from 'react';
import CategoryList from './components/CategoryList.tsx';
import NotificationToast from './components/NotificationToast.tsx';
import AppDetailModal from './components/AppDetailModal.tsx';
import UploadAppModal from './components/UploadAppModal.tsx';
import PasswordModal from './components/PasswordModal.tsx';
import PlusIcon from './components/icons/PlusIcon.tsx';
import SearchIcon from './components/icons/SearchIcon.tsx';
import { CATEGORIES } from './constants.ts';
import type { App as AppType } from './types.ts';
import { initDB, getApps, saveApp } from './services/dbService.ts';

const App: React.FC = () => {
  const [apps, setApps] = useState<AppType[]>([]);
  const [dbReady, setDbReady] = useState(false);
  const [notificationApp, setNotificationApp] = useState<AppType | null>(null);
  const [selectedApp, setSelectedApp] = useState<AppType | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const initialize = async () => {
        const success = await initDB();
        if (success) {
            const storedApps = await getApps();
            setApps(storedApps);
            setDbReady(true);
        }
    };
    initialize();
  }, []);


  const handleDownload = useCallback((appToDownload: AppType) => {
    let url: string | undefined;
    
    if (appToDownload.apk instanceof File) {
        url = URL.createObjectURL(appToDownload.apk);
    } else if (appToDownload.apkUrl) {
        url = appToDownload.apkUrl;
    }

    if (!url) {
      alert("Ứng dụng này không có tệp APK để tải xuống.");
      return;
    }

    const link = document.createElement('a');
    link.href = url;
    const fileName = `${appToDownload.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.apk`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Revoke object URL to free up memory if it was created
    if (appToDownload.apk instanceof File) {
        URL.revokeObjectURL(url);
    }
    
    // Close the detail modal after download
    setSelectedApp(prev => prev && prev.id === appToDownload.id ? {...prev, installed: true} : prev);

    // Give visual feedback
    let downloadedApp: AppType | undefined;
    setApps(prevApps =>
      prevApps.map(app => {
        if (app.id === appToDownload.id) {
          const updatedApp = { ...app, installed: true };
          downloadedApp = updatedApp;
          return updatedApp;
        }
        return app;
      })
    );
    if (downloadedApp) {
        setNotificationApp(downloadedApp);
    }
  }, []);

  const handleViewDetails = (app: AppType) => {
    setSelectedApp(app);
  };

  const handleCloseModal = () => {
    setSelectedApp(null);
  }

  const handleUpload = useCallback(async (newApp: Omit<AppType, 'id' | 'installed'> & { iconFile: File, apkFile: File }) => {
    const appToSave: AppType = {
        name: newApp.name,
        icon: newApp.iconFile,
        category: newApp.category,
        description: newApp.description,
        apk: newApp.apkFile,
        id: Date.now(), // Generate a unique ID
        installed: false
    };

    await saveApp(appToSave);
    setApps(prevApps => [...prevApps, appToSave]);
  }, []);

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!dbReady) {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-slate-300 mt-4 text-lg">Đang tải cơ sở dữ liệu...</p>
            </div>
        </div>
    )
  }


  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center gap-8">
          <div className="flex items-center gap-4 flex-shrink-0">
            <h1 className="text-4xl font-extrabold tracking-tight">
              <span className="text-white">Bao</span>
              <span className="text-cyan-400">Store</span>
            </h1>
            <div className="hidden md:flex items-center gap-4">
              <div className="border-l border-slate-700 h-8"></div>
              <p className="text-slate-400">Kho ứng dụng dành cho TV</p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-1 justify-end max-w-lg">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon className="w-5 h-5 text-slate-400" />
              </span>
              <input
                type="text"
                placeholder="Tìm kiếm ứng dụng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-md shadow-sm py-2 pl-10 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
                aria-label="Tìm kiếm ứng dụng"
              />
            </div>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="flex-shrink-0 flex items-center space-x-2 px-4 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-white"
            >
              <PlusIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Tải lên</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8">
        {searchQuery && filteredApps.length === 0 ? (
          <div className="text-center py-16 px-4">
            <h2 className="text-2xl font-bold text-slate-300">Không tìm thấy kết quả</h2>
            <p className="text-lg text-slate-400 mt-2">
              Không có ứng dụng nào phù hợp với tìm kiếm: <span className="font-semibold text-cyan-400">"{searchQuery}"</span>
            </p>
          </div>
        ) : (
          CATEGORIES.map(category => (
            <CategoryList
              key={category}
              category={category}
              apps={filteredApps}
              onViewDetails={handleViewDetails}
            />
          ))
        )}
      </main>

      {selectedApp && (
        <AppDetailModal
          app={selectedApp}
          onClose={handleCloseModal}
          onDownload={handleDownload}
        />
      )}

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={() => {
            setIsPasswordModalOpen(false);
            setIsUploadModalOpen(true);
        }}
      />

      <UploadAppModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
      />

      {notificationApp && (
        <NotificationToast 
          app={notificationApp} 
          onClose={() => setNotificationApp(null)} 
        />
      )}
    </div>
  );
};

export default App;
