import React, {useState} from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {useAuth} from '../contexts/AuthContext';

const {FiShield, FiMail, FiLock, FiLoader, FiEye, FiEyeOff, FiAlertCircle} = FiIcons;

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {signIn} = useAuth();

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('Form submitted with:', formData.email);

    const result = await signIn(formData.email, formData.password);
    
    if (!result.success) {
      setError(result.error || 'Invalid credentials');
      console.error('Login failed:', result.error);
    } else {
      console.log('Login successful, should redirect now');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 border">
          <div className="text-center mb-8">
            <div className="bg-brand-red p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SafeIcon icon={FiShield} className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-display font-bold text-brand-black">Admin Access</h2>
            <p className="text-brand-gray font-sans mt-2">Sign in to access the admin dashboard</p>
          </div>

          {/* Demo Credentials Helper */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-2">
              <SafeIcon icon={FiAlertCircle} className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-blue-800 text-sm font-sans font-medium mb-1">Demo Credentials:</p>
                <p className="text-blue-700 text-xs font-sans">Email: adam@chefliferadio.com</p>
                <p className="text-blue-700 text-xs font-sans">Password: ChefLife2024!</p>
              </div>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
            >
              <p className="text-red-800 text-sm font-sans">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-heading font-medium text-brand-black mb-2">
                Email Address
              </label>
              <div className="relative">
                <SafeIcon icon={FiMail} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-gray h-5 w-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent font-sans"
                  placeholder="adam@chefliferadio.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-heading font-medium text-brand-black mb-2">
                Password
              </label>
              <div className="relative">
                <SafeIcon icon={FiLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-gray h-5 w-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent font-sans"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-gray hover:text-brand-black"
                >
                  <SafeIcon icon={showPassword ? FiEyeOff : FiEye} className="h-5 w-5" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-red hover:bg-red-800 disabled:bg-gray-400 text-white py-3 rounded-lg font-heading font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <SafeIcon icon={FiLoader} className="h-5 w-5 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-brand-gray font-sans">
              Authorized personnel only. All access attempts are logged.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;