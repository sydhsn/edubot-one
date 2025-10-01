import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useRole } from '../contexts/AuthContext';

export const Unauthorized: React.FC = () => {
  const { user, logout } = useAuth();
  const { role } = useRole();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <svg
            className="mx-auto h-24 w-24 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            You don't have permission to access this page.
          </p>
          {user && (
            <p className="mt-1 text-center text-xs text-gray-500">
              Current role: <span className="font-medium">{role}</span>
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-center space-x-4">
            {role === 'admin' && (
              <Link
                to="/admin"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Go to Admin Dashboard
              </Link>
            )}
            {role === 'teacher' && (
              <Link
                to="/teacher"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Go to Teacher Dashboard
              </Link>
            )}
            {role === 'student' && (
              <Link
                to="/student"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Go to Student Dashboard
              </Link>
            )}
          </div>

          <div className="text-center">
            <button
              onClick={logout}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Logout and try different account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;