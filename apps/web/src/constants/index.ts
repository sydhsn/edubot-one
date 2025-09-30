// Application constants and configuration

/**
 * Application metadata
 */
export const APP_CONFIG = {
  name: 'EduBot One',
  version: '1.0.0',
  description: 'Educational Management System with AI Integration',
  author: 'EduBot Team',
} as const;

/**
 * Route paths
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ADMISSIONS: '/admissions',
  ATTENDANCE: '/attendance',
  AI_CHAT: '/chat',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  HELP: '/help',
} as const;

/**
 * API response status
 */
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  LOADING: 'loading',
  IDLE: 'idle',
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'edubot_auth_token',
  USER_PREFERENCES: 'edubot_user_preferences',
  THEME: 'edubot_theme',
  LANGUAGE: 'edubot_language',
} as const;

/**
 * Theme options
 */
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

/**
 * Admission status options
 */
export const ADMISSION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  WAITLISTED: 'waitlisted',
} as const;

export const ADMISSION_STATUS_LABELS = {
  [ADMISSION_STATUS.PENDING]: 'Pending Review',
  [ADMISSION_STATUS.APPROVED]: 'Approved',
  [ADMISSION_STATUS.REJECTED]: 'Rejected',
  [ADMISSION_STATUS.WAITLISTED]: 'Waitlisted',
} as const;

export const ADMISSION_STATUS_COLORS = {
  [ADMISSION_STATUS.PENDING]: 'yellow',
  [ADMISSION_STATUS.APPROVED]: 'green',
  [ADMISSION_STATUS.REJECTED]: 'red',
  [ADMISSION_STATUS.WAITLISTED]: 'blue',
} as const;

/**
 * Attendance status options
 */
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused',
} as const;

export const ATTENDANCE_STATUS_LABELS = {
  [ATTENDANCE_STATUS.PRESENT]: 'Present',
  [ATTENDANCE_STATUS.ABSENT]: 'Absent',
  [ATTENDANCE_STATUS.LATE]: 'Late',
  [ATTENDANCE_STATUS.EXCUSED]: 'Excused',
} as const;

export const ATTENDANCE_STATUS_COLORS = {
  [ATTENDANCE_STATUS.PRESENT]: 'green',
  [ATTENDANCE_STATUS.ABSENT]: 'red',
  [ATTENDANCE_STATUS.LATE]: 'yellow',
  [ATTENDANCE_STATUS.EXCUSED]: 'blue',
} as const;

/**
 * Course categories
 */
export const COURSE_CATEGORIES = {
  TECHNOLOGY: 'technology',
  BUSINESS: 'business',
  DESIGN: 'design',
  MARKETING: 'marketing',
  LANGUAGE: 'language',
  OTHER: 'other',
} as const;

export const COURSE_CATEGORY_LABELS = {
  [COURSE_CATEGORIES.TECHNOLOGY]: 'Technology',
  [COURSE_CATEGORIES.BUSINESS]: 'Business',
  [COURSE_CATEGORIES.DESIGN]: 'Design',
  [COURSE_CATEGORIES.MARKETING]: 'Marketing',
  [COURSE_CATEGORIES.LANGUAGE]: 'Language',
  [COURSE_CATEGORIES.OTHER]: 'Other',
} as const;

/**
 * User roles
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  INSTRUCTOR: 'instructor',
  STUDENT: 'student',
  STAFF: 'staff',
} as const;

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrator',
  [USER_ROLES.INSTRUCTOR]: 'Instructor',
  [USER_ROLES.STUDENT]: 'Student',
  [USER_ROLES.STAFF]: 'Staff',
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

/**
 * Date formats
 */
export const DATE_FORMATS = {
  SHORT: 'MM/DD/YYYY',
  LONG: 'MMMM DD, YYYY',
  ISO: 'YYYY-MM-DD',
  TIME: 'HH:mm',
  DATETIME: 'MM/DD/YYYY HH:mm',
  FULL: 'dddd, MMMM DD, YYYY [at] HH:mm',
} as const;

/**
 * File upload constraints
 */
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx'],
} as const;

/**
 * Validation rules
 */
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s-()]+$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
  NAME_TOO_SHORT: `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`,
  NAME_TOO_LONG: `Name must be less than ${VALIDATION.NAME_MAX_LENGTH} characters`,
  FILE_TOO_LARGE: `File size must be less than ${FILE_UPLOAD.MAX_SIZE / 1024 / 1024}MB`,
  INVALID_FILE_TYPE: 'Invalid file type',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  SERVER_ERROR: 'Server error. Please try again later.',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  REGISTER_SUCCESS: 'Registration successful',
  PROFILE_UPDATED: 'Profile updated successfully',
  ADMISSION_CREATED: 'Admission application submitted successfully',
  ADMISSION_UPDATED: 'Admission updated successfully',
  ADMISSION_DELETED: 'Admission deleted successfully',
  ATTENDANCE_MARKED: 'Attendance marked successfully',
  ATTENDANCE_UPDATED: 'Attendance updated successfully',
  FILE_UPLOADED: 'File uploaded successfully',
} as const;

/**
 * Animation durations (in milliseconds)
 */
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

/**
 * Breakpoints for responsive design
 */
export const BREAKPOINTS = {
  XS: 320,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
} as const;

/**
 * Z-index layers
 */
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
} as const;