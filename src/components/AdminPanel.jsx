import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AdminHeader from './AdminHeader';
import supabase from '../lib/supabase';

const { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiLoader, FiEye, FiDatabase, FiUsers } = FiIcons;

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editingEpisode, setEditingEpisode] = useState(null);
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    totalEpisodes: 0,
    totalCategories: 0
  });

  const [newPost, setNewPost] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    status: 'draft',
    featured: false,
    external_url: '',
    read_time: '',
    author: 'Adam Lamb'
  });

  const [newEpisode, setNewEpisode] = useState({
    title: '',
    description: '',
    episode_number: '',
    season_number: 1,
    duration_minutes: '',
    guest_name: '',
    guest_title: '',
    featured_image_url: '',
    audio_url: '',
    status: 'draft'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [postsResponse, categoriesResponse, episodesResponse] = await Promise.all([
        supabase.from('blog_posts_clr2025').select('*').order('created_at', { ascending: false }),
        supabase.from('blog_categories_clr2025').select('*').order('name'),
        supabase.from('podcast_episodes_clr2025').select('*').order('created_at', { ascending: false })
      ]);

      const postsData = postsResponse.data || [];
      const categoriesData = categoriesResponse.data || [];
      const episodesData = episodesResponse.data || [];

      setPosts(postsData);
      setCategories(categoriesData);
      setEpisodes(episodesData);

      // Calculate stats
      setStats({
        totalPosts: postsData.length,
        publishedPosts: postsData.filter(p => p.status === 'published').length,
        totalEpisodes: episodesData.length,
        totalCategories: categoriesData.length
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSavePost = async (postData) => {
    try {
      if (editingPost && editingPost !== 'new') {
        const { error } = await supabase
          .from('blog_posts_clr2025')
          .update(postData)
          .eq('id', editingPost.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_posts_clr2025')
          .insert([{
            ...postData,
            published_at: postData.status === 'published' ? new Date().toISOString() : null
          }]);
        if (error) throw error;
      }
      
      setEditingPost(null);
      setNewPost({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: '',
        tags: [],
        status: 'draft',
        featured: false,
        external_url: '',
        read_time: '',
        author: 'Adam Lamb'
      });
      fetchData();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post. Please try again.');
    }
  };

  const handleSaveEpisode = async (episodeData) => {
    try {
      if (editingEpisode && editingEpisode !== 'new') {
        const { error } = await supabase
          .from('podcast_episodes_clr2025')
          .update(episodeData)
          .eq('id', editingEpisode.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('podcast_episodes_clr2025')
          .insert([{
            ...episodeData,
            published_at: episodeData.status === 'published' ? new Date().toISOString() : null
          }]);
        if (error) throw error;
      }
      
      setEditingEpisode(null);
      setNewEpisode({
        title: '',
        description: '',
        episode_number: '',
        season_number: 1,
        duration_minutes: '',
        guest_name: '',
        guest_title: '',
        featured_image_url: '',
        audio_url: '',
        status: 'draft'
      });
      fetchData();
    } catch (error) {
      console.error('Error saving episode:', error);
      alert('Error saving episode. Please try again.');
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const { error } = await supabase
          .from('blog_posts_clr2025')
          .delete()
          .eq('id', postId);
        if (error) throw error;
        fetchData();
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting post. Please try again.');
      }
    }
  };

  const handleDeleteEpisode = async (episodeId) => {
    if (window.confirm('Are you sure you want to delete this episode?')) {
      try {
        const { error } = await supabase
          .from('podcast_episodes_clr2025')
          .delete()
          .eq('id', episodeId);
        if (error) throw error;
        fetchData();
      } catch (error) {
        console.error('Error deleting episode:', error);
        alert('Error deleting episode. Please try again.');
      }
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const PostForm = ({ post, onSave, onCancel }) => {
    const [formData, setFormData] = useState(post || newPost);

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
        ...(name === 'title' && { slug: generateSlug(value) })
      }));
    };

    const handleTagsChange = (e) => {
      const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
      setFormData(prev => ({ ...prev, tags }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-heading font-bold">
              {post ? 'Edit Post' : 'Create New Post'}
            </h3>
            <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
              <SafeIcon icon={FiX} className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.filter(cat => cat.slug !== 'all').map(cat => (
                    <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Read Time</label>
                <input
                  type="text"
                  name="read_time"
                  value={formData.read_time}
                  onChange={handleChange}
                  placeholder="e.g., 5 min read"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">External URL</label>
              <input
                type="url"
                name="external_url"
                value={formData.external_url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags?.join(',') || ''}
                onChange={handleTagsChange}
                placeholder="Leadership, Management, Culture"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-700">Featured Post</label>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-brand-red hover:bg-red-800 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
              >
                <SafeIcon icon={FiSave} className="h-4 w-4" />
                <span>Save Post</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    );
  };

  const EpisodeForm = ({ episode, onSave, onCancel }) => {
    const [formData, setFormData] = useState(episode || newEpisode);

    const handleChange = (e) => {
      const { name, value, type } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value) || '' : value
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-heading font-bold">
              {episode ? 'Edit Episode' : 'Create New Episode'}
            </h3>
            <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
              <SafeIcon icon={FiX} className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Episode Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Episode #</label>
                <input
                  type="number"
                  name="episode_number"
                  value={formData.episode_number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Season</label>
                <input
                  type="number"
                  name="season_number"
                  value={formData.season_number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                <input
                  type="number"
                  name="duration_minutes"
                  value={formData.duration_minutes}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
                <input
                  type="text"
                  name="guest_name"
                  value={formData.guest_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guest Title</label>
                <input
                  type="text"
                  name="guest_title"
                  value={formData.guest_title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
                <input
                  type="url"
                  name="featured_image_url"
                  value={formData.featured_image_url}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Audio URL</label>
                <input
                  type="url"
                  name="audio_url"
                  value={formData.audio_url}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-brand-red hover:bg-red-800 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
              >
                <SafeIcon icon={FiSave} className="h-4 w-4" />
                <span>Save Episode</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 flex items-center justify-center">
        <SafeIcon icon={FiLoader} className="h-12 w-12 text-brand-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiDatabase} className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-brand-black">{stats.totalPosts}</p>
                <p className="text-sm text-brand-gray font-sans">Total Posts</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiEye} className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-brand-black">{stats.publishedPosts}</p>
                <p className="text-sm text-brand-gray font-sans">Published</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiUsers} className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold text-brand-black">{stats.totalEpisodes}</p>
                <p className="text-sm text-brand-gray font-sans">Episodes</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiDatabase} className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-brand-black">{stats.totalCategories}</p>
                <p className="text-sm text-brand-gray font-sans">Categories</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="flex border-b">
            {[
              { id: 'posts', label: 'Blog Posts', count: posts.length },
              { id: 'episodes', label: 'Episodes', count: episodes.length },
              { id: 'categories', label: 'Categories', count: categories.length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-b-2 border-brand-red text-brand-red'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.label}</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Tab */}
        {activeTab === 'posts' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-heading font-semibold">Blog Posts</h2>
              <button
                onClick={() => setEditingPost('new')}
                className="bg-brand-red hover:bg-red-800 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
              >
                <SafeIcon icon={FiPlus} className="h-4 w-4" />
                <span>New Post</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Published
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map(post => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {post.title}
                              {post.featured && (
                                <span className="ml-2 bg-brand-gold text-brand-black px-2 py-1 rounded-full text-xs">
                                  Featured
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{post.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                          {categories.find(cat => cat.slug === post.category)?.name || post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          post.status === 'published' ? 'bg-green-100 text-green-800' :
                          post.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.published_at ? new Date(post.published_at).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {post.external_url && (
                            <button
                              onClick={() => window.open(post.external_url, '_blank')}
                              className="text-brand-red hover:text-red-800"
                            >
                              <SafeIcon icon={FiEye} className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setEditingPost(post)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <SafeIcon icon={FiEdit2} className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Episodes Tab */}
        {activeTab === 'episodes' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-heading font-semibold">Podcast Episodes</h2>
              <button
                onClick={() => setEditingEpisode('new')}
                className="bg-brand-red hover:bg-red-800 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
              >
                <SafeIcon icon={FiPlus} className="h-4 w-4" />
                <span>New Episode</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Episode
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guest
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {episodes.map(episode => (
                    <tr key={episode.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Episode {episode.episode_number}: {episode.title}
                          </div>
                          <div className="text-sm text-gray-500">Season {episode.season_number}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{episode.guest_name || '-'}</div>
                        <div className="text-sm text-gray-500">{episode.guest_title || ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {episode.duration_minutes} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          episode.status === 'published' ? 'bg-green-100 text-green-800' :
                          episode.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {episode.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setEditingEpisode(episode)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <SafeIcon icon={FiEdit2} className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEpisode(episode.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Show Post Form */}
        {editingPost && (
          <PostForm
            post={editingPost === 'new' ? null : editingPost}
            onSave={handleSavePost}
            onCancel={() => setEditingPost(null)}
          />
        )}

        {/* Show Episode Form */}
        {editingEpisode && (
          <EpisodeForm
            episode={editingEpisode === 'new' ? null : editingEpisode}
            onSave={handleSaveEpisode}
            onCancel={() => setEditingEpisode(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;