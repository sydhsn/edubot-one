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
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    ME: '/api/auth/me',
  },
  
  // Admissions endpoints
  ADMISSIONS: {
    BASE: '/api/admissions',
    LIST: '/api/admissions',
    CREATE: '/api/admissions',
    GET: (id: string) => `/api/admissions/${id}`,
    UPDATE: (id: string) => `/api/admissions/${id}`,
    DELETE: (id: string) => `/api/admissions/${id}`,
  },
  
  // AI services endpoints
  AI: {
    BASE: '/api/ai',
    CHAT: '/api/ai/chat',
    ANALYZE: '/api/ai/analyze',
  },
  
  // Attendance endpoints
  ATTENDANCE: {
    BASE: '/api/attendance',
    LIST: '/api/attendance',
    CREATE: '/api/attendance',
    GET: (id: string) => `/api/attendance/${id}`,
    UPDATE: (id: string) => `/api/attendance/${id}`,
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