import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../api/auth';
import type { User, TokenResponse } from '../types';
import { toast } from '../utils/toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const userData = await authApi.getCurrentUser();
      setUser(userData);
    } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const tokens: TokenResponse = await authApi.login({
        username: email,
        password,
      });

      localStorage.setItem('access_token', tokens.access_token);
      localStorage.setItem('refresh_token', tokens.refresh_token);

      const userData = await authApi.getCurrentUser();
      setUser(userData);
      toast.success('Logged in successfully');
    } catch (error: any) {
      console.error('Login error:', error);
      let message = 'Login failed';
      if (error.response?.data?.detail) {
        // Use the exact error message from backend
        message = error.response.data.detail;
        console.log('Backend error message:', message);
      } else if (error.response?.status === 403) {
        message = 'Access forbidden. Please contact support.';
      } else if (error.response?.status === 401) {
        message = 'Invalid email or password';
      }
      console.log('Displaying toast with message:', message);
      toast.error(message);
      throw error;
    }
  };

  const register = async (email: string, password: string, fullName?: string) => {
    try {
      await authApi.register({ email, password, full_name: fullName });
      toast.success('Account created. Please verify your email.');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      toast.info('Logged out successfully');
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await authApi.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
