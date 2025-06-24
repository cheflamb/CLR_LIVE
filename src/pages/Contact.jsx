import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiMail, FiPhone, FiMapPin, FiSend, FiInstagram, FiTwitter, FiYoutube, FiUpload, FiCheck, FiLoader } = FiIcons;

const Contact = () => {
  const [formData, setFormData] = useState({
    inquiryType: '',
    name: '',
    email: '',
    message: '',
    file: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const inquiryTypes = [
    { value: 'booking', label: 'Speaking/Event Booking' },
    { value: 'feedback', label: 'Podcast Feedback' },
    { value: 'collaboration', label: 'Collaboration Opportunity' },
    { value: 'guest', label: 'Guest Appearance' },
    { value: 'media', label: 'Media Inquiry' },
    { value: 'general', label: 'General Question' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      // Insert contact submission into Supabase
      const { data, error } = await supabase
        .from('contact_submissions_clr2025')
        .insert([
          {
            inquiry_type: formData.inquiryType,
            name: formData.name,
            email: formData.email,
            message: formData.message,
            file_name: formData.file ? formData.file.name : null
          }
        ]);

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({
        inquiryType: '',
        name: '',
        email: '',
        message: '',
        file: null
      });

      // Clear file input
      const fileInput = document.getElementById('file-upload');
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: FiMail,
      title: "Email Us",
      content: "hello@chefliferadio.com",
      description: "We typically respond within 24 hours"
    },
    {
      icon: FiPhone,
      title: "Call Us", 
      content: "+1 (555) 123-4567",
      description: "Monday - Friday, 9AM - 5PM EST"
    },
    {
      icon: FiMapPin,
      title: "Location",
      content: "New York City, NY",
      description: "Available for events nationwide"
    }
  ];

  const socialLinks = [
    { icon: FiInstagram, name: "Instagram", url: "#", color: "bg-pink-500 hover:bg-pink-600" },
    { icon: FiTwitter, name: "Twitter", url: "#", color: "bg-blue-400 hover:bg-blue-500" },
    { icon: FiYoutube, name: "YouTube", url: "#", color: "bg-red-500 hover:bg-red-600" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-display font-bold text-brand-black mb-6">Get In Touch</h1>
          <p className="text-xl text-brand-gray max-w-3xl mx-auto font-sans">
            Ready to join the movement? Whether you have feedback, want to collaborate, 
            or just want to say hello, we're here to connect with our community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 border">
              <h2 className="text-3xl font-heading font-bold text-brand-black mb-6">Send us a Message</h2>
              
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
                      Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.
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
                  <p className="text-red-800 font-sans">
                    There was an error sending your message. Please try again or email us directly.
                  </p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-heading font-medium text-brand-black mb-2">
                    What can we help you with?
                  </label>
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent font-sans"
                    required
                  >
                    <option value="">Select inquiry type</option>
                    {inquiryTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-heading font-medium text-brand-black mb-2">
                      Full Name
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
                  <div>
                    <label className="block text-sm font-heading font-medium text-brand-black mb-2">
                      Email Address
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
                </div>

                <div>
                  <label className="block text-sm font-heading font-medium text-brand-black mb-2">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent resize-none font-sans"
                    placeholder="Tell us more about your inquiry..."
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-heading font-medium text-brand-black mb-2">
                    Attach File (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-red hover:bg-red-800 disabled:bg-gray-400 text-white py-4 rounded-lg font-heading font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <SafeIcon icon={FiLoader} className="h-5 w-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <SafeIcon icon={FiSend} className="h-5 w-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-brand-red p-3 rounded-lg">
                      <SafeIcon icon={info.icon} className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-heading font-semibold text-brand-black mb-1">{info.title}</h3>
                      <p className="text-brand-red font-heading font-medium mb-1">{info.content}</p>
                      <p className="text-sm text-brand-gray font-sans">{info.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gray-50 rounded-xl p-6 border"
            >
              <h3 className="text-lg font-heading font-semibold text-brand-black mb-4">Follow the Movement</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className={`${social.color} text-white p-3 rounded-lg transition-colors`}
                  >
                    <SafeIcon icon={social.icon} className="h-6 w-6" />
                  </a>
                ))}
              </div>
              <p className="text-sm text-brand-gray mt-4 font-sans">
                Follow us for daily insights, behind-the-scenes content, and community discussions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="bg-brand-gold rounded-xl p-6 text-brand-black"
            >
              <div className="flex items-center space-x-3 mb-3">
                <SafeIcon icon={FiCheck} className="h-6 w-6" />
                <h3 className="text-lg font-heading font-semibold">Quick Response Guarantee</h3>
              </div>
              <p className="text-sm font-sans">
                We value your time and aim to respond to all inquiries within 24 hours. 
                For urgent matters, please call us directly.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;