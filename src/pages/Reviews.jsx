import React, {useEffect} from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const {FiStar, FiHeart, FiMessageSquare, FiUsers, FiMic, FiVideo} = FiIcons;

const Reviews = () => {
  useEffect(() => {
    // Load Feedspace embed script
    const script = document.createElement('script');
    script.src = 'https://js.feedspace.io/v1/embed/embed.min.js';
    script.type = 'text/javascript';
    script.async = true;
    
    // Only add if not already loaded
    if (!document.querySelector('script[src="https://js.feedspace.io/v1/embed/embed.min.js"]')) {
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup function - remove script when component unmounts
      const existingScript = document.querySelector('script[src="https://js.feedspace.io/v1/embed/embed.min.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const reviewStats = [
    {
      icon: FiStar,
      value: "4.9",
      label: "Average Rating",
      description: "Based on listener feedback"
    },
    {
      icon: FiUsers,
      value: "1,200+",
      label: "Reviews",
      description: "From our community"
    },
    {
      icon: FiHeart,
      value: "98%",
      label: "Would Recommend",
      description: "To other culinary professionals"
    },
    {
      icon: FiMessageSquare,
      value: "500+",
      label: "Success Stories",
      description: "Kitchen transformations"
    }
  ];

  const testimonialHighlights = [
    {
      quote: "Chef Life Radio completely transformed how I approach kitchen leadership. The practical advice is invaluable.",
      author: "Sarah Martinez",
      role: "Executive Chef",
      restaurant: "Coastal Kitchen"
    },
    {
      quote: "Finally, a podcast that understands the real challenges of kitchen culture. Adam's insights are game-changing.",
      author: "Michael Chen",
      role: "Restaurant Owner",
      restaurant: "Chen's Bistro"
    },
    {
      quote: "The leadership strategies from this show helped me reduce turnover by 60% in just six months.",
      author: "Jennifer Lopez",
      role: "Sous Chef",
      restaurant: "Garden Fresh Restaurant"
    }
  ];

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      className="min-h-screen bg-white py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{opacity: 0, y: 50}}
          animate={{opacity: 1, y: 0}}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-display font-bold text-brand-black mb-6">
            What Our Community Says
          </h1>
          <p className="text-xl text-brand-gray max-w-3xl mx-auto font-sans">
            Real feedback from real culinary professionals who are transforming their kitchen culture with Chef Life Radio.
          </p>
        </motion.div>

        {/* Review Stats */}
        <motion.div
          initial={{opacity: 0, y: 50}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.2}}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
        >
          {reviewStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{opacity: 0, y: 50}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: index * 0.1}}
              className="bg-white rounded-xl shadow-lg p-6 text-center border hover:shadow-xl transition-shadow"
            >
              <div className="bg-brand-red p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <SafeIcon icon={stat.icon} className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-heading font-bold text-brand-black mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-heading font-semibold text-brand-black mb-1">
                {stat.label}
              </div>
              <p className="text-sm text-brand-gray font-sans">{stat.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Testimonials */}
        <motion.div
          initial={{opacity: 0, y: 50}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.4}}
          className="mb-16"
        >
          <h2 className="text-3xl font-heading font-bold text-brand-black text-center mb-8">
            Featured Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialHighlights.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{opacity: 0, y: 50}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.5 + index * 0.1}}
                className="bg-gray-50 rounded-xl p-6 border"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <SafeIcon key={i} icon={FiStar} className="h-5 w-5 text-brand-gold fill-current" />
                  ))}
                </div>
                <blockquote className="text-brand-black font-sans mb-4 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="border-t pt-4">
                  <div className="font-heading font-semibold text-brand-black">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-brand-gray font-sans">
                    {testimonial.role} • {testimonial.restaurant}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Feedspace Reviews Section */}
        <motion.div
          initial={{opacity: 0, y: 50}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.6}}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-brand-black mb-4">
              Podcast Reviews & Feedback
            </h2>
            <p className="text-lg text-brand-gray font-sans max-w-2xl mx-auto">
              See what listeners are saying about Chef Life Radio episodes and share your own experience.
            </p>
          </div>

          {/* First Feedspace Embed */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border">
            <div className="flex items-center space-x-3 mb-6">
              <SafeIcon icon={FiMic} className="h-6 w-6 text-brand-red" />
              <h3 className="text-xl font-heading font-semibold text-brand-black">
                Episode Reviews & Ratings
              </h3>
            </div>
            <div 
              className="feedspace-embed" 
              data-id="c42e41ae-3098-4247-be3d-f49e68515e44"
            ></div>
          </div>

          {/* Second Feedspace Embed */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border">
            <div className="flex items-center space-x-3 mb-6">
              <SafeIcon icon={FiVideo} className="h-6 w-6 text-brand-red" />
              <h3 className="text-xl font-heading font-semibold text-brand-black">
                Video Content Feedback
              </h3>
            </div>
            <div 
              className="feedspace-embed" 
              data-id="05f27e39-67a0-4eae-abb0-f80598694321"
            ></div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{opacity: 0, y: 50}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.8}}
          className="bg-brand-red rounded-2xl p-8 text-white text-center"
        >
          <h2 className="text-3xl font-display font-bold mb-4">
            Join Our Community of Leaders
          </h2>
          <p className="text-xl mb-6 font-sans opacity-90">
            Ready to transform your kitchen culture? Start listening today and see why thousands of culinary professionals trust Chef Life Radio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/#/subscribe"
              className="bg-white text-brand-red hover:bg-gray-100 px-8 py-3 rounded-lg font-heading font-semibold transition-colors inline-flex items-center justify-center space-x-2"
            >
              <SafeIcon icon={FiMic} className="h-5 w-5" />
              <span>Subscribe to Podcast</span>
            </a>
            <a
              href="/#/contact"
              className="bg-brand-gold hover:bg-yellow-600 text-brand-black px-8 py-3 rounded-lg font-heading font-semibold transition-colors inline-flex items-center justify-center space-x-2"
            >
              <SafeIcon icon={FiMessageSquare} className="h-5 w-5" />
              <span>Share Your Story</span>
            </a>
          </div>
        </motion.div>

        {/* Review Guidelines */}
        <motion.div
          initial={{opacity: 0, y: 50}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 1}}
          className="mt-16 bg-gray-50 rounded-xl p-6 text-center"
        >
          <h3 className="text-lg font-heading font-semibold text-brand-black mb-3">
            Review Guidelines
          </h3>
          <p className="text-brand-gray font-sans text-sm max-w-2xl mx-auto">
            We value honest, constructive feedback from our community. Please keep reviews respectful and focused on your experience with our content. All reviews are moderated to ensure a positive environment for everyone.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Reviews;