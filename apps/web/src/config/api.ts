// API Configuration for Edubot Web Application

/**
 * Get the API base URL based on environment
 */
const getApiUrl = (): string => {
  // Check if we're on server side (SSR)
  if (typeof window === 'undefined') {
    return process.env.VITE_API_URL || 'http://localhost:8000';
  }
  
  // Client-side configuration
  if (process.env.NODE_ENV === 'production') {
    // Production API URL - update this with your Render service URL
    return process.env.VITE_API_URL || 'https://your-api-service.onrender.com';
  }
  
  // Development API URL
  return process.env.VITE_API_URL || 'http://localhost:8000';
};

export const API_BASE_URL = getApiUrl();

/**
 * API endpoint constants
 */
export const API_ENDPOINTS = {
  // Health check
  HEALTH: '/health',
  
  // Authentication endpoints
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    LOGOUT: '/api/v1/auth/logout',
    REGISTER: '/api/v1/auth/register',
    REFRESH: '/api/v1/auth/refresh',
    ME: '/api/v1/auth/me',
  },
  
  // Admissions endpoints
  ADMISSIONS: {
    BASE: '/api/v1/admissions',
    LIST: '/api/v1/admissions',
    CREATE: '/api/v1/admissions',
    GET: (id: string) => `/api/v1/admissions/${id}`,
    UPDATE: (id: string) => `/api/v1/admissions/${id}`,
    DELETE: (id: string) => `/api/v1/admissions/${id}`,
  },
  
  // AI services endpoints
  AI: {
    BASE: '/api/v1/ai',
    CHAT: '/api/v1/ai/chat',
    ANALYZE: '/api/v1/ai/analyze',
  },
  
  // Attendance endpoints
  ATTENDANCE: {
    BASE: '/api/v1/attendance',
    LIST: '/api/v1/attendance',
    CREATE: '/api/v1/attendance',
    GET: (id: string) => `/api/v1/attendance/${id}`,
    UPDATE: (id: string) => `/api/v1/attendance/${id}`,
  },
} as const;

/**
 * Request timeout configuration
 */
export const REQUEST_TIMEOUT = 30000; // 30 seconds

/**
 * Default headers for API requests
 */
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
} as const;

/**
 * API configuration object
 */
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: DEFAULT_HEADERS,
} as const;