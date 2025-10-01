import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = 'http://localhost:8000';
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Token utilities
export const tokenStorage = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  removeToken: (): void => localStorage.removeItem(TOKEN_KEY),
  
  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string): void => localStorage.setItem(REFRESH_TOKEN_KEY, token),
  removeRefreshToken: (): void => localStorage.removeItem(REFRESH_TOKEN_KEY),
  
  clearAll: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

// JWT token decoder (simple implementation)
const decodeToken = (token: string) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Check if token is expired
const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

// Create axios instance
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add token
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = tokenStorage.getToken();
      
      if (token && !isTokenExpired(token)) {
        config.headers.Authorization = `Bearer ${token}`;
      } else if (token && isTokenExpired(token)) {
        // Token is expired, clear it
        tokenStorage.clearAll();
        // Redirect to login if not already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle token expiry
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Handle 401 unauthorized errors
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = tokenStorage.getRefreshToken();
        
        if (refreshToken && !isTokenExpired(refreshToken)) {
          try {
            // Try to refresh the token
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refresh_token: refreshToken
            });
            
            const { access_token, refresh_token: newRefreshToken } = response.data;
            
            // Update tokens
            tokenStorage.setToken(access_token);
            if (newRefreshToken) {
              tokenStorage.setRefreshToken(newRefreshToken);
            }
            
            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return instance(originalRequest);
            
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect to login
            tokenStorage.clearAll();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        } else {
          // No valid refresh token, clear all and redirect
          tokenStorage.clearAll();
          window.location.href = '/login';
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Create the main API instance
export const api = createAxiosInstance();

// API response types
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    role: 'admin' | 'teacher' | 'student';
    full_name?: string;
    is_active: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  full_name?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Export default instance
export default api;