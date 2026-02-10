// User Types
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  status: UserStatus;
  is_email_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

// Auth Types
export interface LoginRequest {
  username: string; // email
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface RegistrationResponse {
  message: string;
  email: string;
}

// Note Types
export enum NoteSourceType {
  TEXT = 'text',
  FILE = 'file',
}

export interface Tag {
  id: string;
  name: string;
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  source_type: NoteSourceType;
  original_filename?: string;
  summary?: string;
  is_pinned: boolean;
  is_archived: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  tags: Tag[];
}

export interface NoteCreate {
  title: string;
  content: string;
  tags?: string[];
}

export interface NoteUpdate {
  title?: string;
  content?: string;
  tags?: string[];
}

export interface NoteListResponse {
  total: number;
  page: number;
  page_size: number;
  items: Note[];
}

export interface NoteCreateResponse {
  note: Note;
  suggested_tags: string[];
}

export interface TagSuggestionResponse {
  note_id: string;
  suggestions: string[];
  message: string;
}

// Q&A Types
export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export interface QAMessage {
  id: string;
  session_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
}

export interface QASession {
  id: string;
  user_id: string;
  note_ids: string[];
  title?: string;
  created_at: string;
  updated_at: string;
  messages: QAMessage[];
}

export interface QASessionCreate {
  note_ids: string[];
  title?: string;
}

export interface QAMessageCreate {
  content: string;
}

export interface QAMessageResponse {
  message_id: string;
  user_message: string;
  ai_response: string;
  source_notes: Array<{
    note_id: string;
    note_title: string;
  }>;
  created_at: string;
}

export interface QASessionListResponse {
  total: number;
  page: number;
  page_size: number;
  items: QASession[];
}

export interface QASessionUpdateRequest {
  title?: string;
  note_ids?: string[];
}

// Search Types
export interface SearchQuery {
  query: string;
  top_k?: number;
}

export interface KeywordSearchQuery {
  keywords: string;
  top_k?: number;
}

export interface SearchResult {
  embedding_id?: string;
  note_id: string;
  note_title: string;
  chunk_text: string;
  relevance_score: number;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface KeywordSearchResult {
  note_id: string;
  note_title: string;
  chunk_text: string;
  type: string;
  metadata?: Record<string, any>;
}

export interface SearchResponse {
  query: string;
  result_count: number;
  results: SearchResult[];
  search_type: string;
}

export interface KeywordSearchResponse {
  keywords: string;
  result_count: number;
  results: KeywordSearchResult[];
  search_type: string;
}

// Admin Types
export interface SystemStats {
  total_users: number;
  total_notes: number;
  active_users: number;
  notes_created_today: number;
  notes_created_this_week: number;
}

export interface UserAdminView {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  status: UserStatus;
  is_email_verified: boolean;
  created_at: string;
  last_login?: string;
  notes_count: number;
}

export interface UserListResponse {
  total: number;
  page: number;
  page_size: number;
  items: UserAdminView[];
}

export interface UpdateUserRoleRequest {
  role: UserRole;
}

export interface UpdateUserStatusRequest {
  status: UserStatus;
}

// Common Types
export interface MessageResponse {
  message: string;
}

export interface BulkNoteIdsRequest {
  note_ids: string[];
}
