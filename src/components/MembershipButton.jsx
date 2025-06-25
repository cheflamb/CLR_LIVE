import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import crmService from '../services/crmService';

const { FiArrowRight, FiStar, FiZap } = FiIcons;

const MembershipButton = ({ 
  variant = 'primary', 
  size = 'lg', 
  source = 'join_movement',
  children,
  className = ''
}) => {
  const handleMembershipClick = () => {
    // Track the click and redirect to membership site
    crmService.redirectToMembership(source);
  };

  const baseStyles = "font-heading font-semibold transition-all duration-300 flex items-center justify-center space-x-2 rounded-lg";
  
  const variants = {
    primary: "bg-brand-red hover:bg-red-800 text-white shadow-lg hover:shadow-xl",
    gold: "bg-brand-gold hover:bg-yellow-600 text-brand-black shadow-lg hover:shadow-xl", 
    outline: "border-2 border-brand-red hover:bg-brand-red hover:text-white text-brand-red",
    ghost: "text-brand-red hover:bg-red-50"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base", 
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleMembershipClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {variant === 'gold' && <SafeIcon icon={FiStar} className="h-5 w-5" />}
      {variant === 'primary' && <SafeIcon icon={FiZap} className="h-5 w-5" />}
      <span>{children || 'Join the Movement'}</span>
      <SafeIcon icon={FiArrowRight} className="h-5 w-5" />
    </motion.button>
  );
};

export default MembershipButton;