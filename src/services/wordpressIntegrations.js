// Complete WordPress Integrations Service
import supabase from '../lib/supabase';
import crmService from './crmService';

class WordPressIntegrations {
  constructor() {
    this.wpApiUrl = import.meta.env.VITE_WORDPRESS_API_URL || 'https://podcast.cheflifemedia.com/wp-json/clr/v1/';
    this.wpSiteUrl = import.meta.env.VITE_WORDPRESS_SITE_URL || 'https://podcast.cheflifemedia.com';
    
    // Integration configs
    this.integrations = {
      surefeedback: {
        siteId: import.meta.env.VITE_SUREFEEDBACK_SITE_ID,
        apiKey: import.meta.env.VITE_SUREFEEDBACK_API_KEY,
        enabled: !!import.meta.env.VITE_SUREFEEDBACK_SITE_ID
      },
      sureforms: {
        siteId: import.meta.env.VITE_SUREFORMS_SITE_ID,
        apiKey: import.meta.env.VITE_SUREFORMS_API_KEY,
        enabled: !!import.meta.env.VITE_SUREFORMS_SITE_ID
      },
      prestoplayer: {
        licenseKey: import.meta.env.VITE_PRESTOPLAYER_LICENSE_KEY,
        siteUrl: import.meta.env.VITE_PRESTOPLAYER_SITE_URL,
        enabled: !!import.meta.env.VITE_PRESTOPLAYER_LICENSE_KEY
      },
      suredash: {
        siteId: import.meta.env.VITE_SUREDASH_SITE_ID,
        apiKey: import.meta.env.VITE_SUREDASH_API_KEY,
        enabled: !!import.meta.env.VITE_SUREDASH_API_KEY
      }
    };
  }

  // ===== SUREFEEDBACK INTEGRATION =====
  
  async submitEpisodeFeedback(feedbackData) {
    try {
      console.log('📝 Submitting episode feedback:', feedbackData);
      
      // Store in local database first
      const { data, error } = await supabase
        .from('episode_feedback_clr2025')
        .insert([{
          episode_id: feedbackData.episodeId,
          episode_title: feedbackData.episodeTitle,
          feedback_text: feedbackData.feedback,
          rating: feedbackData.rating,
          user_email: feedbackData.email,
          user_name: feedbackData.name,
          feedback_type: feedbackData.type || 'general',
          source_platform: 'react_app'
        }])
        .select()
        .single();

      if (error) throw error;

      // Send to WordPress SureFeedback if configured
      if (this.integrations.surefeedback.enabled) {
        await this.sendToWordPressFeedback(feedbackData);
      }

      // Track the feedback submission
      crmService.trackConversionEvent('episode_feedback_submitted', {
        episode_id: feedbackData.episodeId,
        rating: feedbackData.rating,
        feedback_type: feedbackData.type
      });

      return { success: true, data };
    } catch (error) {
      console.error('❌ Feedback submission failed:', error);
      return { success: false, error: error.message };
    }
  }

  async getFeedbackForEpisode(episodeId, approved = false) {
    try {
      let query = supabase
        .from('episode_feedback_clr2025')
        .select('*')
        .eq('episode_id', episodeId)
        .order('created_at', { ascending: false });

      if (approved) {
        query = query.eq('is_approved', true);
      }

      const { data, error } = await query;
      if (error) throw error;

      return { success: true, feedback: data };
    } catch (error) {
      console.error('❌ Error fetching feedback:', error);
      return { success: false, error: error.message };
    }
  }

  async getTestimonials(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('episode_feedback_clr2025')
        .select('*')
        .eq('is_testimonial', true)
        .eq('is_approved', true)
        .order('rating', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { success: true, testimonials: data };
    } catch (error) {
      console.error('❌ Error fetching testimonials:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== SUREFORMS INTEGRATION =====

  async submitAdvancedForm(formData) {
    try {
      console.log('📋 Submitting advanced form:', formData.formType);

      // Store in local database
      const { data, error } = await supabase
        .from('advanced_form_submissions_clr2025')
        .insert([{
          form_type: formData.formType,
          form_data: formData.data,
          user_email: formData.email,
          user_name: formData.name,
          inquiry_priority: formData.priority || 'normal',
          suremail_list_id: this.getSuremailListForForm(formData.formType)
        }])
        .select()
        .single();

      if (error) throw error;

      // Route to appropriate Suremail list
      await this.routeFormToSuremail(formData);

      // Send to WordPress SureForms if configured
      if (this.integrations.sureforms.enabled) {
        await this.sendToWordPressForms(formData);
      }

      // Track the form submission
      crmService.trackConversionEvent('advanced_form_submitted', {
        form_type: formData.formType,
        priority: formData.priority
      });

      return { success: true, data };
    } catch (error) {
      console.error('❌ Advanced form submission failed:', error);
      return { success: false, error: error.message };
    }
  }

  getSuremailListForForm(formType) {
    const listMapping = {
      'speaking': 'membership',
      'guest': 'contact',
      'consultation': 'membership',
      'collaboration': 'contact',
      'media': 'contact',
      'feedback': 'newsletter'
    };
    return listMapping[formType] || 'contact';
  }

  async routeFormToSuremail(formData) {
    const listType = this.getSuremailListForForm(formData.formType);
    
    const suremailData = {
      firstName: formData.name,
      email: formData.email,
      sourcePage: `form_${formData.formType}`,
      tags: [`form-${formData.formType}`, 'advanced-form', formData.priority || 'normal'],
      conversionSource: 'advanced_form'
    };

    // Route to appropriate CRM function based on form type
    if (formData.formType === 'speaking' || formData.formType === 'consultation') {
      // High-value leads
      return await crmService.subscribeToLeadMagnet(suremailData);
    } else {
      return await crmService.subscribeToNewsletter(suremailData);
    }
  }

  // ===== PRESTOPLAYER INTEGRATION =====

  async getVideoContent(filters = {}) {
    try {
      let query = supabase
        .from('video_content_clr2025')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (filters.episodeId) {
        query = query.eq('episode_id', filters.episodeId);
      }
      if (filters.videoType) {
        query = query.eq('video_type', filters.videoType);
      }
      if (filters.featured) {
        query = query.eq('featured', true);
      }

      const { data, error } = await query;
      if (error) throw error;

      return { success: true, videos: data };
    } catch (error) {
      console.error('❌ Error fetching video content:', error);
      return { success: false, error: error.message };
    }
  }

  async trackVideoEvent(videoId, eventData) {
    try {
      const { error } = await supabase
        .from('video_analytics_clr2025')
        .insert([{
          video_id: videoId,
          session_id: eventData.sessionId,
          user_email: eventData.userEmail,
          event_type: eventData.eventType,
          watch_time_seconds: eventData.watchTime,
          completion_percentage: eventData.completionPercentage,
          device_type: eventData.deviceType,
          referrer_url: window.location.href
        }]);

      if (error) throw error;

      // Track lead capture events
      if (eventData.eventType === 'lead_capture') {
        crmService.trackConversionEvent('video_lead_capture', {
          video_id: videoId,
          completion_percentage: eventData.completionPercentage
        });
      }

      return { success: true };
    } catch (error) {
      console.error('❌ Video tracking failed:', error);
      return { success: false, error: error.message };
    }
  }

  async getVideoAnalytics(videoId, timeframe = '7d') {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(timeframe.replace('d', '')));

      const { data, error } = await supabase
        .from('video_analytics_clr2025')
        .select('*')
        .eq('video_id', videoId)
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      // Process analytics data
      const analytics = {
        totalViews: data.filter(d => d.event_type === 'play').length,
        totalCompletions: data.filter(d => d.event_type === 'complete').length,
        averageWatchTime: data.reduce((acc, d) => acc + (d.watch_time_seconds || 0), 0) / data.length,
        leadCaptures: data.filter(d => d.event_type === 'lead_capture').length,
        completionRate: data.length > 0 ? (data.filter(d => d.event_type === 'complete').length / data.filter(d => d.event_type === 'play').length) * 100 : 0
      };

      return { success: true, analytics };
    } catch (error) {
      console.error('❌ Error fetching video analytics:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== SUREDASH ANALYTICS INTEGRATION =====

  async updateDashboardMetric(metricData) {
    try {
      const { error } = await supabase
        .from('analytics_dashboard_clr2025')
        .insert([{
          metric_name: metricData.name,
          metric_value: metricData.value,
          metric_type: metricData.type,
          category: metricData.category,
          subcategory: metricData.subcategory,
          period_type: metricData.periodType || 'daily',
          period_start: metricData.periodStart,
          period_end: metricData.periodEnd,
          metadata: metricData.metadata
        }]);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('❌ Dashboard metric update failed:', error);
      return { success: false, error: error.message };
    }
  }

  async getDashboardMetrics(category = null, timeframe = '30d') {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(timeframe.replace('d', '')));

      let query = supabase
        .from('analytics_dashboard_clr2025')
        .select('*')
        .gte('period_start', startDate.toISOString())
        .order('period_start', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;

      return { success: true, metrics: data };
    } catch (error) {
      console.error('❌ Error fetching dashboard metrics:', error);
      return { success: false, error: error.message };
    }
  }

  async getPerformanceMetrics() {
    try {
      const { data, error } = await supabase
        .from('performance_metrics_clr2025')
        .select('*')
        .order('last_updated', { ascending: false });

      if (error) throw error;
      return { success: true, metrics: data };
    } catch (error) {
      console.error('❌ Error fetching performance metrics:', error);
      return { success: false, error: error.message };
    }
  }

  async updatePerformanceMetric(sourceType, metricName, currentValue, targetValue = null) {
    try {
      // Get previous value
      const { data: existing } = await supabase
        .from('performance_metrics_clr2025')
        .select('current_value')
        .eq('source_type', sourceType)
        .eq('metric_name', metricName)
        .single();

      const previousValue = existing?.current_value || 0;
      const changePercentage = previousValue > 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0;

      // Determine status
      let status = 'normal';
      if (targetValue) {
        const progressPercentage = (currentValue / targetValue) * 100;
        if (progressPercentage >= 100) status = 'excellent';
        else if (progressPercentage >= 80) status = 'normal';
        else if (progressPercentage >= 60) status = 'warning';
        else status = 'critical';
      }

      const { error } = await supabase
        .from('performance_metrics_clr2025')
        .upsert([{
          source_type: sourceType,
          metric_name: metricName,
          current_value: currentValue,
          previous_value: previousValue,
          change_percentage: changePercentage,
          target_value: targetValue,
          status: status,
          last_updated: new Date().toISOString()
        }], { onConflict: 'source_type,metric_name' });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('❌ Performance metric update failed:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== WORDPRESS API INTEGRATION =====

  async sendToWordPressFeedback(feedbackData) {
    if (!this.integrations.surefeedback.enabled) return;

    try {
      const response = await fetch(`${this.wpApiUrl}surefeedback/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.integrations.surefeedback.apiKey}`
        },
        body: JSON.stringify(feedbackData)
      });

      if (!response.ok) throw new Error('WordPress feedback sync failed');
      return await response.json();
    } catch (error) {
      console.error('❌ WordPress feedback sync failed:', error);
    }
  }

  async sendToWordPressForms(formData) {
    if (!this.integrations.sureforms.enabled) return;

    try {
      const response = await fetch(`${this.wpApiUrl}sureforms/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.integrations.sureforms.apiKey}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('WordPress form sync failed');
      return await response.json();
    } catch (error) {
      console.error('❌ WordPress form sync failed:', error);
    }
  }

  // ===== UTILITY METHODS =====

  getIntegrationStatus() {
    return {
      surefeedback: {
        enabled: this.integrations.surefeedback.enabled,
        status: this.integrations.surefeedback.enabled ? 'connected' : 'not_configured'
      },
      sureforms: {
        enabled: this.integrations.sureforms.enabled,
        status: this.integrations.sureforms.enabled ? 'connected' : 'not_configured'
      },
      prestoplayer: {
        enabled: this.integrations.prestoplayer.enabled,
        status: this.integrations.prestoplayer.enabled ? 'connected' : 'not_configured'
      },
      suredash: {
        enabled: this.integrations.suredash.enabled,
        status: this.integrations.suredash.enabled ? 'connected' : 'not_configured'
      }
    };
  }

  async syncAllMetrics() {
    try {
      console.log('📊 Syncing all metrics to dashboard...');

      // Newsletter metrics
      const newsletterStats = await crmService.getSubscriberStats();
      if (newsletterStats.success) {
        await this.updateDashboardMetric({
          name: 'Total Subscribers',
          value: newsletterStats.stats.total,
          type: 'count',
          category: 'email',
          subcategory: 'newsletter',
          periodStart: new Date(Date.now() - 24 * 60 * 60 * 1000),
          periodEnd: new Date()
        });
      }

      // Feedback metrics
      const feedbackStats = await this.getFeedbackStats();
      if (feedbackStats.success) {
        await this.updatePerformanceMetric('surefeedback', 'Average Rating', feedbackStats.averageRating, 4.8);
        await this.updatePerformanceMetric('surefeedback', 'Feedback Count', feedbackStats.totalFeedback);
      }

      // Video metrics
      const videoStats = await this.getVideoStats();
      if (videoStats.success) {
        await this.updatePerformanceMetric('prestoplayer', 'Total Views', videoStats.totalViews);
        await this.updatePerformanceMetric('prestoplayer', 'Completion Rate', videoStats.completionRate, 70);
      }

      console.log('✅ All metrics synced successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Metrics sync failed:', error);
      return { success: false, error: error.message };
    }
  }

  async getFeedbackStats() {
    try {
      const { data, error } = await supabase
        .from('episode_feedback_clr2025')
        .select('rating');

      if (error) throw error;

      const averageRating = data.length > 0 
        ? data.reduce((acc, item) => acc + item.rating, 0) / data.length 
        : 0;

      return {
        success: true,
        totalFeedback: data.length,
        averageRating: Math.round(averageRating * 10) / 10
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getVideoStats() {
    try {
      const { data, error } = await supabase
        .from('video_analytics_clr2025')
        .select('event_type');

      if (error) throw error;

      const plays = data.filter(d => d.event_type === 'play').length;
      const completions = data.filter(d => d.event_type === 'complete').length;
      const completionRate = plays > 0 ? (completions / plays) * 100 : 0;

      return {
        success: true,
        totalViews: plays,
        completionRate: Math.round(completionRate * 10) / 10
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new WordPressIntegrations();