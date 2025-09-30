// Type definitions for API requests and responses

/**
 * Base API Response
 */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

/**
 * Error Response
 */
export interface ErrorResponse {
  detail: string;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  skip?: number;
  limit?: number;
}

/**
 * Authentication types
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Admission types
 */
export interface AdmissionData {
  student_name: string;
  email: string;
  phone: string;
  course: string;
  status: 'pending' | 'approved' | 'rejected';
  application_date: string;
  documents?: string[];
  notes?: string;
}

export interface Admission extends AdmissionData {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface AdmissionListResponse {
  items: Admission[];
  total: number;
  skip: number;
  limit: number;
}

/**
 * Attendance types
 */
export interface AttendanceData {
  student_id: string;
  student_name: string;
  course: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

export interface Attendance extends AttendanceData {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceListResponse {
  items: Attendance[];
  total: number;
  skip: number;
  limit: number;
}

export interface AttendanceQueryParams extends PaginationParams {
  date?: string;
}

/**
 * AI Service types
 */
export interface ChatMessage {
  message: string;
  context?: Record<string, unknown>;
}

export interface ChatResponse {
  response: string;
  conversation_id?: string;
  timestamp: string;
}

export interface AnalysisRequest {
  data: Record<string, unknown>;
  analysis_type?: string;
}

export interface AnalysisResponse {
  analysis: Record<string, unknown>;
  insights: string[];
  recommendations: string[];
  timestamp: string;
}

/**
 * Health check response
 */
export interface HealthResponse {
  status: 'ok' | 'error';
  timestamp: string;
  version?: string;
}