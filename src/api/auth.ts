import apiClient from './client';
import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  User,
  VerifyEmailRequest,
  ResendVerificationRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  RegistrationResponse,
  MessageResponse,
} from '../types';

export const authApi = {
  // Register
  register: async (data: RegisterRequest): Promise<RegistrationResponse> => {
    const response = await apiClient.post<RegistrationResponse>('/api/auth/register', data);
    return response.data;
  },

  // Verify Email
  verifyEmail: async (data: VerifyEmailRequest): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/api/auth/verify-email', data);
    return response.data;
  },

  // Resend Verification
  resendVerification: async (data: ResendVerificationRequest): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/api/auth/resend-verification', data);
    return response.data;
  },

  // Login
  login: async (data: LoginRequest): Promise<TokenResponse> => {
    // Use URLSearchParams for proper form encoding
    const params = new URLSearchParams();
    params.append('username', data.username);
    params.append('password', data.password);

    const response = await apiClient.post<TokenResponse>(
      '/api/auth/login',
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
  },

  // Logout
  logout: async (refreshToken: string): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/api/auth/logout', null, {
      params: { refresh_token: refreshToken },
    });
    return response.data;
  },

  // Refresh Token
  refreshToken: async (refreshToken: string): Promise<{ access_token: string }> => {
    const response = await apiClient.post<{ access_token: string }>('/api/auth/refresh', null, {
      params: { refresh_token: refreshToken },
    });
    return response.data;
  },

  // Get Current User
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/auth/me');
    return response.data;
  },

  // Forgot Password
  forgotPassword: async (data: ForgotPasswordRequest): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/api/auth/forgot-password', data);
    return response.data;
  },

  // Reset Password
  resetPassword: async (data: ResetPasswordRequest): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/api/auth/reset-password', data);
    return response.data;
  },

  // Verify Reset Code
  verifyResetCode: async (token: string): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/api/auth/verify-reset-code', { token });
    return response.data;
  },

  // Change Password
  changePassword: async (data: ChangePasswordRequest): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/api/auth/change-password', data);
    return response.data;
  },
};
