import React from 'react';
import type { App } from '../types.ts';

interface AppCardProps {
  app: App;
  onViewDetails: (app: App) => void;
}

const AppCard: React.FC<AppCardProps> = ({ app, onViewDetails }) => {
  const isInstalled = app.installed;

  return (
    <div className="group relative flex-shrink-0 w-48 h-64 bg-slate-800 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/50 focus-within:ring-4 focus-within:ring-cyan-400 focus-within:scale-105">
      <img src={app.icon} alt={app.name} className="w-full h-2/3 object-cover" />
      <div className="p-3 flex flex-col justify-between h-1/3">
        <h3 className="text-white font-bold text-lg truncate">{app.name}</h3>
        <button
          onClick={() => onViewDetails(app)}
          disabled={isInstalled}
          className={`w-full text-white font-semibold py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white ${
            isInstalled
              ? 'bg-green-700 cursor-not-allowed'
              : 'bg-sky-600 hover:bg-sky-500'
          }`}
        >
          {isInstalled ? 'Đã cài đặt' : 'Chi tiết'}
        </button>
      </div>
    </div>
  );
};

export default AppCard;