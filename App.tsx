import React, { useState, useCallback } from 'react';
import CategoryList from './components/CategoryList';
import NotificationToast from './components/NotificationToast';
import AppDetailModal from './components/AppDetailModal';
import { INITIAL_APPS, CATEGORIES } from './constants';
import type { App as AppType } from './types';

const App: React.FC = () => {
  const [apps, setApps] = useState<AppType[]>(INITIAL_APPS);
  const [notificationApp, setNotificationApp] = useState<AppType | null>(null);
  const [selectedApp, setSelectedApp] = useState<AppType | null>(null);


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

  const handleViewDetails = (app: AppType) => {
    setSelectedApp(app);
  };

  const handleCloseModal = () => {
    setSelectedApp(null);
  }


  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span className="text-white">Bao</span>
            <span className="text-cyan-400">Store</span>
          </h1>
        </div>
      </header>

      <main className="container mx-auto py-8">
        {CATEGORIES.map(category => (
          <CategoryList
            key={category}
            category={category}
            apps={apps}
            onViewDetails={handleViewDetails}
          />
        ))}
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
    </div>
  );
};

export default App;