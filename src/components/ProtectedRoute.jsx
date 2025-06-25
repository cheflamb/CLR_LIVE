import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminLogin from './AdminLogin';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiLoader } = FiIcons;

const ProtectedRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 flex items-center justify-center">
        <div className="text-center">
          <SafeIcon icon={FiLoader} className="h-12 w-12 mx-auto text-brand-red animate-spin mb-4" />
          <p className="text-brand-gray font-sans">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Show login form if user is not authenticated or not admin
  if (!user || !isAdmin) {
    console.log('🔐 Access denied - User:', !!user, 'Admin:', isAdmin);
    return <AdminLogin />;
  }

  // User is authenticated and is admin, show protected content
  console.log('✅ Access granted - showing admin panel');
  return children;
};

export default ProtectedRoute;