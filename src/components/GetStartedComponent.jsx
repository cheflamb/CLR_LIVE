import React, { useState } from 'react';
import { GetStarted } from '@questlabs/react-sdk';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import questConfig from '../config/questConfig';

const { FiX, FiPlay, FiBookOpen } = FiIcons;

const GetStartedComponent = ({ isOpen, onClose }) => {
  const [userId] = useState(() => {
    // Try to get existing user ID from localStorage, fallback to config
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      return storedUserId;
    }
    
    // Generate a unique user ID for this session
    const newUserId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('userId', newUserId);
    return newUserId;
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative"
        >
          {/* Header */}
          <div className="bg-brand-red text-white p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-full">
                <SafeIcon icon={FiPlay} className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold">Get Started with Chef Life Radio</h2>
                <p className="text-sm opacity-90">Your journey to better kitchen leadership begins here</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
            >
              <SafeIcon icon={FiX} className="h-6 w-6" />
            </button>
          </div>

          {/* Quest GetStarted Component */}
          <div className="p-6">
            <GetStarted
              questId={questConfig.GET_STARTED_QUESTID}
              uniqueUserId={userId}
              accent={questConfig.PRIMARY_COLOR}
              autoHide={false}
            >
              <GetStarted.Header />
              <GetStarted.Progress />
              <GetStarted.Content />
              <GetStarted.Footer />
            </GetStarted>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GetStartedComponent;