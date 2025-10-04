// API Client for Edubot Web Application
import { API_BASE_URL, API_ENDPOINTS, REQUEST_TIMEOUT } from '../config/api';
import { AuthService } from './auth';
import type {
  ErrorResponse,
  PaginationParams,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  UserProfile,
  AdmissionData,
  Admission,
  AdmissionListResponse,
  AttendanceData,
  Attendance,
  AttendanceListResponse,
  AttendanceQueryParams,
  ChatResponse,
  AnalysisResponse,
  HealthResponse,
} from '../types/api';

/**
 * API Request configuration
 */
interface ApiRequestConfig extends RequestInit {
  timeout?: number;
}

/**
 * API Error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: ErrorResponse | Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * API Client class
 */
class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;
  private authService: AuthService;

  constructor(baseURL: string = API_BASE_URL, timeout: number = REQUEST_TIMEOUT) {
    this.baseURL = baseURL.replace(/\/$/, ''); // Remove trailing slash
    this.defaultTimeout = timeout;
    this.authService = AuthService.getInstance();
  }

  /**
   * Make an HTTP request with timeout and error handling
   */
  private async request<T = unknown>(
    endpoint: string,
    config: ApiRequestConfig = {}
  ): Promise<T> {
    const {
      timeout = this.defaultTimeout,
      headers = {},
      ...restConfig
    } = config;

    const url = `${this.baseURL}${endpoint}`;
    
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...this.authService.getAuthHeader(),
          ...headers,
        },
        signal: controller.signal,
        ...restConfig,
      });

      clearTimeout(timeoutId);

      // Handle 401 Unauthorized - clear tokens
      if (response.status === 401) {
        this.authService.logout();
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }

      // Handle non-2xx responses
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errorData: ErrorResponse | Record<string, unknown> | null = null;

        try {
          errorData = await response.json();
          if (errorData && typeof errorData === 'object' && 'detail' in errorData) {
            errorMessage = (errorData as ErrorResponse).detail || errorMessage;
          } else if (errorData && typeof errorData === 'object' && 'message' in errorData) {
            errorMessage = (errorData as { message: string }).message || errorMessage;
          }
        } catch {
          // If response is not JSON, use status text
        }

        throw new ApiError(errorMessage, response.status, errorData);
      }

      // Handle empty responses (204 No Content)
      if (response.status === 204) {
        return {} as T;
      }

      // Try to parse JSON response
      try {
        return await response.json();
      } catch {
        // If response is not JSON, return as text
        return (await response.text()) as unknown as T;
      }
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError('Request timeout', 408);
        }
        throw new ApiError(error.message, 0);
      }

      throw new ApiError('Unknown error occurred', 0);
    }
  }

  /**
   * GET request
   */
  async get<T = unknown>(endpoint: string, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T = unknown>(
    endpoint: string,
    data?: Record<string, unknown> | LoginCredentials | RegisterData | AdmissionData | AttendanceData,
    config?: ApiRequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T = unknown>(
    endpoint: string,
    data?: Record<string, unknown> | Partial<AdmissionData> | Partial<AttendanceData>,
    config?: ApiRequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(endpoint: string, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * PATCH request
   */
  async patch<T = unknown>(
    endpoint: string,
    data?: Record<string, unknown> | Partial<AdmissionData> | Partial<AttendanceData>,
    config?: ApiRequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // ===================
  // Health Check
  // ===================

  /**
   * Check API health status
   */
  async checkHealth(): Promise<HealthResponse> {
    return this.get<HealthResponse>(API_ENDPOINTS.HEALTH);
  }

  // ===================
  // Authentication
  // ===================

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
  }

  /**
   * Register new user
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    return this.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    return this.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<UserProfile> {
    return this.get<UserProfile>(API_ENDPOINTS.AUTH.ME);
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<AuthResponse> {
    return this.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH);
  }

  // ===================
  // Admissions
  // ===================

  /**
   * Get all admissions
   */
  async getAdmissions(params?: PaginationParams): Promise<AdmissionListResponse> {
    const queryParams = params ? new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      )
    ).toString() : '';
    const endpoint = queryParams ? `${API_ENDPOINTS.ADMISSIONS.LIST}?${queryParams}` : API_ENDPOINTS.ADMISSIONS.LIST;
    return this.get<AdmissionListResponse>(endpoint);
  }

  /**
   * Get admission by ID
   */
  async getAdmission(id: string): Promise<Admission> {
    return this.get<Admission>(API_ENDPOINTS.ADMISSIONS.GET(id));
  }

  /**
   * Create new admission
   */
  async createAdmission(admissionData: AdmissionData): Promise<Admission> {
    return this.post<Admission>(API_ENDPOINTS.ADMISSIONS.CREATE, admissionData);
  }

  /**
   * Update admission
   */
  async updateAdmission(id: string, admissionData: Partial<AdmissionData>): Promise<Admission> {
    return this.put<Admission>(API_ENDPOINTS.ADMISSIONS.UPDATE(id), admissionData);
  }

  /**
   * Delete admission
   */
  async deleteAdmission(id: string): Promise<void> {
    return this.delete<void>(API_ENDPOINTS.ADMISSIONS.DELETE(id));
  }

  // ===================
  // AI Services
  // ===================

  /**
   * Send chat message to AI
   */
  async sendChatMessage(message: string, context?: Record<string, unknown>): Promise<ChatResponse> {
    return this.post<ChatResponse>(API_ENDPOINTS.AI.CHAT, { message, context });
  }

  /**
   * Analyze data with AI
   */
  async analyzeData(data: Record<string, unknown>, analysisType?: string): Promise<AnalysisResponse> {
    return this.post<AnalysisResponse>(API_ENDPOINTS.AI.ANALYZE, { data, analysis_type: analysisType });
  }

  // ===================
  // Attendance
  // ===================

  /**
   * Get all attendance records
   */
  async getAttendance(params?: AttendanceQueryParams): Promise<AttendanceListResponse> {
    const queryParams = params ? new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      )
    ).toString() : '';
    const endpoint = queryParams ? `${API_ENDPOINTS.ATTENDANCE.LIST}?${queryParams}` : API_ENDPOINTS.ATTENDANCE.LIST;
    return this.get<AttendanceListResponse>(endpoint);
  }

  /**
   * Get attendance by ID
   */
  async getAttendanceById(id: string): Promise<Attendance> {
    return this.get<Attendance>(API_ENDPOINTS.ATTENDANCE.GET(id));
  }

  /**
   * Create attendance record
   */
  async createAttendance(attendanceData: AttendanceData): Promise<Attendance> {
    return this.post<Attendance>(API_ENDPOINTS.ATTENDANCE.CREATE, attendanceData);
  }

  /**
   * Update attendance record
   */
  async updateAttendance(id: string, attendanceData: Partial<AttendanceData>): Promise<Attendance> {
    return this.put<Attendance>(API_ENDPOINTS.ATTENDANCE.UPDATE(id), attendanceData);
  }
}

/**
 * Default API client instance
 */
export const apiClient = new ApiClient();

/**
 * Create a new API client with custom configuration
 */
export const createApiClient = (config?: {
  baseURL?: string;
  timeout?: number;
}) => {
  return new ApiClient(config?.baseURL, config?.timeout);
};

export default apiClient;