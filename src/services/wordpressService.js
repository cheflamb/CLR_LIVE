// WordPress Integration Service
class WordPressService {
  constructor() {
    this.wpApiUrl = import.meta.env.VITE_WORDPRESS_API_URL || 'https://podcast.cheflifemedia.com/wp-json/clr/v1/';
    this.wpSiteUrl = import.meta.env.VITE_WORDPRESS_SITE_URL || 'https://podcast.cheflifemedia.com';
  }

  // SureFeedback Integration
  async submitEpisodeFeedback(episodeId, feedback, rating, email = '') {
    try {
      const response = await fetch(`${this.wpApiUrl}feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          episode_id: episodeId,
          feedback: feedback,
          rating: rating,
          email: email,
          source: 'react_app',
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Feedback submission failed');
      
      const result = await response.json();
      console.log('✅ Feedback submitted successfully:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ Feedback submission failed:', error);
      return { success: false, error: error.message };
    }
  }

  // SureForms Integration
  async submitAdvancedContactForm(formData) {
    try {
      const response = await fetch(`${this.wpApiUrl}forms/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'react_app',
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Form submission failed');
      
      const result = await response.json();
      console.log('✅ Advanced form submitted successfully:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ Advanced form submission failed:', error);
      return { success: false, error: error.message };
    }
  }

  // PrestoPlayer Integration
  async getEpisodeVideos(episodeId) {
    try {
      const response = await fetch(`${this.wpApiUrl}episodes/${episodeId}/videos`);
      
      if (!response.ok) throw new Error('Failed to fetch episode videos');
      
      const videos = await response.json();
      console.log('✅ Episode videos fetched:', videos);
      return { success: true, videos };
    } catch (error) {
      console.error('❌ Failed to fetch episode videos:', error);
      return { success: false, error: error.message };
    }
  }

  // SureDash Analytics Integration
  async getAnalyticsSummary() {
    try {
      const response = await fetch(`${this.wpApiUrl}analytics/summary`);
      
      if (!response.ok) throw new Error('Failed to fetch analytics');
      
      const analytics = await response.json();
      console.log('✅ Analytics fetched:', analytics);
      return { success: true, analytics };
    } catch (error) {
      console.error('❌ Failed to fetch analytics:', error);
      return { success: false, error: error.message };
    }
  }

  // Get WordPress podcast episodes
  async getWordPressPosts(postType = 'podcast_episode', limit = 10) {
    try {
      const response = await fetch(`${this.wpSiteUrl}/wp-json/wp/v2/${postType}?per_page=${limit}&_embed`);
      
      if (!response.ok) throw new Error('Failed to fetch WordPress posts');
      
      const posts = await response.json();
      console.log('✅ WordPress posts fetched:', posts.length);
      return { success: true, posts };
    } catch (error) {
      console.error('❌ Failed to fetch WordPress posts:', error);
      return { success: false, error: error.message };
    }
  }

  // Sync data between React app and WordPress
  async syncEpisodeData(episodeData) {
    try {
      const response = await fetch(`${this.wpApiUrl}episodes/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          episode_data: episodeData,
          source: 'react_app',
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Episode sync failed');
      
      const result = await response.json();
      console.log('✅ Episode data synced successfully:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ Episode sync failed:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new WordPressService();