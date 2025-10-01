import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, useRole } from '../contexts/AuthContext';

// Loading component
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

// Protected route props
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'teacher' | 'student';
  allowedRoles?: ('admin' | 'teacher' | 'student')[];
}

// Protected route component
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  allowedRoles,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { role } = useRole();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role as 'admin' | 'teacher' | 'student')) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children as React.ReactElement;
};

// Admin only route
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>
);

// Teacher route (admin and teacher can access)
export const TeacherRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin', 'teacher']}>{children}</ProtectedRoute>
);

// Student route (all authenticated users can access)
export const StudentRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>{children}</ProtectedRoute>
);

// Public route (redirect to dashboard if already authenticated)
export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { role } = useRole();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    // Redirect to appropriate dashboard based on role
    const dashboardPath = role === 'admin' ? '/admin' : role === 'teacher' ? '/teacher' : '/student';
    return <Navigate to={dashboardPath} replace />;
  }

  return children as React.ReactElement;
};

export default ProtectedRoute;