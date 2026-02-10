import apiClient from './client';
import type {
  Note,
  NoteCreate,
  NoteUpdate,
  NoteListResponse,
  NoteCreateResponse,
  TagSuggestionResponse,
  MessageResponse,
  BulkNoteIdsRequest,
} from '../types';

export const notesApi = {
  // Create Note
  createNote: async (data: NoteCreate): Promise<NoteCreateResponse> => {
    const response = await apiClient.post<NoteCreateResponse>('/api/notes', data);
    return response.data;
  },

  // Upload File
  uploadFile: async (
    title: string,
    file: File,
    tags?: string[]
  ): Promise<NoteCreateResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    if (tags && tags.length > 0) {
      formData.append('tags', tags.join(','));
    }

    const response = await apiClient.post<NoteCreateResponse>('/api/notes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // List Notes
  listNotes: async (params?: {
    skip?: number;
    limit?: number;
    search?: string;
    is_pinned?: boolean;
    is_archived?: boolean;
    note_ids?: string;
    sort_by?: string;
  }): Promise<NoteListResponse> => {
    const response = await apiClient.get<NoteListResponse>('/api/notes', { params });
    return response.data;
  },

  // Get Note
  getNote: async (noteId: string): Promise<Note> => {
    const response = await apiClient.get<Note>(`/api/notes/${noteId}`);
    return response.data;
  },

  // Update Note
  updateNote: async (noteId: string, data: NoteUpdate): Promise<Note> => {
    const response = await apiClient.patch<Note>(`/api/notes/${noteId}`, data);
    return response.data;
  },

  // Delete Note
  deleteNote: async (noteId: string): Promise<MessageResponse> => {
    const response = await apiClient.delete<MessageResponse>(`/api/notes/${noteId}`);
    return response.data;
  },

  // Restore Note
  restoreNote: async (noteId: string): Promise<Note> => {
    const response = await apiClient.post<Note>(`/api/notes/${noteId}/restore`);
    return response.data;
  },

  // Pin/Unpin Note
  togglePin: async (noteId: string): Promise<Note> => {
    const response = await apiClient.post<Note>(`/api/notes/${noteId}/pin`);
    return response.data;
  },

  // Archive/Unarchive Note
  toggleArchive: async (noteId: string): Promise<Note> => {
    const response = await apiClient.post<Note>(`/api/notes/${noteId}/archive`);
    return response.data;
  },

  // Get Trash
  getTrash: async (params?: { skip?: number; limit?: number }): Promise<NoteListResponse> => {
    const response = await apiClient.get<NoteListResponse>('/api/notes/trash/list', { params });
    return response.data;
  },

  // Permanently Delete Note
  permanentlyDelete: async (noteId: string): Promise<MessageResponse> => {
    const response = await apiClient.delete<MessageResponse>(`/api/notes/${noteId}/permanent`);
    return response.data;
  },

  // Validate Note IDs
  validateNoteIds: async (data: BulkNoteIdsRequest): Promise<MessageResponse> => {
    const response = await apiClient.get<MessageResponse>('/api/notes/validate/note-ids', {
      params: { note_ids: data.note_ids },
    });
    return response.data;
  },

  // Summarize Note
  summarizeNote: async (noteId: string): Promise<{
    note_id: string;
    summary: string;
    original_length: number;
    summary_length: number;
  }> => {
    const response = await apiClient.post(`/api/notes/${noteId}/summarize`);
    return response.data;
  },

  // Suggest Tags
  suggestTags: async (noteId: string, content?: string): Promise<TagSuggestionResponse> => {
    const response = await apiClient.post<TagSuggestionResponse>(
      `/api/notes/${noteId}/suggest-tags`,
      { content }
    );
    return response.data;
  },

  // Download File
  downloadFile: async (noteId: string): Promise<Blob> => {
    const response = await apiClient.get(`/api/notes/${noteId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
