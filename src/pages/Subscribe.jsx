import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import MembershipButton from '../components/MembershipButton';
import crmService from '../services/crmService';

const { FiHeadphones, FiPlay, FiDownload, FiMail, FiGift, FiArrowRight, FiCheck, FiLoader, FiMic, FiHeart, FiShoppingBag } = FiIcons;

const Subscribe = () => {
  const [newsletterData, setNewsletterData] = useState({
    firstName: '',
    email: '',
    role: ''
  });
  const [leadMagnetData, setLeadMagnetData] = useState({
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [leadMagnetSubmitting, setLeadMagnetSubmitting] = useState(false);
  const [leadMagnetStatus, setLeadMagnetStatus] = useState('');

  // Updated podcast platform URLs
  const platforms = [
    {
      name: "Captivate (All Platforms)",
      icon: FiHeadphones,
      color: "bg-brand-red hover:bg-red-800",
      description: "Listen on all your favorite platforms",
      url: "https://therealchefliferadio.captivate.fm/listen"
    },
    {
      name: "Apple Podcasts",
      icon: FiPlay,
      color: "bg-gray-800 hover:bg-gray-900",
      description: "Listen on your iPhone, iPad, and Mac",
      url: "https://podcasts.apple.com/us/podcast/chef-life-radio/id1567763359"
    },
    {
      name: "Spotify",
      icon: FiHeadphones,
      color: "bg-green-500 hover:bg-green-600",
      description: "Stream on the world's largest music platform",
      url: "https://open.spotify.com/show/7w1sii8X2eukTsm8jiVEx5"
    },
    {
      name: "Amazon Music",
      icon: FiHeadphones,
      color: "bg-blue-600 hover:bg-blue-700",
      description: "Available on Alexa and Amazon devices",
      url: "https://music.amazon.com/podcasts/ca17afbd-1376-4ad7-a5a1-c8ff53c0e1f4/Chef-Life-Radio"
    },
    {
      name: "YouTube",
      icon: FiPlay,
      color: "bg-red-600 hover:bg-red-700",
      description: "Watch video episodes and clips",
      url: "https://www.youtube.com/@chefadammlamb"
    },
    {
      name: "RSS Feed",
      icon: FiDownload,
      color: "bg-orange-500 hover:bg-orange-600",
      description: "Direct feed for your favorite app",
      url: "https://feeds.captivate.fm/therealchefliferadio/"
    }
  ];

  const communityLinks = [
    {
      name: "Be Part of The Show",
      icon: FiMic,
      color: "bg-brand-red hover:bg-red-800",
      description: "Apply to be a guest on our podcast",
      url: "https://therealchefliferadio.captivate.fm/booking"
    },
    {
      name: "Support the Crew",
      icon: FiHeart,
      color: "bg-pink-500 hover:bg-pink-600",
      description: "Help us keep the show running",
      url: "https://ko-fi.com/chefliferadio"
    },
    {
      name: "Chef Life Swag",
      icon: FiShoppingBag,
      color: "bg-brand-gold hover:bg-yellow-600 text-brand-black",
      description: "Get your official Chef Life gear",
      url: "https://swag.chefliferadio.com/"
    }
  ];

  const benefits = [
    "Get notified of new episodes immediately",
    "Access to exclusive leadership resources",
    "Join our private community discussions",
    "Early access to special events and workshops",
    "Monthly kitchen culture guides",
    "Direct connection with Chef Adam Lamb"
  ];

  const handleNewsletterChange = (e) => {
    const { name, value } = e.target;
    setNewsletterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLeadMagnetChange = (e) => {
    setLeadMagnetData({ email: e.target.value });
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const result = await crmService.subscribeToNewsletter({
        firstName: newsletterData.firstName,
        email: newsletterData.email,
        role: newsletterData.role,
        sourcePage: 'subscribe',
        tags: ['newsletter', 'podcast-subscriber']
      });

      if (result.success) {
        setSubmitStatus('success');
        setNewsletterData({ firstName: '', email: '', role: '' });
      } else {
        if (result.error?.includes('duplicate') || result.error?.includes('23505')) {
          setSubmitStatus('duplicate');
        } else {
          throw new Error(result.error);
        }
      }
    } catch (error) {
      console.error('Error submitting newsletter signup:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLeadMagnetSubmit = async (e) => {
    e.preventDefault();
    setLeadMagnetSubmitting(true);
    setLeadMagnetStatus('');

    try {
      const result = await crmService.subscribeToLeadMagnet({
        email: leadMagnetData.email
      });

      if (result.success) {
        setLeadMagnetStatus('success');
        setLeadMagnetData({ email: '' });
        // Trigger download
        if (result.downloadUrl) {
          setTimeout(() => {
            window.open(result.downloadUrl, '_blank');
          }, 1000);
        }
      } else {
        if (result.error?.includes('duplicate') || result.error?.includes('23505')) {
          setLeadMagnetStatus('duplicate');
        } else {
          throw new Error(result.error);
        }
      }
    } catch (error) {
      console.error('Error submitting lead magnet signup:', error);
      setLeadMagnetStatus('error');
    } finally {
      setLeadMagnetSubmitting(false);
    }
  };

  const handlePlatformClick = (platform) => {
    // Track platform click
    crmService.trackConversionEvent('podcast_platform_click', {
      platform: platform.name,
      source: 'subscribe_page'
    });
    window.open(platform.url, '_blank');
  };

  const handleCommunityClick = (link) => {
    // Track community link click
    crmService.trackConversionEvent('community_link_click', {
      link: link.name,
      source: 'subscribe_page'
    });
    window.open(link.url, '_blank');
  };

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
          <h1 className="text-5xl font-display font-bold text-brand-black mb-6">Subscribe & Join the Movement</h1>
          <p className="text-xl text-brand-gray max-w-3xl mx-auto font-sans">
            Join thousands of culinary leaders who are transforming kitchen culture. 
            Choose your preferred platform and become part of the movement.
          </p>
        </motion.div>

        {/* Platform Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-heading font-bold text-brand-black text-center mb-8">Listen On Your Favorite Platform</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform, index) => (
              <motion.button
                key={platform.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handlePlatformClick(platform)}
                className={`${platform.color} text-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl border`}
              >
                <div className="flex items-center space-x-4 mb-3">
                  <SafeIcon icon={platform.icon} className="h-8 w-8" />
                  <h3 className="text-xl font-heading font-bold">{platform.name}</h3>
                </div>
                <p className="text-sm opacity-90 font-sans">{platform.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Community Links */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-heading font-bold text-brand-black text-center mb-8">Join Our Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {communityLinks.map((link, index) => (
              <motion.button
                key={link.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleCommunityClick(link)}
                className={`${link.color} text-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl border`}
              >
                <div className="flex items-center space-x-4 mb-3">
                  <SafeIcon icon={link.icon} className="h-8 w-8" />
                  <h3 className="text-xl font-heading font-bold">{link.name}</h3>
                </div>
                <p className="text-sm opacity-90 font-sans">{link.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Lead Magnet */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-brand-gold rounded-2xl p-8 text-center text-brand-black">
            <SafeIcon icon={FiGift} className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-3xl font-display font-bold mb-4">Free Leadership Toolkit</h2>
            <p className="text-xl mb-6 font-sans">
              Download our comprehensive guide with practical strategies, templates, and checklists 
              for building thriving kitchen teams.
            </p>

            {/* Lead Magnet Success Message */}
            {leadMagnetStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
              >
                <div className="flex items-center justify-center space-x-2">
                  <SafeIcon icon={FiCheck} className="h-5 w-5 text-green-600" />
                  <p className="text-green-800 font-sans">
                    Success! Check your email for the Leadership Toolkit download link.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Lead Magnet Duplicate Message */}
            {leadMagnetStatus === 'duplicate' && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
              >
                <p className="text-blue-800 font-sans">
                  You're already subscribed! Check your email for the Leadership Toolkit.
                </p>
              </motion.div>
            )}

            {/* Lead Magnet Error Message */}
            {leadMagnetStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
              >
                <p className="text-red-800 font-sans">
                  There was an error. Please try again or contact us directly.
                </p>
              </motion.div>
            )}

            <form onSubmit={handleLeadMagnetSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={leadMagnetData.email}
                onChange={handleLeadMagnetChange}
                className="flex-1 px-4 py-3 rounded-lg text-brand-black font-sans focus:outline-none focus:ring-2 focus:ring-brand-red border"
                required
              />
              <button
                type="submit"
                disabled={leadMagnetSubmitting}
                className="bg-brand-red hover:bg-red-800 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-heading font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                {leadMagnetSubmitting ? (
                  <>
                    <SafeIcon icon={FiLoader} className="h-4 w-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Get Free Guide</span>
                    <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Newsletter Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold text-brand-black mb-6">Why Join Our Community?</h2>
              <p className="text-lg text-brand-gray mb-8 font-sans">
                Get exclusive insights, early access to episodes, and practical resources delivered directly 
                to your inbox every week.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="bg-brand-red p-1 rounded-full">
                      <SafeIcon icon={FiCheck} className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-brand-black font-sans">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8 border">
              <div className="text-center mb-6">
                <SafeIcon icon={FiMail} className="h-12 w-12 mx-auto text-brand-red mb-4" />
                <h3 className="text-2xl font-heading font-bold text-brand-black">Join the Movement</h3>
                <p className="text-brand-gray font-sans">10,000+ culinary leaders already subscribed</p>
              </div>

              {/* Newsletter Success Message */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
                >
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiCheck} className="h-5 w-5 text-green-600" />
                    <p className="text-green-800 font-sans">
                      Welcome to the movement! Check your email for a confirmation.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Newsletter Duplicate Message */}
              {submitStatus === 'duplicate' && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
                >
                  <p className="text-blue-800 font-sans">
                    You're already part of the movement! Thanks for being a loyal subscriber.
                  </p>
                </motion.div>
              )}

              {/* Newsletter Error Message */}
              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
                >
                  <p className="text-red-800 font-sans">
                    There was an error. Please try again or contact us directly.
                  </p>
                </motion.div>
              )}

              <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={newsletterData.firstName}
                  onChange={handleNewsletterChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent font-sans"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={newsletterData.email}
                  onChange={handleNewsletterChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent font-sans"
                  required
                />
                <select
                  name="role"
                  value={newsletterData.role}
                  onChange={handleNewsletterChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent font-sans"
                >
                  <option value="">Your Role in the Industry</option>
                  <option value="chef">Executive Chef</option>
                  <option value="sous">Sous Chef</option>
                  <option value="line">Line Cook</option>
                  <option value="owner">Restaurant Owner</option>
                  <option value="manager">Kitchen Manager</option>
                  <option value="other">Other</option>
                </select>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-red hover:bg-red-800 disabled:bg-gray-400 text-white py-3 rounded-lg font-heading font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <SafeIcon icon={FiLoader} className="h-5 w-5 animate-spin" />
                      <span>Joining...</span>
                    </>
                  ) : (
                    <span>Join the Movement</span>
                  )}
                </button>
              </form>

              <p className="text-xs text-brand-gray text-center mt-4 font-sans">
                Stay Tall & Frosty, Y'all. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Membership CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-brand-black rounded-2xl p-8 text-white text-center mb-16"
        >
          <h2 className="text-3xl font-display font-bold mb-4">Ready for the Next Level?</h2>
          <p className="text-gray-300 mb-8 font-sans max-w-2xl mx-auto">
            Join our exclusive membership community for advanced leadership training, direct access to Chef Adam, 
            and transformational kitchen culture resources.
          </p>
          <MembershipButton variant="gold" source="subscribe_membership_cta" size="xl">
            Join Exclusive Membership
          </MembershipButton>
        </motion.div>

        {/* Audio Player Widget */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-50 rounded-2xl p-8 text-center"
        >
          <h2 className="text-3xl font-display font-bold mb-4 text-brand-black">Listen to Latest Episodes</h2>
          <p className="text-brand-gray mb-8 font-sans">
            Stream our podcast directly from our website
          </p>
          <div className="bg-white rounded-xl p-6 max-w-2xl mx-auto shadow-lg">
            <div className="flex items-center space-x-4 mb-4">
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                alt="Episode"
                className="w-16 h-16 rounded-lg"
              />
              <div className="text-left">
                <h4 className="font-heading font-semibold text-brand-black">Building Resilient Kitchen Teams</h4>
                <p className="text-gray-400 text-sm font-sans">Latest Episode • 42 min</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-brand-red hover:bg-red-800 p-3 rounded-full transition-colors">
                <SafeIcon icon={FiPlay} className="h-6 w-6 text-white" />
              </button>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className="bg-brand-gold h-2 rounded-full w-1/3"></div>
              </div>
              <span className="text-sm text-gray-400 font-sans">14:25 / 42:00</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Subscribe;