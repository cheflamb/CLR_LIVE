import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlay, FiHeadphones, FiStar, FiMail, FiArrowRight, FiUsers, FiTarget, FiHeart } = FiIcons;

const Home = () => {
  const values = [
    {
      icon: FiUsers,
      title: "More Solidarity",
      description: "Less 'suck it up sunshine'"
    },
    {
      icon: FiHeart,
      title: "More Compassion",
      description: "Less CutThroat Island"
    },
    {
      icon: FiTarget,
      title: "More Partnership",
      description: "Less 'put up or shut up'"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white"
    >
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight text-brand-black">
                Empowering Culinary
                <span className="text-brand-red block">Leaders</span>
              </h1>
              <p className="text-xl mb-8 text-brand-gray leading-relaxed font-sans">
                Building thriving, sustainable kitchens through purpose-driven leadership. 
                It should be hard, it just doesn't have to be harsh.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/episodes"
                  className="bg-brand-red hover:bg-red-800 text-white px-8 py-4 rounded-lg font-heading font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <SafeIcon icon={FiPlay} className="h-5 w-5" />
                  <span>Listen Now</span>
                </Link>
                <Link
                  to="/subscribe"
                  className="border-2 border-brand-red hover:bg-brand-red hover:text-white text-brand-red px-8 py-4 rounded-lg font-heading font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <SafeIcon icon={FiHeadphones} className="h-5 w-5" />
                  <span>Subscribe</span>
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <img
                src="https://podcast.cheflifemedia.com/wp-content/uploads/2025/04/1-1.png"
                alt="Chef Adam Lamb - Host of Chef Life Radio"
                className="rounded-2xl shadow-2xl w-full max-w-md mx-auto"
              />
              <div className="absolute -bottom-6 -right-6 bg-brand-gold text-brand-black p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiStar} className="h-5 w-5" />
                  <span className="font-heading font-semibold">10K+ Listeners</span>
                </div>
                <p className="text-sm font-sans">Top Culinary Podcast</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured YouTube Video */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-display font-bold text-brand-black mb-4">Featured Video</h2>
            <p className="text-xl text-brand-gray font-sans">Leadership insights from the kitchen</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                width="100%"
                height="450"
                src="https://www.youtube.com/embed/nXtvUWS-Tv4?si=x1mU1u4JOMCT02bC"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="rounded-2xl"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Beliefs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-display font-bold text-brand-black mb-6">We Believe</h2>
            <p className="text-xl text-brand-gray max-w-3xl mx-auto font-sans">
              Working in a kitchen should be demanding; it shouldn't have to be demeaning.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg text-center border hover:shadow-xl transition-shadow"
              >
                <div className="bg-brand-red p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <SafeIcon icon={value.icon} className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-brand-black mb-3">{value.title}</h3>
                <p className="text-brand-gray font-sans">{value.description}</p>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <blockquote className="text-2xl font-sans italic text-brand-black mb-6 max-w-3xl mx-auto">
              "We believe in more community and less... well, you know. This is about creating culture, not just controlling chaos."
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* Kitchen Culture Images */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1750773486970-3.png"
                alt="Chef Life Radio Team"
                className="rounded-2xl shadow-lg w-full"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1750773481632-1.png"
                alt="Kitchen Staff"
                className="rounded-2xl shadow-lg w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-brand-red text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <SafeIcon icon={FiMail} className="h-16 w-16 mx-auto mb-6 text-brand-gold" />
            <h2 className="text-4xl font-display font-bold mb-4">Stay Connected</h2>
            <p className="text-xl mb-8 text-white max-w-2xl mx-auto font-sans">
              Join the movement. Get weekly insights and leadership strategies delivered to your inbox.
            </p>
            <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-brand-black font-sans focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
              <button className="bg-brand-gold hover:bg-yellow-600 text-brand-black px-6 py-3 rounded-lg font-heading font-semibold transition-colors flex items-center justify-center space-x-2">
                <span>Join Movement</span>
                <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-6 text-sm font-sans opacity-90">Stay Tall & Frosty, Y'all.</p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;