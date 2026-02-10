import apiClient from './client';
import type {
  QASession,
  QASessionCreate,
  QASessionListResponse,
  QASessionUpdateRequest,
  QAMessage,
  QAMessageCreate,
  QAMessageResponse,
  MessageResponse,
} from '../types';

export const qaApi = {
  // Create Session
  createSession: async (data: QASessionCreate): Promise<QASession> => {
    const response = await apiClient.post<QASession>('/api/qa/sessions', data);
    return response.data;
  },

  // List Sessions
  listSessions: async (params?: {
    skip?: number;
    limit?: number;
  }): Promise<QASessionListResponse> => {
    const response = await apiClient.get<QASessionListResponse>('/api/qa/sessions', { params });
    return response.data;
  },

  // Get Session
  getSession: async (sessionId: string): Promise<QASession> => {
    const response = await apiClient.get<QASession>(`/api/qa/sessions/${sessionId}`);
    return response.data;
  },

  // Update Session
  updateSession: async (
    sessionId: string,
    data: QASessionUpdateRequest
  ): Promise<QASession> => {
    const response = await apiClient.patch<QASession>(`/api/qa/sessions/${sessionId}`, data);
    return response.data;
  },

  // Delete Session
  deleteSession: async (sessionId: string): Promise<MessageResponse> => {
    const response = await apiClient.delete<MessageResponse>(`/api/qa/sessions/${sessionId}`);
    return response.data;
  },

  // Get Session Messages
  getSessionMessages: async (sessionId: string): Promise<QAMessage[]> => {
    const response = await apiClient.get<QAMessage[]>(`/api/qa/sessions/${sessionId}/messages`);
    return response.data;
  },

  // Send Message
  sendMessage: async (
    sessionId: string,
    data: QAMessageCreate
  ): Promise<QAMessageResponse> => {
    const response = await apiClient.post<QAMessageResponse>(
      `/api/qa/sessions/${sessionId}/messages`,
      data
    );
    return response.data;
  },

  // Get Session Summary
  getSessionSummary: async (sessionId: string): Promise<{
    session_id: string;
    title: string;
    note_count: number;
    message_count: number;
    user_messages: number;
    ai_messages: number;
    created_at: string;
    updated_at: string;
  }> => {
    const response = await apiClient.get(`/api/qa/sessions/${sessionId}/summary`);
    return response.data;
  },
};
