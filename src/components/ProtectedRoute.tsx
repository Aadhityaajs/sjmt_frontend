import type { ReactNode } from 'react';
import { Navigate } from '@tanstack/react-router';
import { useAuth } from '../contexts/AuthContext';
import type { StaffRole, StaffPrivilege } from '../services/api';

interface ProtectedRouteProps {
  children: ReactNode;
  requireRole?: StaffRole;
  requirePrivilege?: StaffPrivilege;
}

export const ProtectedRoute = ({ children, requireRole, requirePrivilege }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user, hasRole, hasPrivilege } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  if (requireRole && !hasRole(requireRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (requirePrivilege && !hasPrivilege(requirePrivilege)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Insufficient Privileges</h1>
          <p className="text-gray-600 dark:text-gray-400">You don't have the required privileges for this action.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
