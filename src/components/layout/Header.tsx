import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/notes')) return 'My Notes';
    if (path.startsWith('/qa')) return 'AI Chat';
    if (path.startsWith('/search')) return 'Search';
    if (path.startsWith('/admin')) return 'Admin Panel';
    return 'Smart Notes';
  };

  const pageTitle = getPageTitle();

  return (
    <header className="bg-white border-b border-gray-100 px-8 py-4 sticky top-0 z-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            {pageTitle}
          </h1>
          <div className="flex items-center gap-3">
            <div className="px-3 py-0.5 bg-primary/5 border border-primary/10 rounded-full">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                AI Enabled
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100 group">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">System Status: Optimal</span>
          </div>
          <div className="h-8 w-[1px] bg-gray-100 hidden sm:block" />
          <div className="text-sm font-medium text-gray-600 hidden sm:block">
            {user?.full_name}
          </div>
        </div>
      </div>
    </header>
  );
};
