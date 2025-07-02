import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AdminHeader from './AdminHeader';
import supabase from '../lib/supabase';

const {FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiLoader, FiEye, FiDatabase, FiUsers, FiVideo, FiPlay, FiUpload} = FiIcons;

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editingEpisode, setEditingEpisode] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    totalEpisodes: 0,
    totalVideos: 0,
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

  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    video_type: 'youtube',
    episode_id: '',
    duration_seconds: '',
    featured: false,
    is_published: true,
    lead_magnet_enabled: false,
    lead_magnet_title: '',
    tags: []
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [postsResponse, categoriesResponse, episodesResponse, videosResponse] = await Promise.all([
        supabase.from('blog_posts_clr2025').select('*').order('created_at', {ascending: false}),
        supabase.from('blog_categories_clr2025').select('*').order('name'),
        supabase.from('podcast_episodes_clr2025').select('*').order('created_at', {ascending: false}),
        supabase.from('video_content_clr2025').select('*').order('created_at', {ascending: false})
      ]);

      const postsData = postsResponse.data || [];
      const categoriesData = categoriesResponse.data || [];
      const episodesData = episodesResponse.data || [];
      const videosData = videosResponse.data || [];

      setPosts(postsData);
      setCategories(categoriesData);
      setEpisodes(episodesData);
      setVideos(videosData);

      // Calculate stats
      setStats({
        totalPosts: postsData.length,
        publishedPosts: postsData.filter(p => p.status === 'published').length,
        totalEpisodes: episodesData.length,
        totalVideos: videosData.length,
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
        const {error} = await supabase
          .from('blog_posts_clr2025')
          .update(postData)
          .eq('id', editingPost.id);
        if (error) throw error;
      } else {
        const {error} = await supabase
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
        const {error} = await supabase
          .from('podcast_episodes_clr2025')
          .update(episodeData)
          .eq('id', editingEpisode.id);
        if (error) throw error;
      } else {
        const {error} = await supabase
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

  const handleSaveVideo = async (videoData) => {
    try {
      // Process YouTube URL to get video ID and generate thumbnail
      const processedVideoData = processVideoData(videoData);

      if (editingVideo && editingVideo !== 'new') {
        const {error} = await supabase
          .from('video_content_clr2025')
          .update(processedVideoData)
          .eq('id', editingVideo.id);
        if (error) throw error;
      } else {
        const {error} = await supabase
          .from('video_content_clr2025')
          .insert([{
            ...processedVideoData,
            view_count: 0,
            created_at: new Date().toISOString()
          }]);
        if (error) throw error;
      }

      setEditingVideo(null);
      setNewVideo({
        title: '',
        description: '',
        video_url: '',
        thumbnail_url: '',
        video_type: 'youtube',
        episode_id: '',
        duration_seconds: '',
        featured: false,
        is_published: true,
        lead_magnet_enabled: false,
        lead_magnet_title: '',
        tags: []
      });
      fetchData();
    } catch (error) {
      console.error('Error saving video:', error);
      alert('Error saving video. Please try again.');
    }
  };

  const processVideoData = (videoData) => {
    let processedData = {...videoData};

    // Extract YouTube video ID and generate thumbnail
    if (videoData.video_type === 'youtube' && videoData.video_url) {
      const videoId = extractYouTubeVideoId(videoData.video_url);
      if (videoId) {
        processedData.video_id = videoId;
        // Auto-generate thumbnail if not provided
        if (!videoData.thumbnail_url) {
          processedData.thumbnail_url = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
        // Ensure URL is in embed format
        processedData.video_url = `https://www.youtube.com/embed/${videoId}`;
      }
    }

    return processedData;
  };

  const extractYouTubeVideoId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const {error} = await supabase
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
        const {error} = await supabase
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

  const handleDeleteVideo = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        const {error} = await supabase
          .from('video_content_clr2025')
          .delete()
          .eq('id', videoId);
        if (error) throw error;
        fetchData();
      } catch (error) {
        console.error('Error deleting video:', error);
        alert('Error deleting video. Please try again.');
      }
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const VideoForm = ({video, onSave, onCancel}) => {
    const [formData, setFormData] = useState(video || newVideo);

    const handleChange = (e) => {
      const {name, value, type, checked} = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };

    const handleTagsChange = (e) => {
      const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
      setFormData(prev => ({...prev, tags}));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    const handleUrlPreview = () => {
      if (formData.video_url && formData.video_type === 'youtube') {
        const videoId = extractYouTubeVideoId(formData.video_url);
        if (videoId) {
          const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
          setFormData(prev => ({
            ...prev,
            thumbnail_url: thumbnailUrl,
            video_id: videoId
          }));
        }
      }
    };

    return (
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-heading font-bold">
              {video ? 'Edit Video' : 'Add New Video'}
            </h3>
            <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
              <SafeIcon icon={FiX} className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Video Title</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Video Type</label>
                <select
                  name="video_type"
                  value={formData.video_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                >
                  <option value="youtube">YouTube</option>
                  <option value="vimeo">Vimeo</option>
                  <option value="direct">Direct Upload</option>
                  <option value="live_stream">Live Stream</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (seconds)</label>
                <input
                  type="number"
                  name="duration_seconds"
                  value={formData.duration_seconds}
                  onChange={handleChange}
                  placeholder="e.g., 1200 (20 minutes)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                />
              </div>
            </div>

            {/* Video URL with Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={handleUrlPreview}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Preview
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Supports: YouTube watch URLs, youtu.be short URLs, or direct video IDs
              </p>
            </div>

            {/* Thumbnail URL with Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
              <input
                type="url"
                name="thumbnail_url"
                value={formData.thumbnail_url}
                onChange={handleChange}
                placeholder="Auto-generated for YouTube videos"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
              />
              {formData.thumbnail_url && (
                <div className="mt-2">
                  <img 
                    src={formData.thumbnail_url} 
                    alt="Thumbnail preview" 
                    className="w-32 h-18 object-cover rounded border"
                    onError={(e) => {e.target.style.display = 'none'}} 
                  />
                </div>
              )}
            </div>

            {/* Description */}
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

            {/* Episode Association */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Associated Episode (Optional)</label>
              <select
                name="episode_id"
                value={formData.episode_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
              >
                <option value="">No associated episode</option>
                {episodes.map(episode => (
                  <option key={episode.id} value={episode.id}>
                    Episode {episode.episode_number}: {episode.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags?.join(', ') || ''}
                onChange={handleTagsChange}
                placeholder="leadership, kitchen culture, interview"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
              />
            </div>

            {/* Lead Magnet Settings */}
            <div className="border-t pt-4">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Lead Capture Settings</h4>
              
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  name="lead_magnet_enabled"
                  checked={formData.lead_magnet_enabled}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">Enable lead capture overlay</label>
              </div>

              {formData.lead_magnet_enabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lead Magnet Title</label>
                  <input
                    type="text"
                    name="lead_magnet_title"
                    value={formData.lead_magnet_title}
                    onChange={handleChange}
                    placeholder="Get Our Free Kitchen Leadership Guide"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  />
                </div>
              )}
            </div>

            {/* Status Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">Featured Video</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">Published</label>
              </div>
            </div>

            {/* Action Buttons */}
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
                <span>Save Video</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    );
  };

  const PostForm = ({post, onSave, onCancel}) => {
    const [formData, setFormData] = useState(post || newPost);

    const handleChange = (e) => {
      const {name, value, type, checked} = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
        ...(name === 'title' && {slug: generateSlug(value)})
      }));
    };

    const handleTagsChange = (e) => {
      const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
      setFormData(prev => ({...prev, tags}));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
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

  const EpisodeForm = ({episode, onSave, onCancel}) => {
    const [formData, setFormData] = useState(episode || newEpisode);

    const handleChange = (e) => {
      const {name, value, type} = e.target;
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
        initial={{opacity: 0}}
        animate={{opacity: 1}}
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
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
              <SafeIcon icon={FiVideo} className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-brand-black">{stats.totalVideos}</p>
                <p className="text-sm text-brand-gray font-sans">Videos</p>
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
              {id: 'posts', label: 'Blog Posts', count: posts.length},
              {id: 'episodes', label: 'Episodes', count: episodes.length},
              {id: 'videos', label: 'Videos', count: videos.length},
              {id: 'categories', label: 'Categories', count: categories.length}
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
                          post.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : post.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
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
                          episode.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : episode.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
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

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-heading font-semibold">Video Content</h2>
              <button
                onClick={() => setEditingVideo('new')}
                className="bg-brand-red hover:bg-red-800 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
              >
                <SafeIcon icon={FiPlus} className="h-4 w-4" />
                <span>Add Video</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Video
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {videos.map(video => (
                    <tr key={video.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {video.thumbnail_url && (
                            <img
                              src={video.thumbnail_url}
                              alt={video.title}
                              className="w-16 h-9 object-cover rounded"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {video.title}
                              {video.featured && (
                                <span className="ml-2 bg-brand-gold text-brand-black px-2 py-1 rounded-full text-xs">
                                  Featured
                                </span>
                              )}
                              {video.lead_magnet_enabled && (
                                <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                  Lead Capture
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{video.description?.substring(0, 50)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                          {video.video_type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {video.duration_seconds ? `${Math.floor(video.duration_seconds / 60)}:${(video.duration_seconds % 60).toString().padStart(2, '0')}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          video.is_published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {video.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {video.view_count || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {video.video_url && (
                            <button
                              onClick={() => window.open(video.video_url.replace('/embed/', '/watch?v='), '_blank')}
                              className="text-brand-red hover:text-red-800"
                            >
                              <SafeIcon icon={FiPlay} className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setEditingVideo(video)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <SafeIcon icon={FiEdit2} className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteVideo(video.id)}
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

        {/* Show Video Form */}
        {editingVideo && (
          <VideoForm
            video={editingVideo === 'new' ? null : editingVideo}
            onSave={handleSaveVideo}
            onCancel={() => setEditingVideo(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;