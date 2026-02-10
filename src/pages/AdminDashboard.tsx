import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/admin';
import { StatsCards } from '../components/admin/StatsCards';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import type { SystemStats } from '../types';
import { toast } from '../utils/toast';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const statsData = await adminApi.getSystemStats();
      setStats(statsData);
    } catch (error: any) {
      toast.error('Failed to load statistics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      <StatsCards stats={stats} />
    </div>
  );
};
