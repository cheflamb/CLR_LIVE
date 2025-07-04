import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlay, FiArrowRight } = FiIcons;

const GetStartedButton = ({ onClick, variant = 'primary', size = 'md', className = '' }) => {
  const baseStyles = "font-heading font-semibold transition-all duration-300 flex items-center justify-center space-x-2 rounded-lg";
  
  const variants = {
    primary: "bg-brand-red hover:bg-red-800 text-white shadow-lg hover:shadow-xl",
    secondary: "border-2 border-brand-red hover:bg-brand-red hover:text-white text-brand-red",
    ghost: "text-brand-red hover:bg-red-50"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      <SafeIcon icon={FiPlay} className="h-5 w-5" />
      <span>Get Started</span>
      <SafeIcon icon={FiArrowRight} className="h-5 w-5" />
    </motion.button>
  );
};

export default GetStartedButton;