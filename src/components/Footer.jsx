import React from 'react';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiInstagram, FiTwitter, FiYoutube, FiMail, FiPhone } = FiIcons;

const Footer = () => {
  return (
    <footer className="bg-brand-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1750773391143-CLR%20Logo%20Favicon.png" 
                alt="Chef Life Radio" 
                className="h-12 w-12"
              />
              <div>
                <h3 className="text-xl font-display font-bold text-brand-gold">Chef Life Radio</h3>
                <p className="text-sm text-gray-400 font-sans">Empowering Culinary Leaders</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md font-sans">
              Building thriving, sustainable kitchens through purpose-driven leadership. 
              Creating culture, not just controlling chaos.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors">
                <SafeIcon icon={FiInstagram} className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors">
                <SafeIcon icon={FiTwitter} className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors">
                <SafeIcon icon={FiYoutube} className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-4 text-brand-gold">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/episodes" className="text-gray-300 hover:text-white transition-colors font-sans">Latest Episodes</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors font-sans">About Us</Link></li>
              <li><Link to="/subscribe" className="text-gray-300 hover:text-white transition-colors font-sans">Subscribe</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-white transition-colors font-sans">Blog</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-4 text-brand-gold">Get in Touch</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiMail} className="h-4 w-4 text-brand-gold" />
                <span className="text-gray-300 text-sm font-sans">hello@chefliferadio.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiPhone} className="h-4 w-4 text-brand-gold" />
                <span className="text-gray-300 text-sm font-sans">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm font-sans">
            © 2024 Chef Life Radio. All rights reserved. | Stay Tall & Frosty, Y'all.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;