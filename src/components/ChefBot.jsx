import React, {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const {FiMessageCircle, FiX, FiSend, FiChef} = FiIcons;

const ChefBot = ({page = 'general'}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  // Auto-show on specific pages after delay
  useEffect(() => {
    if (!hasShown && (page === 'contact' || page === 'subscribe')) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasShown(true);
      }, 3000); // Show after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [page, hasShown]);

  const getContextualGreeting = () => {
    const greetings = {
      home: "👋 Welcome to Chef Life Radio! I'm ChefBot. Need help navigating or have questions about our community?",
      contact: "📞 Hi! I'm ChefBot. Need help choosing the right inquiry type or have questions about contacting us?",
      subscribe: "🎧 Hey there! I'm ChefBot. Questions about podcast platforms or how to subscribe? I'm here to help!",
      episodes: "🎙️ Looking for specific episodes or content? I'm ChefBot and I can help you find what you need!",
      blog: "📚 Welcome to our blog! I'm ChefBot. Looking for specific leadership topics or articles?",
      about: "ℹ️ Learning about Chef Life Radio? I'm ChefBot and I can answer any questions about our mission!",
      reviews: "⭐ Reading our reviews? I'm ChefBot! Need help leaving feedback or have questions about our community?",
      admin: "⚙️ Need help with the admin dashboard? I'm ChefBot, your admin assistant!",
      general: "👋 Hi! I'm ChefBot, your Chef Life Radio assistant. How can I help you today?"
    };

    return greetings[page] || greetings.general;
  };

  const getQuickActions = () => {
    const actions = {
      home: [
        "How do I subscribe to the podcast?",
        "What is Chef Life Radio about?",
        "How can I support the show?",
        "How do I contact Chef Adam?"
      ],
      contact: [
        "Which form should I use?",
        "How do I apply to be a guest?",
        "What's a speaking request?",
        "How do I get in touch quickly?"
      ],
      subscribe: [
        "Which platform is best for iPhone?",
        "How do I subscribe on Spotify?",
        "What's the RSS feed for?",
        "How do I get the newsletter?"
      ],
      episodes: [
        "Find leadership episodes",
        "Show latest episodes",
        "Find episodes for new chefs",
        "How do I leave feedback?"
      ],
      blog: [
        "Find leadership articles",
        "Show recent posts",
        "Find specific topics",
        "How do I subscribe to blog updates?"
      ],
      reviews: [
        "How do I leave a review?",
        "Where can I share feedback?",
        "How do I rate episodes?",
        "Can I submit a testimonial?"
      ],
      general: [
        "How do I subscribe?",
        "Contact information",
        "About the show",
        "Latest episodes"
      ]
    };

    return actions[page] || actions.general;
  };

  const handleJotformLaunch = () => {
    // Your actual ChefBot Jotform ID extracted from the embed code
    const jotformId = '0195e1168ccc791aabb6deaf28c1886223ad';
    
    // Load and launch the Jotform agent
    const script = document.createElement('script');
    script.src = `https://cdn.jotfor.ms/agent/embedjs/${jotformId}/embed.js?skipWelcome=1&maximizable=1`;
    script.onload = () => {
      // The script will automatically launch ChefBot
      console.log('✅ ChefBot launched successfully');
    };
    
    document.head.appendChild(script);
    setIsOpen(false);
  };

  return (
    <>
      {/* ChefBot Floating Button */}
      <motion.button
        initial={{scale: 0}}
        animate={{scale: 1}}
        transition={{delay: 1, type: "spring"}}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-brand-red hover:bg-red-800 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
        title="Chat with ChefBot"
      >
        <SafeIcon icon={FiMessageCircle} className="h-6 w-6" />
        
        {/* Notification Badge */}
        {!hasShown && (
          <motion.div
            initial={{scale: 0}}
            animate={{scale: 1}}
            transition={{delay: 2}}
            className="absolute -top-2 -right-2 bg-brand-gold text-brand-black text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold"
          >
            !
          </motion.div>
        )}
      </motion.button>

      {/* ChefBot Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{opacity: 0, y: 50, scale: 0.9}}
              animate={{opacity: 1, y: 0, scale: 1}}
              exit={{opacity: 0, y: 50, scale: 0.9}}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-brand-red text-white p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-full">
                    <SafeIcon icon={FiChef} className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold">ChefBot</h3>
                    <p className="text-sm opacity-90">Your Chef Life Radio Assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
                >
                  <SafeIcon icon={FiX} className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Greeting */}
                <div className="mb-6">
                  <div className="bg-gray-100 rounded-2xl p-4 mb-4">
                    <p className="text-brand-black font-sans">
                      {getContextualGreeting()}
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-6">
                  <h4 className="text-sm font-heading font-semibold text-brand-gray mb-3">
                    Quick Questions:
                  </h4>
                  <div className="space-y-2">
                    {getQuickActions().map((action, index) => (
                      <button
                        key={index}
                        onClick={handleJotformLaunch}
                        className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-sans transition-colors"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Chat Button */}
                <button
                  onClick={handleJotformLaunch}
                  className="w-full bg-brand-red hover:bg-red-800 text-white py-3 rounded-lg font-heading font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <SafeIcon icon={FiSend} className="h-4 w-4" />
                  <span>Start Chatting with ChefBot</span>
                </button>

                {/* Footer */}
                <p className="text-xs text-brand-gray text-center mt-4 font-sans">
                  ChefBot is trained on Chef Life Radio content and can help with navigation, subscriptions, and general questions.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChefBot;