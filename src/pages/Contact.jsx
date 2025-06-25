import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AdvancedContactForm from '../components/AdvancedContactForm';

const { FiMail, FiPhone, FiMapPin, FiInstagram, FiTwitter, FiYoutube, FiCheck, FiMessageSquare, FiHeart, FiShoppingBag, FiMic } = FiIcons;

const Contact = () => {
  const [activeFormType, setActiveFormType] = useState('contact');

  const formTypes = [
    { id: 'contact', label: 'General Contact', icon: FiMail },
    { id: 'speaking', label: 'Speaking Request', icon: FiIcons.FiMic },
    { id: 'guest', label: 'Guest Application', icon: FiIcons.FiUsers },
    { id: 'consultation', label: 'Consultation', icon: FiMessageSquare },
    { id: 'collaboration', label: 'Collaboration', icon: FiIcons.FiHeart },
    { id: 'media', label: 'Media Inquiry', icon: FiIcons.FiCamera }
  ];

  const contactInfo = [
    {
      icon: FiMail,
      title: "Email Us",
      content: "adam@chefliferadio.com",
      description: "We typically respond within 24 hours"
    },
    {
      icon: FiPhone,
      title: "Call or Text",
      content: "(828) 688-0080",
      description: "Available Monday - Friday, 9AM - 5PM EST"
    },
    {
      icon: FiMapPin,
      title: "Location",
      content: "Asheville, NC",
      description: "Available for events nationwide"
    }
  ];

  const socialLinks = [
    {
      icon: FiYoutube,
      name: "YouTube",
      url: "https://www.youtube.com/@chefadammlamb",
      color: "bg-red-500 hover:bg-red-600"
    },
    {
      icon: FiInstagram,
      name: "Connect",
      url: "https://link.chefliferadio.com/connect",
      color: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
    }
  ];

  const supportLinks = [
    {
      icon: FiMic,
      name: "Be Part of The Show",
      url: "https://therealchefliferadio.captivate.fm/booking",
      color: "bg-brand-red hover:bg-red-800",
      description: "Apply to be a guest on our podcast"
    },
    {
      icon: FiHeart,
      name: "Support the Crew",
      url: "https://ko-fi.com/chefliferadio",
      color: "bg-pink-500 hover:bg-pink-600",
      description: "Help us keep the show running"
    },
    {
      icon: FiShoppingBag,
      name: "Chef Life Swag",
      url: "https://swag.chefliferadio.com/",
      color: "bg-brand-gold hover:bg-yellow-600 text-brand-black",
      description: "Get your official Chef Life gear"
    }
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
            Ready to join the movement? Whether you have feedback, want to collaborate, or just want to say hello,
            we're here to connect with our community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form Type Selector & Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Form Type Selector */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border">
              <h3 className="text-lg font-heading font-semibold text-brand-black mb-4">
                Select Inquiry Type
              </h3>
              <div className="space-y-2">
                {formTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setActiveFormType(type.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-heading font-medium transition-colors flex items-center space-x-3 ${
                      activeFormType === type.id
                        ? 'bg-brand-red text-white'
                        : 'bg-gray-50 text-brand-black hover:bg-gray-100'
                    }`}
                  >
                    <SafeIcon icon={type.icon} className="h-5 w-5" />
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-brand-red p-3 rounded-lg">
                      <SafeIcon icon={info.icon} className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-heading font-semibold text-brand-black mb-1">
                        {info.title}
                      </h3>
                      <p className="text-brand-red font-heading font-medium mb-1">{info.content}</p>
                      <p className="text-sm text-brand-gray font-sans">{info.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Support & Community Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-50 rounded-xl p-6 border"
            >
              <h3 className="text-lg font-heading font-semibold text-brand-black mb-4">
                Join the Community
              </h3>
              <div className="space-y-3">
                {supportLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${link.color} text-white p-3 rounded-lg transition-colors flex items-center space-x-3 hover:shadow-md`}
                  >
                    <SafeIcon icon={link.icon} className="h-5 w-5" />
                    <div>
                      <div className="font-heading font-medium">{link.name}</div>
                      <div className="text-xs opacity-90 font-sans">{link.description}</div>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gray-50 rounded-xl p-6 border"
            >
              <h3 className="text-lg font-heading font-semibold text-brand-black mb-4">
                Follow the Movement
              </h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
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

            {/* Response Guarantee */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-brand-gold rounded-xl p-6 text-brand-black"
            >
              <div className="flex items-center space-x-3 mb-3">
                <SafeIcon icon={FiCheck} className="h-6 w-6" />
                <h3 className="text-lg font-heading font-semibold">Quick Response Guarantee</h3>
              </div>
              <p className="text-sm font-sans">
                We value your time and aim to respond to all inquiries within 24 hours. 
                For urgent matters, please call us directly at (828) 688-0080.
              </p>
            </motion.div>
          </motion.div>

          {/* Advanced Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <AdvancedContactForm formType={activeFormType} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;