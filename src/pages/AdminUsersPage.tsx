import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/admin';
import { UserTable } from '../components/admin/UserTable';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { UserRole, UserStatus } from '../types';
import type { UserAdminView } from '../types';
import { toast } from '../utils/toast';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserAdminView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);

  useEffect(() => {
    loadUsers();
  }, [page]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.listUsers({
        skip: (page - 1) * pageSize,
        limit: pageSize,
      });
      setUsers(response.items);
      setTotal(response.total);
    } catch (error: any) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, role: UserRole) => {
    try {
      await adminApi.updateUserRole(userId, { role });
      toast.success('User role updated');
      loadUsers();
    } catch (error: any) {
      toast.error('Failed to update user role');
    }
  };

  const handleStatusChange = async (userId: string, status: UserStatus) => {
    try {
      await adminApi.updateUserStatus(userId, { status });
      toast.success('User status updated');
      loadUsers();
    } catch (error: any) {
      toast.error('Failed to update user status');
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">User Management</h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <UserTable
            users={users}
            onRoleChange={handleRoleChange}
            onStatusChange={handleStatusChange}
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
