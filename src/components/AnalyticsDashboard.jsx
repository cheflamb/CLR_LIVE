import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import wordpressIntegrations from '../services/wordpressIntegrations';

const { FiTrendingUp, FiTrendingDown, FiMinus, FiRefreshCw, FiDownload, FiCalendar } = FiIcons;

const AnalyticsDashboard = ({ compact = false }) => {
  const [metrics, setMetrics] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [lastUpdated, setLastUpdated] = useState(null);

  const timeframeOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ];

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedTimeframe]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [metricsResult, performanceResult] = await Promise.all([
        wordpressIntegrations.getDashboardMetrics(null, selectedTimeframe),
        wordpressIntegrations.getPerformanceMetrics()
      ]);

      if (metricsResult.success) {
        setMetrics(processMetricsData(metricsResult.metrics));
      }

      if (performanceResult.success) {
        setPerformanceMetrics(performanceResult.metrics);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processMetricsData = (rawMetrics) => {
    const categories = ['email', 'podcast', 'video', 'forms'];
    return categories.map(category => {
      const categoryMetrics = rawMetrics.filter(m => m.category === category);
      const totalValue = categoryMetrics.reduce((sum, m) => sum + parseFloat(m.metric_value), 0);
      
      return {
        category,
        label: getCategoryLabel(category),
        value: totalValue,
        metrics: categoryMetrics,
        icon: getCategoryIcon(category),
        color: getCategoryColor(category)
      };
    });
  };

  const getCategoryLabel = (category) => {
    const labels = {
      email: 'Email Marketing',
      podcast: 'Podcast',
      video: 'Video Content',
      forms: 'Form Submissions'
    };
    return labels[category] || category;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      email: FiIcons.FiMail,
      podcast: FiIcons.FiHeadphones,
      video: FiIcons.FiPlay,
      forms: FiIcons.FiFileText
    };
    return icons[category] || FiIcons.FiBarChart;
  };

  const getCategoryColor = (category) => {
    const colors = {
      email: 'bg-blue-500',
      podcast: 'bg-purple-500',
      video: 'bg-red-500',
      forms: 'bg-green-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent': return FiTrendingUp;
      case 'warning': return FiMinus;
      case 'critical': return FiTrendingDown;
      default: return FiMinus;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleRefresh = () => {
    wordpressIntegrations.syncAllMetrics().then(() => {
      fetchAnalyticsData();
    });
  };

  if (compact) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {performanceMetrics.slice(0, 4).map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow p-4 border"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-sans text-brand-gray">{metric.metric_name}</span>
              <SafeIcon 
                icon={getStatusIcon(metric.status)} 
                className={`h-4 w-4 ${getStatusColor(metric.status)}`} 
              />
            </div>
            <div className="text-2xl font-heading font-bold text-brand-black">
              {metric.current_value}
              {metric.metric_name.includes('Rate') && '%'}
            </div>
            {metric.change_percentage !== null && (
              <div className={`text-sm font-sans ${parseFloat(metric.change_percentage) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {parseFloat(metric.change_percentage) >= 0 ? '+' : ''}{parseFloat(metric.change_percentage).toFixed(1)}%
              </div>
            )}
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-heading font-bold text-brand-black">Analytics Dashboard</h2>
          <p className="text-brand-gray font-sans">
            {lastUpdated && `Last updated: ${lastUpdated.toLocaleTimeString()}`}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red font-sans"
          >
            {timeframeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-brand-red hover:bg-red-800 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-heading font-medium transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiRefreshCw} className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Category Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((category, index) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6 border"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className={`${category.color} p-2 rounded-lg`}>
                <SafeIcon icon={category.icon} className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-brand-black">{category.label}</h3>
              </div>
            </div>
            <div className="text-3xl font-heading font-bold text-brand-black mb-2">
              {category.value.toLocaleString()}
            </div>
            <div className="space-y-1">
              {category.metrics.slice(0, 2).map(metric => (
                <div key={metric.id} className="flex justify-between text-sm">
                  <span className="text-brand-gray font-sans">{metric.metric_name}</span>
                  <span className="font-medium text-brand-black">{parseFloat(metric.metric_value).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow-lg p-6 border">
        <h3 className="text-xl font-heading font-bold text-brand-black mb-6">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {performanceMetrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-gray-100 text-brand-gray px-2 py-1 rounded font-sans">
                    {metric.source_type.toUpperCase()}
                  </span>
                  <SafeIcon 
                    icon={getStatusIcon(metric.status)} 
                    className={`h-4 w-4 ${getStatusColor(metric.status)}`} 
                  />
                </div>
              </div>
              
              <h4 className="font-heading font-semibold text-brand-black mb-2">
                {metric.metric_name}
              </h4>
              
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-2xl font-heading font-bold text-brand-black">
                  {parseFloat(metric.current_value).toFixed(metric.metric_name.includes('Rate') ? 1 : 0)}
                  {metric.metric_name.includes('Rate') && '%'}
                </span>
                {metric.target_value && (
                  <span className="text-sm text-brand-gray font-sans">
                    / {parseFloat(metric.target_value).toFixed(metric.metric_name.includes('Rate') ? 1 : 0)}
                    {metric.metric_name.includes('Rate') && '%'}
                  </span>
                )}
              </div>
              
              {metric.change_percentage !== null && (
                <div className={`text-sm font-sans ${parseFloat(metric.change_percentage) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {parseFloat(metric.change_percentage) >= 0 ? '↗' : '↘'} 
                  {Math.abs(parseFloat(metric.change_percentage)).toFixed(1)}% from last period
                </div>
              )}
              
              {/* Progress bar for metrics with targets */}
              {metric.target_value && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        (parseFloat(metric.current_value) / parseFloat(metric.target_value)) >= 1 
                          ? 'bg-green-500' 
                          : (parseFloat(metric.current_value) / parseFloat(metric.target_value)) >= 0.8
                          ? 'bg-blue-500'
                          : 'bg-yellow-500'
                      }`}
                      style={{
                        width: `${Math.min((parseFloat(metric.current_value) / parseFloat(metric.target_value)) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="flex justify-end space-x-4">
        <button className="bg-gray-100 hover:bg-gray-200 text-brand-black px-4 py-2 rounded-lg font-heading font-medium transition-colors flex items-center space-x-2">
          <SafeIcon icon={FiDownload} className="h-4 w-4" />
          <span>Export Data</span>
        </button>
        <button className="bg-gray-100 hover:bg-gray-200 text-brand-black px-4 py-2 rounded-lg font-heading font-medium transition-colors flex items-center space-x-2">
          <SafeIcon icon={FiCalendar} className="h-4 w-4" />
          <span>Schedule Report</span>
        </button>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;