import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiCalendar, FiClock, FiUser, FiArrowRight, FiSearch, FiTag, FiShare2, FiBookmark, FiLoader } = FiIcons;

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [blogPosts, setBlogPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories from Supabase
  const fetchCategories = async () => {
    try {
      console.log('🔄 Fetching categories...');
      const { data, error } = await supabase
        .from('blog_categories_clr2025')
        .select('*')
        .order('name');

      if (error) {
        console.error('❌ Categories error:', error);
        throw error;
      }

      console.log('✅ Categories fetched:', data);
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Don't set error for categories - continue with empty array
      setCategories([]);
    }
  };

  // Fetch blog posts from Supabase
  const fetchBlogPosts = async () => {
    try {
      console.log('🔄 Fetching blog posts...');
      
      // Test connection first
      const { data: testData, error: testError } = await supabase
        .from('blog_posts_clr2025')
        .select('count(*)', { count: 'exact', head: true });

      if (testError) {
        console.error('❌ Connection test failed:', testError);
        throw new Error(`Database connection failed: ${testError.message}`);
      }

      console.log('✅ Connection test passed, total posts:', testData);

      // Now fetch actual data
      const { data, error } = await supabase
        .from('blog_posts_clr2025')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) {
        console.error('❌ Blog posts error:', error);
        throw new Error(`Failed to fetch posts: ${error.message}`);
      }

      console.log('✅ Blog posts fetched:', data?.length || 0, 'posts');
      setBlogPosts(data || []);
      
      if (!data || data.length === 0) {
        setError('No published blog posts found. Posts may need to be created in the admin panel.');
      }

    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError(err.message || 'Failed to load blog posts');
      setBlogPosts([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([fetchCategories(), fetchBlogPosts()]);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load blog content. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find(post => post.featured);

  const handleReadMore = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
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
          <p className="text-brand-gray font-sans">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white py-16 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <SafeIcon icon={FiIcons.FiAlertTriangle} className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-heading font-semibold text-red-800 mb-2">
              Unable to Load Blog Posts
            </h3>
            <p className="text-red-600 font-sans mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-brand-red text-white px-4 py-2 rounded-lg font-sans hover:bg-red-800 transition-colors"
            >
              Try Again
            </button>
          </div>
          <div className="text-left">
            <h4 className="font-heading font-semibold text-brand-black mb-2">Troubleshooting:</h4>
            <ul className="text-sm text-brand-gray space-y-1 font-sans">
              <li>• Check your internet connection</li>
              <li>• Verify blog posts exist in admin panel</li>
              <li>• Ensure posts are marked as "published"</li>
              <li>• Contact support if issue persists</li>
            </ul>
          </div>
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
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-display font-bold text-brand-black mb-6">Leadership Insights</h1>
          <p className="text-xl text-brand-gray max-w-3xl mx-auto font-sans">
            Thought leadership, behind-the-scenes insights, and practical wisdom for culinary professionals ready to transform their kitchen culture.
          </p>
          <div className="mt-4">
            <span className="text-sm text-brand-gray font-sans">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} available
            </span>
          </div>
        </motion.div>

        {/* Debug Info - Only show if no posts */}
        {blogPosts.length === 0 && !error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-2 mb-2">
              <SafeIcon icon={FiIcons.FiInfo} className="h-5 w-5 text-yellow-600" />
              <h3 className="font-heading font-semibold text-yellow-800">No Blog Posts Found</h3>
            </div>
            <p className="text-yellow-700 text-sm font-sans mb-3">
              It looks like there are no published blog posts yet. Here's what you can do:
            </p>
            <ul className="text-yellow-700 text-sm font-sans space-y-1 ml-4">
              <li>• Go to the <a href="/#/admin" className="underline hover:text-yellow-900">Admin Panel</a> to create posts</li>
              <li>• Make sure posts are marked as "Published" status</li>
              <li>• Check that posts have a published_at date</li>
            </ul>
          </div>
        )}

        {/* Featured Post */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="bg-brand-red rounded-2xl p-8 lg:p-12 text-white shadow-2xl">
              <span className="bg-brand-gold text-brand-black px-3 py-1 rounded-full text-sm font-heading font-medium mb-4 inline-block">
                Featured Article
              </span>
              <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4 leading-tight">
                {featuredPost.title}
              </h2>
              <p className="text-lg text-white mb-6 opacity-90 font-sans">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center space-x-4 mb-6 text-sm">
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiUser} className="h-4 w-4" />
                  <span className="font-sans">{featuredPost.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiCalendar} className="h-4 w-4" />
                  <span className="font-sans">{formatDate(featuredPost.published_at)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiClock} className="h-4 w-4" />
                  <span className="font-sans">{featuredPost.read_time}</span>
                </div>
              </div>
              <button
                onClick={() => handleReadMore(featuredPost.external_url)}
                className="bg-white text-brand-red hover:bg-gray-100 px-6 py-3 rounded-lg font-heading font-semibold transition-colors flex items-center space-x-2"
              >
                <span>Read Full Article</span>
                <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Search and Filter */}
        {(categories.length > 0 || blogPosts.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 border">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 relative">
                  <SafeIcon icon={FiSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-gray h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent font-sans"
                  />
                </div>
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <button
                        key={category.slug}
                        onClick={() => setSelectedCategory(category.slug)}
                        className={`px-4 py-2 rounded-lg font-heading font-medium transition-colors ${
                          selectedCategory === category.slug
                            ? 'bg-brand-red text-white'
                            : 'bg-gray-100 text-brand-black hover:bg-gray-200'
                        }`}
                      >
                        {category.name} ({category.post_count || 0})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Articles Grid */}
        {filteredPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.filter(post => !post.featured).map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-brand-red text-white px-3 py-1 rounded-full text-sm font-heading font-medium">
                      {categories.find(cat => cat.slug === post.category)?.name || 'Article'}
                    </span>
                    <div className="flex space-x-2">
                      <button className="text-brand-gray hover:text-brand-red p-1 rounded-full transition-colors">
                        <SafeIcon icon={FiBookmark} className="h-4 w-4" />
                      </button>
                      <button className="text-brand-gray hover:text-brand-red p-1 rounded-full transition-colors">
                        <SafeIcon icon={FiShare2} className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-brand-black mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-brand-gray mb-4 line-clamp-3 font-sans">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-brand-gray mb-4">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiUser} className="h-4 w-4" />
                      <span className="font-sans">{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiClock} className="h-4 w-4" />
                      <span className="font-sans">{post.read_time}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {post.tags?.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-brand-gray px-2 py-1 rounded text-xs font-sans"
                        >
                          <SafeIcon icon={FiTag} className="h-3 w-3 inline mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleReadMore(post.external_url)}
                      className="text-brand-red hover:text-red-800 font-heading font-medium transition-colors flex items-center space-x-1"
                    >
                      <span>Read More</span>
                      <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredPosts.length === 0 && blogPosts.length > 0 && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-brand-gray mb-4">
              <SafeIcon icon={FiSearch} className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-brand-black mb-2">No articles found</h3>
            <p className="text-brand-gray font-sans">Try adjusting your search terms or category filter</p>
          </motion.div>
        )}

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-16 bg-gray-50 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-display font-bold text-brand-black mb-4">
            Join the Chef Life Radio Community
          </h3>
          <p className="text-brand-gray font-sans mb-6">
            Get weekly insights, leadership strategies, and exclusive content delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-red font-sans"
            />
            <button className="bg-brand-red hover:bg-red-800 text-white px-6 py-3 rounded-lg font-heading font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Blog;