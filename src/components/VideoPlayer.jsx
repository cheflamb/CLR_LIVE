import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import wordpressIntegrations from '../services/wordpressIntegrations';

const { FiPlay, FiPause, FiVolume2, FiMaximize, FiDownload, FiShare2 } = FiIcons;

const VideoPlayer = ({ 
  videoId, 
  title, 
  videoUrl, 
  thumbnailUrl, 
  leadMagnetEnabled = false, 
  leadMagnetTitle, 
  onLeadCapture 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadCaptureData, setLeadCaptureData] = useState({ email: '', name: '' });
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));
  
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handleLoadedData = () => {
      // Track video load
      wordpressIntegrations.trackVideoEvent(videoId, {
        sessionId,
        eventType: 'load',
        deviceType: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop'
      });
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('loadeddata', handleLoadedData);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [videoId, sessionId]);

  // Show lead capture at 50% completion
  useEffect(() => {
    if (leadMagnetEnabled && duration > 0 && currentTime / duration >= 0.5 && !showLeadCapture) {
      setShowLeadCapture(true);
    }
  }, [currentTime, duration, leadMagnetEnabled, showLeadCapture]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      wordpressIntegrations.trackVideoEvent(videoId, {
        sessionId,
        eventType: 'pause',
        watchTime: currentTime,
        completionPercentage: (currentTime / duration) * 100
      });
    } else {
      video.play();
      wordpressIntegrations.trackVideoEvent(videoId, {
        sessionId,
        eventType: 'play',
        watchTime: currentTime
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    wordpressIntegrations.trackVideoEvent(videoId, {
      sessionId,
      eventType: 'complete',
      watchTime: duration,
      completionPercentage: 100
    });
  };

  const handleProgressClick = (e) => {
    const video = videoRef.current;
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const handleLeadCaptureSubmit = (e) => {
    e.preventDefault();
    
    // Track lead capture
    wordpressIntegrations.trackVideoEvent(videoId, {
      sessionId,
      eventType: 'lead_capture',
      userEmail: leadCaptureData.email,
      completionPercentage: (currentTime / duration) * 100
    });

    // Call parent callback if provided
    if (onLeadCapture) {
      onLeadCapture(leadCaptureData);
    }

    setShowLeadCapture(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative bg-black rounded-lg overflow-hidden group">
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={thumbnailUrl}
        className="w-full h-full"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleVideoEnd}
        onMouseMove={handleMouseMove}
        onClick={handlePlayPause}
      />

      {/* Play Button Overlay (when paused) */}
      {!isPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30"
        >
          <button
            onClick={handlePlayPause}
            className="bg-brand-red hover:bg-red-700 text-white p-4 rounded-full transition-colors"
          >
            <SafeIcon icon={FiPlay} className="h-8 w-8 ml-1" />
          </button>
        </motion.div>
      )}

      {/* Controls */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4"
      >
        {/* Progress Bar */}
        <div
          className="w-full bg-gray-600 h-1 rounded-full cursor-pointer mb-3"
          onClick={handleProgressClick}
        >
          <div
            className="bg-brand-red h-full rounded-full transition-all"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePlayPause}
              className="hover:text-brand-red transition-colors"
            >
              <SafeIcon icon={isPlaying ? FiPause : FiPlay} className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiVolume2} className="h-4 w-4" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 accent-brand-red"
              />
            </div>
            
            <span className="text-sm font-sans">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button className="hover:text-brand-red transition-colors p-1">
              <SafeIcon icon={FiShare2} className="h-4 w-4" />
            </button>
            <button className="hover:text-brand-red transition-colors p-1">
              <SafeIcon icon={FiDownload} className="h-4 w-4" />
            </button>
            <button
              onClick={() => videoRef.current?.requestFullscreen()}
              className="hover:text-brand-red transition-colors p-1"
            >
              <SafeIcon icon={FiMaximize} className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Lead Capture Modal */}
      {showLeadCapture && leadMagnetEnabled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 max-w-sm w-full mx-4"
          >
            <h3 className="text-xl font-heading font-bold text-brand-black mb-2">
              {leadMagnetTitle || 'Get Exclusive Content'}
            </h3>
            <p className="text-brand-gray font-sans mb-4">
              Enter your email to download our free leadership toolkit and continue watching.
            </p>
            
            <form onSubmit={handleLeadCaptureSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Your Name"
                value={leadCaptureData.name}
                onChange={(e) => setLeadCaptureData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red font-sans"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={leadCaptureData.email}
                onChange={(e) => setLeadCaptureData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red font-sans"
                required
              />
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowLeadCapture(false)}
                  className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 font-sans"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-brand-red hover:bg-red-800 text-white px-4 py-2 rounded-lg font-heading font-medium"
                >
                  Get Access
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Video Title Overlay */}
      {title && (
        <div className="absolute top-4 left-4 right-4">
          <h3 className="text-white font-heading font-semibold text-lg drop-shadow-lg">
            {title}
          </h3>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;