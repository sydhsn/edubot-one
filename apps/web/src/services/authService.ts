import { api, tokenStorage, LoginResponse, User } from './api';

// Auth API interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterStudentRequest {
  email: string;
  password: string;
  full_name: string;
  student_id?: string;
  grade?: string;
  section?: string;
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
      const response = await api.post<LoginResponse>('/api/v1/auth/login', credentials);
      
      // Store tokens
      tokenStorage.setToken(response.data.access_token);
      if (response.data.refresh_token) {
        tokenStorage.setRefreshToken(response.data.refresh_token);
      }
      
      return response.data;
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
      await api.post('/api/v1/auth/logout');
    } catch (error) {
      console.warn('Logout endpoint failed:', error);
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
      const response = await api.post<User>('/api/v1/auth/register/student', studentData);
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
      const response = await api.post<User>('/api/v1/auth/register/teacher', teacherData);
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
      const response = await api.get<User>('/api/v1/auth/me');
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
      const response = await api.post<{ message: string }>('/api/v1/auth/forgot-password', { email });
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
      const response = await api.post<{ message: string }>('/api/v1/auth/reset-password', resetData);
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
      const response = await api.put<{ message: string }>('/api/v1/auth/change-password', passwordData);
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
      const response = await api.get<User[]>('/api/v1/auth/users');
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
      const response = await api.get<User[]>(`/auth/users?role=${role}`);
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
    
    // Check if token is expired
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
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