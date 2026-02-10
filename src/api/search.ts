import apiClient from './client';
import type {
  SearchQuery,
  KeywordSearchQuery,
  SearchResponse,
  KeywordSearchResponse,
  MessageResponse,
} from '../types';

export const searchApi = {
  // Semantic Search
  semanticSearch: async (data: SearchQuery): Promise<SearchResponse> => {
    const response = await apiClient.post<SearchResponse>('/api/search/semantic', data);
    return response.data;
  },

  // Keyword Search
  keywordSearch: async (data: KeywordSearchQuery): Promise<KeywordSearchResponse> => {
    const response = await apiClient.post<KeywordSearchResponse>('/api/search/keywords', data);
    return response.data;
  },

  // Create Embeddings for Note
  createEmbeddings: async (noteId: string): Promise<{
    note_id: string;
    embeddings_created: number;
    message: string;
  }> => {
    const response = await apiClient.post(`/api/search/notes/${noteId}/embed`);
    return response.data;
  },

  // Get Embedding Stats
  getEmbeddingStats: async (noteId: string): Promise<{
    note_id: string;
    note_title: string;
    note_length: number;
    embedding_count: number;
    content_preview: string;
    is_indexed: boolean;
  }> => {
    const response = await apiClient.get(`/api/search/notes/${noteId}/embedding-stats`);
    return response.data;
  },

  // Delete Embeddings
  deleteEmbeddings: async (noteId: string): Promise<MessageResponse> => {
    const response = await apiClient.delete<MessageResponse>(
      `/api/search/notes/${noteId}/embeddings`
    );
    return response.data;
  },

  // Rebuild All Embeddings
  rebuildAllEmbeddings: async (): Promise<{
    total_notes: number;
    total_embeddings: number;
    status: string;
  }> => {
    const response = await apiClient.post('/api/search/rebuild-all');
    return response.data;
  },
};
