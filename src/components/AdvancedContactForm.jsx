import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import wordpressIntegrations from '../services/wordpressIntegrations';

const { FiSend, FiLoader, FiCheck, FiAlertCircle, FiUpload } = FiIcons;

const AdvancedContactForm = ({ formType = 'contact', title, description }) => {
  const [formData, setFormData] = useState({
    formType,
    name: '',
    email: '',
    company: '',
    role: '',
    phone: '',
    subject: '',
    message: '',
    priority: 'normal',
    preferredContact: 'email',
    budget: '',
    timeline: '',
    referralSource: '',
    file: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const formTypes = {
    contact: {
      title: 'Get In Touch',
      description: 'Send us a message and we\'ll get back to you within 24 hours.',
      fields: ['name', 'email', 'subject', 'message', 'preferredContact']
    },
    speaking: {
      title: 'Speaking Engagement Request',
      description: 'Book Chef Adam for your next event or conference.',
      fields: ['name', 'email', 'company', 'phone', 'subject', 'message', 'budget', 'timeline', 'file']
    },
    guest: {
      title: 'Guest Appearance Application',
      description: 'Interested in being a guest on Chef Life Radio?',
      fields: ['name', 'email', 'company', 'role', 'subject', 'message', 'referralSource', 'file']
    },
    consultation: {
      title: 'Consultation Request',
      description: 'Get personalized guidance for your culinary business.',
      fields: ['name', 'email', 'company', 'role', 'phone', 'subject', 'message', 'budget', 'timeline']
    },
    collaboration: {
      title: 'Collaboration Opportunity',
      description: 'Partner with us on exciting culinary projects.',
      fields: ['name', 'email', 'company', 'role', 'subject', 'message', 'timeline', 'file']
    },
    media: {
      title: 'Media Inquiry',
      description: 'Press and media requests.',
      fields: ['name', 'email', 'company', 'phone', 'subject', 'message', 'timeline']
    }
  };

  const currentForm = formTypes[formType] || formTypes.contact;

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', color: 'text-gray-600' },
    { value: 'normal', label: 'Normal Priority', color: 'text-blue-600' },
    { value: 'high', label: 'High Priority', color: 'text-orange-600' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600' }
  ];

  const budgetRanges = [
    { value: '<5k', label: 'Under $5,000' },
    { value: '5k-10k', label: '$5,000 - $10,000' },
    { value: '10k-25k', label: '$10,000 - $25,000' },
    { value: '25k+', label: '$25,000+' },
    { value: 'tbd', label: 'To Be Discussed' }
  ];

  const timelineOptions = [
    { value: 'asap', label: 'As Soon As Possible' },
    { value: '1month', label: 'Within 1 Month' },
    { value: '3months', label: 'Within 3 Months' },
    { value: '6months', label: 'Within 6 Months' },
    { value: 'flexible', label: 'Flexible Timeline' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      // Determine priority based on form type
      let priority = formData.priority;
      if (formType === 'speaking' || formType === 'consultation') {
        priority = 'high';
      } else if (formType === 'media' && formData.timeline === 'asap') {
        priority = 'urgent';
      }

      const submissionData = {
        formType,
        name: formData.name,
        email: formData.email,
        priority,
        data: {
          ...formData,
          fileName: formData.file?.name,
          submissionTime: new Date().toISOString()
        }
      };

      const result = await wordpressIntegrations.submitAdvancedForm(submissionData);

      if (result.success) {
        setSubmitStatus('success');
        setFormData({
          formType,
          name: '',
          email: '',
          company: '',
          role: '',
          phone: '',
          subject: '',
          message: '',
          priority: 'normal',
          preferredContact: 'email',
          budget: '',
          timeline: '',
          referralSource: '',
          file: null
        });
        // Clear file input
        const fileInput = document.getElementById('file-upload');
        if (fileInput) fileInput.value = '';
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Form submission failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (fieldName) => {
    switch (fieldName) {
      case 'name':
        return (
          <div key={fieldName}>
            <label className="block text-sm font-heading font-medium text-brand-black mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent font-sans"
              required
            />
          </div>
        );

      case 'email':
        return (
          <div key={fieldName}>
            <label className="block text-sm font-heading font-medium text-brand-black mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent font-sans"
              required
            />
          </div>
        );

      case 'company':
        return (
          <div key={fieldName}>
            <label className="block text-sm font-heading font-medium text-brand-black mb-2">
              Company/Organization
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent font-sans"
            />
          </div>
        );

      case 'role':
        return (
          <div key={fieldName}>
            <label className="block text-sm font-heading font-medium text-brand-black mb-2">
              Your Role/Title
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              placeholder="e.g., Executive Chef, Restaurant Owner, Event Planner"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent font-sans"
            />
          </div>
        );

      case 'phone':
        return (
          <div key={fieldName}>
            <label className="block text-sm font-heading font-medium text-brand-black mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent font-sans"
            />
          </div>
        );

      case 'subject':
        return (
          <div key={fieldName}>
            <label className="block text-sm font-heading font-medium text-brand-black mb-2">
              Subject *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent font-sans"
              required
            />
          </div>
        );

      case 'message':
        return (
          <div key={fieldName}>
            <label className="block text-sm font-heading font-medium text-brand-black mb-2">
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent resize-none font-sans"
              required
            />
          </div>
        );

      case 'preferredContact':
        return (
          <div key={fieldName}>
            <label className="block text-sm font-heading font-medium text-brand-black mb-2">
              Preferred Contact Method
            </label>
            <select
              name="preferredContact"
              value={formData.preferredContact}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent font-sans"
            >
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="either">Either</option>
            </select>
          </div>
        );

      case 'budget':
        return (
          <div key={fieldName}>
            <label className="block text-sm font-heading font-medium text-brand-black mb-2">
              Budget Range
            </label>
            <select
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent font-sans"
            >
              <option value="">Select budget range</option>
              {budgetRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'timeline':
        return (
          <div key={fieldName}>
            <label className="block text-sm font-heading font-medium text-brand-black mb-2">
              Timeline
            </label>
            <select
              name="timeline"
              value={formData.timeline}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent font-sans"
            >
              <option value="">Select timeline</option>
              {timelineOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'referralSource':
        return (
          <div key={fieldName}>
            <label className="block text-sm font-heading font-medium text-brand-black mb-2">
              How did you hear about us?
            </label>
            <select
              name="referralSource"
              value={formData.referralSource}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent font-sans"
            >
              <option value="">Select source</option>
              <option value="podcast">Chef Life Radio Podcast</option>
              <option value="social_media">Social Media</option>
              <option value="google_search">Google Search</option>
              <option value="referral">Friend/Colleague Referral</option>
              <option value="conference">Conference/Event</option>
              <option value="other">Other</option>
            </select>
          </div>
        );

      case 'file':
        return (
          <div key={fieldName}>
            <label className="block text-sm font-heading font-medium text-brand-black mb-2">
              Attach File (Optional)
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleInputChange}
                className="hidden"
                id="file-upload"
                name="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp3,.wav"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-brand-red transition-colors"
              >
                <SafeIcon icon={FiUpload} className="h-5 w-5 text-brand-gray mr-2" />
                <span className="text-brand-gray font-sans">
                  {formData.file ? formData.file.name : 'Click to upload file'}
                </span>
              </label>
            </div>
            <p className="text-xs text-brand-gray mt-1 font-sans">
              Accepted formats: PDF, DOC, Images, Audio files (Max 10MB)
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border">
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-bold text-brand-black mb-2">
          {title || currentForm.title}
        </h2>
        <p className="text-brand-gray font-sans">
          {description || currentForm.description}
        </p>
      </div>

      {/* Success Message */}
      {submitStatus === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiCheck} className="h-5 w-5 text-green-600" />
            <p className="text-green-800 font-sans">
              Thank you! Your {currentForm.title.toLowerCase()} has been submitted successfully. 
              We'll get back to you within 24 hours.
            </p>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {submitStatus === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiAlertCircle} className="h-5 w-5 text-red-600" />
            <p className="text-red-800 font-sans">
              There was an error submitting your form. Please try again or email us directly.
            </p>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dynamic form fields based on form type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentForm.fields.map(field => renderField(field))}
        </div>

        {/* Priority selector for high-value forms */}
        {(formType === 'speaking' || formType === 'consultation' || formType === 'media') && (
          <div>
            <label className="block text-sm font-heading font-medium text-brand-black mb-2">
              Priority Level
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent font-sans"
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-red hover:bg-red-800 disabled:bg-gray-400 text-white py-4 rounded-lg font-heading font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <SafeIcon icon={FiLoader} className="h-5 w-5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <SafeIcon icon={FiSend} className="h-5 w-5" />
                <span>Send {currentForm.title}</span>
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-brand-gray font-sans">
          We respect your privacy. Your information will never be shared or sold.
        </p>
      </div>
    </div>
  );
};

export default AdvancedContactForm;