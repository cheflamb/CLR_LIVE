import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHeart, FiTarget, FiUsers, FiMic, FiArrowRight } = FiIcons;

const About = () => {
  const beliefs = [
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
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-display font-bold mb-6 text-brand-black">Chef Life Radio</h1>
            <p className="text-2xl text-brand-red font-heading font-semibold mb-8">
              Empowering Culinary Leaders to Build Thriving, Sustainable Kitchens
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="https://podcast.cheflifemedia.com/wp-content/uploads/2025/04/1-1.png"
                alt="Chef Adam Lamb - Host"
                className="rounded-2xl shadow-2xl w-full"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-display font-bold text-brand-black mb-6">We at Chef Life Radio believe that:</h2>
              <div className="space-y-4 text-lg font-sans text-brand-black">
                <p><strong>Working in a kitchen should be demanding;</strong> it shouldn't have to be demeaning.</p>
                <p><strong>It should be hard,</strong> it just doesn't have to be harsh.</p>
                <p>We believe that it's possible to have <strong className="text-brand-red">more solidarity</strong> and less 'suck it up sunshine.'</p>
                <p><strong className="text-brand-red">More compassion</strong> and less CutThroat Island.</p>
                <p>We believe in <strong className="text-brand-red">more partnership</strong> and less 'put up or shut up.'</p>
                <p><strong className="text-brand-red">More community</strong> and less... well, you know.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto border">
              <blockquote className="text-2xl font-sans text-brand-black leading-relaxed mb-6">
                Chef Life Radio is more than a podcast—it's a <strong className="text-brand-red">leadership platform</strong> for chefs and culinary professionals who are ready to do things differently.
              </blockquote>
              <p className="text-lg font-sans text-brand-gray">
                We're here to give you the tools, insights, and mindset to lead with confidence, build resilient teams, and reclaim your passion for the craft.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Beliefs Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {beliefs.map((belief, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-8 text-center border hover:shadow-xl transition-shadow"
              >
                <div className="bg-brand-red p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <SafeIcon icon={belief.icon} className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-brand-black mb-3">{belief.title}</h3>
                <p className="text-brand-gray font-sans">{belief.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-display font-bold text-brand-black mb-6">Our Story</h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg font-sans text-brand-gray mb-6 leading-relaxed">
                Whether you're a seasoned chef, a rising culinary star, or someone trying to make sense of the chaos behind the pass—this is your space to grow, reflect, and thrive.
              </p>
              <p className="text-lg font-sans text-brand-gray mb-6 leading-relaxed">
                Hosted by <strong className="text-brand-red">Chef Adam Lamb</strong>, each episode blends hard-won experience with fresh strategies that address the real-world challenges of modern kitchens.
              </p>
            </div>
          </motion.div>

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
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-brand-gold p-3 rounded-lg">
                  <SafeIcon icon={FiMic} className="h-6 w-6 text-brand-black" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-brand-black">Chef Adam Lamb</h4>
                  <p className="text-brand-red font-sans">Host & Founder</p>
                </div>
              </div>
              <p className="text-lg font-sans text-brand-gray leading-relaxed">
                With decades of experience in professional kitchens, Chef Adam understands the unique challenges facing culinary leaders today. His mission is to transform kitchen culture through authentic leadership and sustainable practices.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Kitchen Staff Image */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <img
              src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1750773481632-1.png"
              alt="Kitchen Staff Working Together"
              className="rounded-2xl shadow-lg w-full max-w-4xl mx-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="py-16 bg-brand-red text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-display font-bold mb-6">Our Vision</h2>
            <p className="text-2xl font-sans mb-8 max-w-3xl mx-auto">
              This is about creating culture, not just controlling chaos.
            </p>
            <p className="text-lg font-sans mb-8 max-w-3xl mx-auto opacity-90">
              So if you're tired of the grind-for-survival mindset and ready to step into purpose-driven leadership—
            </p>
            <div className="mb-8">
              <h3 className="text-3xl font-display font-bold text-brand-gold mb-4">Welcome to the movement.</h3>
            </div>
            <Link
              to="/subscribe"
              className="bg-brand-gold hover:bg-yellow-600 text-brand-black px-8 py-4 rounded-lg font-heading font-semibold transition-colors inline-flex items-center space-x-2"
            >
              <span>Join the Movement</span>
              <SafeIcon icon={FiArrowRight} className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Final Message */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-display font-bold text-brand-black mb-6">Stay Tall & Frosty, Y'all.</h2>
            <p className="text-xl font-sans text-brand-gray">
              Ready to transform your kitchen culture? Start listening today.
            </p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default About;