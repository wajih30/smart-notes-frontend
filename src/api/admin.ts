import apiClient from './client';
import type {
  SystemStats,
  UserListResponse,
  UserAdminView,
  UpdateUserRoleRequest,
  UpdateUserStatusRequest,
} from '../types';

export const adminApi = {
  // Get System Stats
  getSystemStats: async (): Promise<SystemStats> => {
    const response = await apiClient.get<SystemStats>('/api/admin/stats');
    return response.data;
  },

  // List Users
  listUsers: async (params?: {
    skip?: number;
    limit?: number;
  }): Promise<UserListResponse> => {
    const response = await apiClient.get<UserListResponse>('/api/admin/users', { params });
    return response.data;
  },

  // Update User Role
  updateUserRole: async (
    userId: string,
    data: UpdateUserRoleRequest
  ): Promise<UserAdminView> => {
    const response = await apiClient.patch<UserAdminView>(
      `/api/admin/users/${userId}/role`,
      data
    );
    return response.data;
  },

  // Update User Status
  updateUserStatus: async (
    userId: string,
    data: UpdateUserStatusRequest
  ): Promise<UserAdminView> => {
    const response = await apiClient.patch<UserAdminView>(
      `/api/admin/users/${userId}/status`,
      data
    );
    return response.data;
  },
};
