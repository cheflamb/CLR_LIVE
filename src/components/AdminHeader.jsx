import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';

const { FiShield, FiLogOut, FiUser } = FiIcons;

const AdminHeader = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      console.log('🔄 Sign out button clicked');
      const result = await signOut();
      
      if (result.success) {
        console.log('✅ Sign out successful, should redirect');
        // Force a page reload to ensure clean state
        window.location.reload();
      } else {
        console.error('❌ Sign out failed:', result.error);
        alert('Error signing out. Please try again.');
      }
    } catch (error) {
      console.error('❌ Unexpected error during sign out:', error);
      // Force sign out even if there's an error
      window.location.reload();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200 px-6 py-4 mb-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiShield} className="h-8 w-8 text-brand-red" />
          <div>
            <h1 className="text-2xl font-display font-bold text-brand-black">Admin Dashboard</h1>
            <p className="text-sm text-brand-gray font-sans">Chef Life Radio Content Management</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-brand-gray">
            <SafeIcon icon={FiUser} className="h-4 w-4" />
            <span className="font-sans">{user?.email}</span>
          </div>
          
          <button
            onClick={handleSignOut}
            className="bg-gray-100 hover:bg-gray-200 text-brand-black px-4 py-2 rounded-lg font-heading font-medium transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiLogOut} className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminHeader;