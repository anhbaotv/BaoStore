import React from 'react';
import AppCard from './AppCard';
import type { App } from '../types';
import type { Category as CategoryType } from '../types';

interface CategoryListProps {
  category: CategoryType;
  apps: App[];
  onViewDetails: (app: App) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ category, apps, onViewDetails }) => {
  const filteredApps = apps.filter(app => app.category === category);

  if (filteredApps.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-4 px-4 md:px-8 text-cyan-300">{category}</h2>
      <div className="relative">
        <div className="flex space-x-6 overflow-x-auto pb-4 px-4 md:px-8 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
          {filteredApps.map(app => (
            <AppCard key={app.id} app={app} onViewDetails={onViewDetails} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;