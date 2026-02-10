import React from 'react';
import { Users, FileText, TrendingUp, Calendar, Activity } from 'lucide-react';
import type { SystemStats } from '../../types';

interface StatsCardsProps {
  stats: SystemStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="space-y-8">
      {/* Primary Metrics Section */}
      <div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Activity size={14} />
          Overview Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card-premium p-6 flex flex-col justify-between min-h-[140px]">
            <div className="flex items-start justify-between">
              <div className="bg-blue-500 p-3 rounded-2xl shadow-lg shadow-blue-200/50">
                <Users size={24} className="text-white" />
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Users</p>
                <p className="text-3xl font-black text-gray-900 leading-none">
                  {stats.total_users.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50">
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                REAL-TIME UPDATES
              </div>
            </div>
          </div>

          <div className="card-premium p-6 flex flex-col justify-between min-h-[140px]">
            <div className="flex items-start justify-between">
              <div className="bg-green-500 p-3 rounded-2xl shadow-lg shadow-green-200/50">
                <FileText size={24} className="text-white" />
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Notes</p>
                <p className="text-3xl font-black text-gray-900 leading-none">
                  {stats.total_notes.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50">
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                REAL-TIME UPDATES
              </div>
            </div>
          </div>

          <div className="card-premium p-6 flex flex-col justify-between min-h-[140px]">
            <div className="flex items-start justify-between">
              <div className="bg-purple-500 p-3 rounded-2xl shadow-lg shadow-purple-200/50">
                <TrendingUp size={24} className="text-white" />
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Active Users</p>
                <p className="text-3xl font-black text-gray-900 leading-none">
                  {stats.active_users.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50">
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                REAL-TIME UPDATES
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Metrics Section */}
      <div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Calendar size={14} />
          Recent Activity
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-premium p-6 flex flex-col justify-between min-h-[140px]">
            <div className="flex items-start justify-between">
              <div className="bg-orange-500 p-3 rounded-2xl shadow-lg shadow-orange-200/50">
                <Calendar size={24} className="text-white" />
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Notes Today</p>
                <p className="text-3xl font-black text-gray-900 leading-none">
                  {stats.notes_created_today.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50">
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                REAL-TIME UPDATES
              </div>
            </div>
          </div>

          <div className="card-premium p-6 flex flex-col justify-between min-h-[140px]">
            <div className="flex items-start justify-between">
              <div className="bg-pink-500 p-3 rounded-2xl shadow-lg shadow-pink-200/50">
                <Calendar size={24} className="text-white" />
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Notes This Week</p>
                <p className="text-3xl font-black text-gray-900 leading-none">
                  {stats.notes_created_this_week.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50">
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                REAL-TIME UPDATES
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
