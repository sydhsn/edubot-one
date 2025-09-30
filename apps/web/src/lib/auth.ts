// Authentication utilities and token management
import type { AuthResponse, UserProfile } from '../types/api';

/**
 * Local storage keys
 */
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'edubot_access_token',
  REFRESH_TOKEN: 'edubot_refresh_token',
  USER_PROFILE: 'edubot_user_profile',
  TOKEN_EXPIRY: 'edubot_token_expiry',
} as const;

/**
 * Token storage utility
 */
export class TokenStorage {
  static setTokens(authResponse: AuthResponse): void {
    const { access_token, expires_in, user } = authResponse;
    const expiryTime = Date.now() + expires_in * 1000;

    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
    localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString());
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  static getUserProfile(): UserProfile | null {
    const profileData = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return profileData ? JSON.parse(profileData) : null;
  }

  static getTokenExpiry(): number | null {
    const expiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
    return expiry ? parseInt(expiry, 10) : null;
  }

  static isTokenExpired(): boolean {
    const expiry = this.getTokenExpiry();
    return expiry ? Date.now() >= expiry : true;
  }

  static clearTokens(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
  }

  static hasValidToken(): boolean {
    return !!(this.getAccessToken() && !this.isTokenExpired());
  }
}

/**
 * Authentication service
 */
export class AuthService {
  private static instance: AuthService;
  private listeners: Array<(isAuthenticated: boolean) => void> = [];

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return TokenStorage.hasValidToken();
  }

  /**
   * Get current user profile
   */
  getCurrentUser(): UserProfile | null {
    return TokenStorage.getUserProfile();
  }

  /**
   * Store authentication data
   */
  setAuthData(authResponse: AuthResponse): void {
    TokenStorage.setTokens(authResponse);
    this.notifyListeners(true);
  }

  /**
   * Clear authentication data
   */
  logout(): void {
    TokenStorage.clearTokens();
    this.notifyListeners(false);
  }

  /**
   * Get authorization header
   */
  getAuthHeader(): Record<string, string> {
    const token = TokenStorage.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Add authentication state change listener
   */
  addListener(callback: (isAuthenticated: boolean) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  /**
   * Notify all listeners of authentication state change
   */
  private notifyListeners(isAuthenticated: boolean): void {
    this.listeners.forEach(listener => listener(isAuthenticated));
  }
}

/**
 * Auth-aware fetch wrapper
 */
export const authFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const authService = AuthService.getInstance();
  
  // Add authorization header if user is authenticated
  if (authService.isAuthenticated()) {
    const authHeaders = authService.getAuthHeader();
    options.headers = {
      ...options.headers,
      ...authHeaders,
    };
  }

  const response = await fetch(url, options);

  // Handle 401 Unauthorized - clear tokens and redirect to login
  if (response.status === 401) {
    authService.logout();
    // You can dispatch a custom event or redirect to login page here
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
  }

  return response;
};

/**
 * React hook for authentication state (if using React)
 */
export const useAuth = () => {
  const authService = AuthService.getInstance();
  
  return {
    isAuthenticated: authService.isAuthenticated(),
    user: authService.getCurrentUser(),
    logout: () => authService.logout(),
    getAuthHeader: () => authService.getAuthHeader(),
  };
};

/**
 * Utility to create authenticated API request config
 */
export const createAuthConfig = (config: RequestInit = {}): RequestInit => {
  const authService = AuthService.getInstance();
  
  return {
    ...config,
    headers: {
      ...config.headers,
      ...authService.getAuthHeader(),
    },
  };
};

/**
 * Default auth service instance
 */
export const authService = AuthService.getInstance();