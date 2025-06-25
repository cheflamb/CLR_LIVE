import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import wordpressIntegrations from '../services/wordpressIntegrations';

const { FiStar, FiSend, FiLoader, FiCheck, FiMessageCircle } = FiIcons;

const FeedbackWidget = ({ episodeId, episodeTitle, compact = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    feedback: '',
    email: '',
    name: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const feedbackTypes = [
    { value: 'general', label: 'General Feedback' },
    { value: 'content', label: 'Content Suggestion' },
    { value: 'guest', label: 'Guest Recommendation' },
    { value: 'technical', label: 'Technical Issue' }
  ];

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const result = await wordpressIntegrations.submitEpisodeFeedback({
        episodeId,
        episodeTitle,
        feedback: formData.feedback,
        rating: formData.rating,
        email: formData.email,
        name: formData.name,
        type: formData.type
      });

      if (result.success) {
        setSubmitStatus('success');
        setFormData({ rating: 0, feedback: '', email: '', name: '', type: 'general' });
        setTimeout(() => setIsOpen(false), 2000);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Feedback submission failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (compact) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-brand-red hover:bg-red-800 text-white px-4 py-2 rounded-lg font-heading font-medium transition-colors flex items-center space-x-2"
      >
        <SafeIcon icon={FiMessageCircle} className="h-4 w-4" />
        <span>Give Feedback</span>
      </button>
    );
  }

  return (
    <>
      {/* Feedback Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="bg-white border border-gray-200 hover:border-brand-red text-brand-black px-6 py-3 rounded-lg font-heading font-medium transition-all flex items-center space-x-2 shadow-sm hover:shadow-md"
      >
        <SafeIcon icon={FiMessageCircle} className="h-5 w-5" />
        <span>Share Your Thoughts</span>
      </motion.button>

      {/* Feedback Modal */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-heading font-bold text-brand-black">
                Share Your Feedback
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <SafeIcon icon={FiIcons.FiX} className="h-6 w-6" />
              </button>
            </div>

            {episodeTitle && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-brand-gray font-sans">Episode:</p>
                <p className="font-heading font-medium text-brand-black">{episodeTitle}</p>
              </div>
            )}

            {/* Success Message */}
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4"
              >
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="h-5 w-5 text-green-600" />
                  <p className="text-green-800 font-sans">
                    Thank you for your feedback! It helps us improve the show.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
              >
                <p className="text-red-800 font-sans">
                  There was an error submitting your feedback. Please try again.
                </p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-sm font-heading font-medium text-brand-black mb-2">
                  How would you rate this episode?
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      className={`p-1 transition-colors ${
                        star <= formData.rating
                          ? 'text-brand-gold'
                          : 'text-gray-300 hover:text-brand-gold'
                      }`}
                    >
                      <SafeIcon icon={FiStar} className="h-6 w-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Type */}
              <div>
                <label className="block text-sm font-heading font-medium text-brand-black mb-2">
                  Feedback Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent font-sans"
                >
                  {feedbackTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Feedback Text */}
              <div>
                <label className="block text-sm font-heading font-medium text-brand-black mb-2">
                  Your Feedback
                </label>
                <textarea
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Share your thoughts, suggestions, or what you loved about this episode..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent resize-none font-sans"
                  required
                />
              </div>

              {/* Optional Contact Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-heading font-medium text-brand-black mb-1">
                    Name (Optional)
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent font-sans"
                  />
                </div>
                <div>
                  <label className="block text-sm font-heading font-medium text-brand-black mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent font-sans"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.feedback}
                  className="bg-brand-red hover:bg-red-800 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-heading font-medium transition-colors flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <SafeIcon icon={FiLoader} className="h-4 w-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <SafeIcon icon={FiSend} className="h-4 w-4" />
                      <span>Send Feedback</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default FeedbackWidget;