import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiPlay, FiClock, FiCalendar, FiUser, FiLoader, FiHeadphones } = FiIcons;

const Episodes = () => {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEpisodes = async () => {
    try {
      const { data, error } = await supabase
        .from('podcast_episodes_clr2025')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setEpisodes(data || []);
    } catch (err) {
      console.error('Error fetching episodes:', err);
      setError('Failed to load episodes');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchEpisodes();
      setLoading(false);
    };
    loadData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-16 flex items-center justify-center">
        <div className="text-center">
          <SafeIcon icon={FiLoader} className="h-12 w-12 mx-auto text-brand-red animate-spin mb-4" />
          <p className="text-brand-gray font-sans">Loading episodes...</p>
        </div>
      </div>
    );
  }

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
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-display font-bold text-brand-black mb-4">Listen to Latest Episodes</h1>
          <p className="text-xl text-brand-gray max-w-2xl mx-auto font-sans">
            Dive into our complete library of conversations, insights, and practical wisdom for culinary professionals at every level.
          </p>
        </motion.div>

        {/* Captivate Player Embed */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border">
            <div className="w-full">
              <iframe
                src="https://player.captivate.fm/show/1732ebe2-8fb0-4b83-837a-109af6810a94#"
                width="100%"
                height="400"
                frameBorder="0"
                scrolling="no"
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        </motion.div>

        {/* Episodes List */}
        {episodes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-heading font-bold text-brand-black mb-8">Recent Episodes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {episodes.map((episode, index) => (
                <motion.div
                  key={episode.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    {episode.featured_image_url ? (
                      <img
                        src={episode.featured_image_url}
                        alt={episode.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-brand-red rounded-lg flex items-center justify-center">
                        <SafeIcon icon={FiHeadphones} className="h-10 w-10 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-brand-red text-white px-2 py-1 rounded text-sm font-heading font-medium">
                          Episode {episode.episode_number}
                        </span>
                        {episode.season_number > 1 && (
                          <span className="bg-gray-100 text-brand-gray px-2 py-1 rounded text-sm font-sans">
                            Season {episode.season_number}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-heading font-bold text-brand-black mb-2 line-clamp-2">
                        {episode.title}
                      </h3>
                      {episode.description && (
                        <p className="text-brand-gray text-sm mb-3 line-clamp-2 font-sans">
                          {episode.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-brand-gray mb-3">
                        {episode.guest_name && (
                          <div className="flex items-center space-x-1">
                            <SafeIcon icon={FiUser} className="h-4 w-4" />
                            <span className="font-sans">{episode.guest_name}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiClock} className="h-4 w-4" />
                          <span className="font-sans">{episode.duration_minutes} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiCalendar} className="h-4 w-4" />
                          <span className="font-sans">{formatDate(episode.published_at)}</span>
                        </div>
                      </div>
                      <button className="bg-brand-red hover:bg-red-800 text-white px-4 py-2 rounded-lg font-heading font-medium transition-colors flex items-center space-x-2">
                        <SafeIcon icon={FiPlay} className="h-4 w-4" />
                        <span>Listen Now</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {error && (
          <div className="text-center py-16">
            <p className="text-red-600 font-sans mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-brand-red text-white px-4 py-2 rounded-lg font-sans"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Episodes;