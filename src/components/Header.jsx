import React, {useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {useAuth} from '../contexts/AuthContext';

const {FiMenu, FiX, FiSettings} = FiIcons;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const {user, isAdmin} = useAuth();

  const navItems = [
    {name: 'Home', path: '/'},
    {name: 'Episodes', path: '/episodes'},
    {name: 'About', path: '/about'},
    {name: 'Subscribe', path: '/subscribe'},
    {name: 'Blog', path: '/blog'},
    {name: 'Reviews', path: '/reviews'},
    {name: 'Contact', path: '/contact'}
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1750773391143-CLR%20Logo%20Favicon.png" 
              alt="Chef Life Radio" 
              className="h-12 w-12" 
            />
            <div>
              <h1 className="text-xl font-display font-bold text-brand-red">Chef Life Radio</h1>
              <p className="text-xs text-brand-gray font-sans">Empowering Culinary Leaders</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-heading font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-brand-red border-b-2 border-brand-red pb-1'
                    : 'text-brand-black hover:text-brand-red'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Admin Link - Only show for authenticated admin users */}
            {user && isAdmin && (
              <Link
                to="/admin"
                className={`text-sm font-heading font-medium transition-colors duration-200 flex items-center space-x-1 ${
                  isActive('/admin')
                    ? 'text-brand-red border-b-2 border-brand-red pb-1'
                    : 'text-gray-500 hover:text-brand-red'
                }`}
                title="Admin Panel"
              >
                <SafeIcon icon={FiSettings} className="h-4 w-4" />
                <span className="hidden lg:inline">Admin</span>
              </Link>
            )}

            {/* Login Link - Only show when not authenticated */}
            {!user && (
              <Link
                to="/admin"
                className={`text-sm font-heading font-medium transition-colors duration-200 flex items-center space-x-1 ${
                  isActive('/admin')
                    ? 'text-brand-red border-b-2 border-brand-red pb-1'
                    : 'text-gray-500 hover:text-brand-red'
                }`}
                title="Admin Login"
              >
                <SafeIcon icon={FiSettings} className="h-4 w-4" />
                <span className="hidden lg:inline">Admin</span>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <SafeIcon icon={isMenuOpen ? FiX : FiMenu} className="h-6 w-6 text-brand-black" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            initial={{opacity: 0, height: 0}}
            animate={{opacity: 1, height: 'auto'}}
            exit={{opacity: 0, height: 0}}
            className="md:hidden py-4 border-t border-gray-100"
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block py-2 text-sm font-heading font-medium ${
                  isActive(item.path)
                    ? 'text-brand-red'
                    : 'text-brand-black hover:text-brand-red'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Admin Link - Conditional rendering */}
            {((user && isAdmin) || !user) && (
              <Link
                to="/admin"
                className={`block py-2 text-sm font-heading font-medium flex items-center space-x-2 ${
                  isActive('/admin')
                    ? 'text-brand-red'
                    : 'text-gray-500 hover:text-brand-red'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <SafeIcon icon={FiSettings} className="h-4 w-4" />
                <span>{user && isAdmin ? 'Admin Panel' : 'Admin Login'}</span>
              </Link>
            )}
          </motion.nav>
        )}
      </div>
    </header>
  );
};

export default Header;