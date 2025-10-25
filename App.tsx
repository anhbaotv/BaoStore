import React, { useState, useCallback } from 'react';
import CategoryList from './components/CategoryList';
import NotificationToast from './components/NotificationToast';
import AppDetailModal from './components/AppDetailModal';
import UploadAppModal from './components/UploadAppModal';
import LoginModal from './components/LoginModal';
import { INITIAL_APPS, CATEGORIES } from './constants';
import type { App as AppType } from './types';
import SearchIcon from './components/icons/SearchIcon';
import PlusIcon from './components/icons/PlusIcon';
import UserIcon from './components/icons/UserIcon';
import LogoutIcon from './components/icons/LogoutIcon';


const App: React.FC = () => {
  const [apps, setApps] = useState<AppType[]>(INITIAL_APPS);
  const [notificationApp, setNotificationApp] = useState<AppType | null>(null);
  const [selectedApp, setSelectedApp] = useState<AppType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  const handleInstall = useCallback((id: number) => {
    let installedApp: AppType | undefined;
    setApps(prevApps =>
      prevApps.map(app => {
        if (app.id === id && !app.installed) {
          const updatedApp = { ...app, installed: true };
          installedApp = updatedApp;
          return updatedApp;
        }
        return app;
      })
    );
    
    // Close the detail modal after install
    setSelectedApp(prev => prev && prev.id === id ? {...prev, installed: true} : prev);

    if (installedApp) {
        setNotificationApp(installedApp);
    }
  }, []);

  const handleUpload = (newApp: Omit<AppType, 'id' | 'installed'>) => {
    setApps(prevApps => [
        { 
            ...newApp, 
            id: Date.now(), // Use a more robust ID in a real app
            installed: false 
        },
        ...prevApps,
    ]);
  };

  const handleViewDetails = (app: AppType) => {
    setSelectedApp(app);
  };

  const handleCloseModal = () => {
    setSelectedApp(null);
  }

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-6">
          <div className="flex items-center flex-shrink-0">
            <h1 className="text-4xl font-extrabold tracking-tight">
              <span className="text-white">Bao</span>
              <span className="text-cyan-400">Store</span>
            </h1>
          </div>
          
          <div className="flex-1 flex items-center justify-end gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 text-cyan-300">
                  <UserIcon className="w-6 h-6" />
                  <span className="font-semibold">Xin chào, Bao!</span>
                </div>
                <button 
                  onClick={() => setIsUploadModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-white transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Tải lên</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-white"
                  aria-label="Đăng xuất"
                >
                  <LogoutIcon className="w-6 h-6" />
                </button>
              </div>
            ) : (
               <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white font-semibold rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-white transition-colors"
              >
                <UserIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Đăng nhập để tải lên</span>
              </button>
            )}

            <div className="relative w-full max-w-xs sm:max-w-sm">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-slate-400" />
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full pl-10 pr-4 py-2 bg-slate-700/80 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                aria-label="Search for applications"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8">
        {filteredApps.length > 0 ? (
            CATEGORIES.map(category => (
              <CategoryList
                key={category}
                category={category}
                apps={filteredApps}
                onViewDetails={handleViewDetails}
              />
            ))
        ) : (
            <div className="text-center py-20 px-4">
              <h2 className="text-2xl font-semibold text-slate-300">Không tìm thấy ứng dụng nào</h2>
              <p className="text-slate-500 mt-2">Rất tiếc, chúng tôi không tìm thấy ứng dụng nào phù hợp với "{searchQuery}".</p>
            </div>
        )}
      </main>

      {selectedApp && (
        <AppDetailModal
          app={selectedApp}
          onClose={handleCloseModal}
          onInstall={handleInstall}
        />
      )}

      {notificationApp && (
        <NotificationToast 
          app={notificationApp} 
          onClose={() => setNotificationApp(null)} 
        />
      )}
      
      {isLoggedIn && (
        <UploadAppModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={handleUpload}
        />
      )}

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default App;