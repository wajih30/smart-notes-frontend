import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FileText,
  MessageSquare,
  Search,
  Users,
  BarChart3,
  LogOut,
  Sparkles,
  LucideIcon,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSidebar } from '../../contexts/SidebarContext';
import { cn } from '../../utils/cn';

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: 'My Notes', path: '/notes', icon: FileText },
  { label: 'AI Chat', path: '/qa', icon: MessageSquare },
  { label: 'Search', path: '/search', icon: Search },
];

const adminNavItems: NavItem[] = [
  { label: 'Admin Panel', path: '/admin', icon: BarChart3, adminOnly: true },
  { label: 'Manage Users', path: '/admin/users', icon: Users, adminOnly: true },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { sidebarContent } = useSidebar();
  const isAdmin = user?.role === 'admin';

  const allNavItems = [...navItems, ...(isAdmin ? adminNavItems : [])];

  return (
    <div className="h-full bg-white border-r border-gray-100 flex flex-col w-72">
      <div className="p-8 pb-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200 group-hover:scale-110 transition-transform">
            <Sparkles size={22} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            Smart Notes
          </h1>
        </Link>
      </div>

      <nav className="p-4 space-y-1.5 overflow-y-auto flex-1 scrollbar-hide">
        <div className="mb-6">
          <p className="px-4 mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Navigation
          </p>
          {allNavItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null;

            const isActive = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'sidebar-link group flex items-center gap-3.5',
                  isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'
                )}
              >
                <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
                  <Icon size={18} className={cn(
                    'transition-colors',
                    isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-900'
                  )} />
                </div>
                <span className="text-[14px] font-semibold tracking-tight leading-none">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {sidebarContent && (
          <div className="pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-left-2 duration-300">
            {sidebarContent}
          </div>
        )}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate leading-none mb-1">{user?.full_name}</p>
              <p className="text-[10px] text-gray-500 truncate leading-none">{user?.email}</p>
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          className="sidebar-link sidebar-link-inactive w-full hover:bg-red-50 hover:text-red-600 group flex items-center gap-3.5"
        >
          <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
            <LogOut size={18} className="text-gray-400 group-hover:text-red-600" />
          </div>
          <span className="text-[14px] font-semibold tracking-tight leading-none">Logout</span>
        </button>
      </div>
    </div>
  );
};
