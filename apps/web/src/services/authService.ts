import { api, tokenStorage, LoginResponse, User } from './api';

// Raw API response interface (what the API actually returns)
interface RawLoginResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  user_role: string;
  user_info: {
    id: string;
    email: string;
    role: 'admin' | 'teacher' | 'student';
    full_name?: string;
    is_active?: boolean;
    mobile?: string;
    employee_id?: string;
  };
}

// Auth API interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterStudentRequest {
  student_name: string;
  email: string;
  password: string;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  class_name: string;
  previous_school?: string;
  address: string;
  date_of_birth: string;
  admission_number?: string;
}

export interface RegisterTeacherRequest {
  email: string;
  password: string;
  full_name: string;
  employee_id?: string;
  department?: string;
  subject?: string;
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

// Error type for API responses
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

// Authentication Service
export class AuthService {
  /**
   * Login user
   */
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post('/api/auth/login', credentials);
      
      // Handle simple API response format
      if (response.data.user && response.data.token) {
        // Simple API format: { user: {...}, token: "..." }
        const simpleResponse = response.data;
        
        // Store token
        tokenStorage.setToken(simpleResponse.token);
        
        // Transform to expected format
        const transformedResponse: LoginResponse = {
          access_token: simpleResponse.token,
          refresh_token: undefined,
          token_type: 'Bearer',
          user_role: simpleResponse.user.role,
          user_info: {
            id: simpleResponse.user.id,
            email: simpleResponse.user.email,
            role: simpleResponse.user.role,
            full_name: simpleResponse.user.name || '',
            is_active: true,
          },
          user: {
            id: simpleResponse.user.id,
            email: simpleResponse.user.email,
            role: simpleResponse.user.role,
            full_name: simpleResponse.user.name || '',
            is_active: true,
          }
        };
        
        return transformedResponse;
      } else {
        // Original API format: { access_token: "...", user_info: {...} }
        const originalResponse = response.data as RawLoginResponse;
        
        // Store tokens
        tokenStorage.setToken(originalResponse.access_token);
        if (originalResponse.refresh_token) {
          tokenStorage.setRefreshToken(originalResponse.refresh_token);
        }
        
        // Transform the response to match our expected format
        const transformedResponse: LoginResponse = {
          access_token: originalResponse.access_token,
          refresh_token: originalResponse.refresh_token,
          token_type: originalResponse.token_type,
          user_role: originalResponse.user_role,
          user_info: originalResponse.user_info,
          user: {
            id: originalResponse.user_info.id,
            email: originalResponse.user_info.email,
            role: originalResponse.user_info.role,
            full_name: originalResponse.user_info.full_name || '',
            is_active: originalResponse.user_info.is_active ?? true,
          }
        };
        
        return transformedResponse;
      }
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.message || 'Login failed');
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      // Call logout endpoint if available
      await api.post('/api/auth/logout');
    } catch {
      // Silent fail for logout endpoint
    } finally {
      // Always clear tokens
      tokenStorage.clearAll();
    }
  }

  /**
   * Register a new student (Admin only)
   */
  static async registerStudent(studentData: RegisterStudentRequest): Promise<User> {
    try {
      const response = await api.post<User>('/api/auth/register/student', studentData);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.message || 'Student registration failed');
    }
  }

  /**
   * Register a new teacher (Admin only)
   */
  static async registerTeacher(teacherData: RegisterTeacherRequest): Promise<User> {
    try {
      const response = await api.post<User>('/api/auth/register/teacher', teacherData);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.message || 'Teacher registration failed');
    }
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<User>('/api/auth/me');
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.message || 'Failed to get user profile');
    }
  }

  /**
   * Forgot password - send reset email
   */
  static async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.message || 'Failed to send reset email');
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(resetData: ResetPasswordRequest): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>('/api/auth/reset-password', resetData);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.message || 'Password reset failed');
    }
  }

  /**
   * Change password (authenticated user)
   */
  static async changePassword(passwordData: ChangePasswordRequest): Promise<{ message: string }> {
    try {
      const response = await api.put<{ message: string }>('/api/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.message || 'Password change failed');
    }
  }

  /**
   * Get all users (Admin only)
   */
  static async getAllUsers(): Promise<User[]> {
    try {
      const response = await api.get<User[]>('/api/auth/users');
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.message || 'Failed to get users');
    }
  }

  /**
   * Get users by role (Admin only)
   */
  static async getUsersByRole(role: 'admin' | 'teacher' | 'student'): Promise<User[]> {
    try {
      const response = await api.get<User[]>(`/api/auth/users/by-role?role=${role}`);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.message || `Failed to get ${role}s`);
    }
  }

  /**
   * Update user status (Admin only)
   */
  static async updateUserStatus(userId: string, isActive: boolean): Promise<User> {
    try {
      const response = await api.put<User>(`/auth/users/${userId}/status`, { is_active: isActive });
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.message || 'Failed to update user status');
    }
  }

  /**
   * Delete user (Admin only)
   */
  static async deleteUser(userId: string): Promise<{ message: string }> {
    try {
      const response = await api.delete<{ message: string }>(`/auth/users/${userId}`);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.message || 'Failed to delete user');
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = tokenStorage.getToken();
    if (!token) return false;
    
    // For simple tokens (like dummy_token_for_X), just check if token exists
    if (token.startsWith('dummy_token_for_')) {
      return true;
    }
    
    // Check if token is expired (for JWT tokens)
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      // If token parsing fails, but token exists, assume it's valid
      // This handles non-JWT tokens
      return true;
    }
  }

  /**
   * Get user role from token
   */
  static getUserRole(): string | null {
    const token = tokenStorage.getToken();
    if (!token) return null;
    
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.role || null;
    } catch {
      return null;
    }
  }

  /**
   * Get user email from token
   */
  static getUserEmail(): string | null {
    const token = tokenStorage.getToken();
    if (!token) return null;
    
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.sub || decoded.email || null;
    } catch {
      return null;
    }
  }
}

export default AuthService;