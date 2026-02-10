import React, { useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '../ui/Toast';
import { cn } from '../../utils/cn';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden relative">
        {/* Mobile header (Slimmer & Modern) */}
        <div className="lg:hidden bg-white/80 backdrop-blur-md border-b border-gray-100 px-5 py-4 flex items-center justify-between sticky top-0 z-30">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center shadow-md shadow-primary-100">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-[17px] font-bold tracking-tight text-gray-900 leading-none pt-[1px]">
              Smart Notes
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 -mr-2 rounded-xl text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Desktop header (Slimmer) */}
        <div className="hidden lg:block">
          <Header />
        </div>

        {/* Page content (Standardized padding & scroll) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
};
