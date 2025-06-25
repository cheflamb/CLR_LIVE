import axios from 'axios';
import supabase from '../lib/supabase';

// MailerSend Email Marketing Service
class MailerSendService {
  constructor() {
    this.apiToken = import.meta.env.VITE_MAILERSEND_API_TOKEN;
    this.apiUrl = import.meta.env.VITE_MAILERSEND_API_URL || 'https://api.mailersend.com/v1';
    this.domain = import.meta.env.VITE_MAILERSEND_DOMAIN;
    this.fromEmail = import.meta.env.VITE_MAILERSEND_FROM_EMAIL || 'adam@chefliferadio.com';
    this.fromName = import.meta.env.VITE_MAILERSEND_FROM_NAME || 'Chef Adam M Lamb';

    // Email template IDs (you'll create these in MailerSend)
    this.templates = {
      welcome: import.meta.env.VITE_MAILERSEND_WELCOME_TEMPLATE,
      leadMagnet: import.meta.env.VITE_MAILERSEND_LEADMAGNET_TEMPLATE,
      contactConfirmation: import.meta.env.VITE_MAILERSEND_CONTACT_TEMPLATE,
      membershipInvite: import.meta.env.VITE_MAILERSEND_MEMBERSHIP_TEMPLATE
    };
  }

  // Subscribe to newsletter with MailerSend
  async subscribeToNewsletter(data) {
    try {
      console.log('📧 Subscribing to newsletter with MailerSend:', data.email);

      // Add to local database first
      const { error: dbError } = await supabase
        .from('newsletter_subscriptions_clr2025')
        .insert([{
          first_name: data.firstName,
          email: data.email,
          role: data.role,
          source_page: data.sourcePage || 'newsletter',
          conversion_source: data.conversionSource || 'organic',
          tags: data.tags || ['newsletter'],
          mailersend_synced: false
        }]);

      if (dbError && dbError.code !== '23505') {
        throw dbError;
      }

      // Send welcome email via MailerSend
      if (this.apiToken && this.apiToken !== 'your_mailersend_api_token') {
        await this.sendWelcomeEmail({
          email: data.email,
          firstName: data.firstName,
          role: data.role
        });

        // Mark as synced
        await supabase
          .from('newsletter_subscriptions_clr2025')
          .update({ mailersend_synced: true })
          .eq('email', data.email);
      } else {
        console.log('⚠️ MailerSend API token not configured, using database only');
      }

      // Track conversion event
      this.trackConversionEvent('newsletter_signup', {
        email: data.email,
        source: data.sourcePage
      });

      return { success: true };
    } catch (error) {
      console.error('❌ Newsletter subscription failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Lead magnet with MailerSend automation
  async subscribeToLeadMagnet(data) {
    try {
      console.log('📚 Subscribing to lead magnet with MailerSend:', data.email);

      // Add to local database
      const { error: dbError } = await supabase
        .from('newsletter_subscriptions_clr2025')
        .insert([{
          email: data.email,
          first_name: data.firstName || '',
          source_page: 'lead_magnet',
          conversion_source: 'leadership_toolkit',
          tags: ['lead_magnet', 'leadership_toolkit'],
          mailersend_synced: false
        }]);

      if (dbError && dbError.code !== '23505') {
        throw dbError;
      }

      // Send lead magnet email via MailerSend
      if (this.apiToken && this.apiToken !== 'your_mailersend_api_token') {
        await this.sendLeadMagnetEmail({
          email: data.email,
          firstName: data.firstName || 'Friend'
        });

        // Mark as synced
        await supabase
          .from('newsletter_subscriptions_clr2025')
          .update({ mailersend_synced: true })
          .eq('email', data.email);
      }

      // Track high-intent lead
      this.trackConversionEvent('lead_magnet_download', {
        email: data.email,
        magnet: 'leadership_toolkit'
      });

      return {
        success: true,
        downloadUrl: 'https://chefliferadio.com/downloads/leadership-toolkit.pdf'
      };
    } catch (error) {
      console.error('❌ Lead magnet subscription failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Contact form with MailerSend follow-up
  async submitContactForm(data) {
    try {
      console.log('📞 Processing contact form with MailerSend:', data.email);

      // Add to local database
      const { error: dbError } = await supabase
        .from('contact_submissions_clr2025')
        .insert([{
          inquiry_type: data.inquiryType,
          name: data.name,
          email: data.email,
          message: data.message,
          file_name: data.fileName,
          mailersend_notified: false
        }]);

      if (dbError) throw dbError;

      // Send confirmation email to user
      if (this.apiToken && this.apiToken !== 'your_mailersend_api_token') {
        await this.sendContactConfirmationEmail({
          email: data.email,
          name: data.name,
          inquiryType: data.inquiryType
        });

        // Send notification to admin
        await this.sendAdminNotificationEmail({
          inquiryType: data.inquiryType,
          name: data.name,
          email: data.email,
          message: data.message
        });

        // Mark as notified
        await supabase
          .from('contact_submissions_clr2025')
          .update({ mailersend_notified: true })
          .eq('email', data.email);
      }

      // Track contact intent
      this.trackConversionEvent('contact_form_submit', {
        email: data.email,
        inquiry_type: data.inquiryType
      });

      return { success: true };
    } catch (error) {
      console.error('❌ Contact form submission failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Send welcome email
  async sendWelcomeEmail({ email, firstName, role }) {
    try {
      const emailData = {
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        to: [{
          email: email,
          name: firstName || 'Friend'
        }],
        template_id: this.templates.welcome,
        variables: [{
          email: email,
          substitutions: [
            { var: 'first_name', value: firstName || 'Friend' },
            { var: 'role', value: role || 'Culinary Professional' },
            { var: 'podcast_link', value: 'https://therealchefliferadio.captivate.fm/listen' }
          ]
        }]
      };

      const response = await this.sendEmail(emailData);
      console.log('✅ Welcome email sent successfully');
      return response;
    } catch (error) {
      console.error('❌ Welcome email failed:', error);
      throw error;
    }
  }

  // Send lead magnet email
  async sendLeadMagnetEmail({ email, firstName }) {
    try {
      const emailData = {
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        to: [{
          email: email,
          name: firstName || 'Friend'
        }],
        template_id: this.templates.leadMagnet,
        variables: [{
          email: email,
          substitutions: [
            { var: 'first_name', value: firstName || 'Friend' },
            { var: 'download_link', value: 'https://chefliferadio.com/downloads/leadership-toolkit.pdf' },
            { var: 'bonus_content_link', value: 'https://chefliferadio.com/bonus-resources' }
          ]
        }]
      };

      const response = await this.sendEmail(emailData);
      console.log('✅ Lead magnet email sent successfully');
      return response;
    } catch (error) {
      console.error('❌ Lead magnet email failed:', error);
      throw error;
    }
  }

  // Send contact confirmation email
  async sendContactConfirmationEmail({ email, name, inquiryType }) {
    try {
      const emailData = {
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        to: [{
          email: email,
          name: name
        }],
        template_id: this.templates.contactConfirmation,
        variables: [{
          email: email,
          substitutions: [
            { var: 'name', value: name },
            { var: 'inquiry_type', value: inquiryType.replace('_', ' ').toUpperCase() },
            { var: 'response_time', value: inquiryType === 'media' || inquiryType === 'speaking' ? '24 hours' : '48 hours' }
          ]
        }]
      };

      const response = await this.sendEmail(emailData);
      console.log('✅ Contact confirmation email sent successfully');
      return response;
    } catch (error) {
      console.error('❌ Contact confirmation email failed:', error);
      throw error;
    }
  }

  // Send admin notification email
  async sendAdminNotificationEmail({ inquiryType, name, email, message }) {
    try {
      const adminEmail = 'adam@chefliferadio.com';
      const emailData = {
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        to: [{
          email: adminEmail,
          name: 'Chef Adam M Lamb'
        }],
        subject: `New ${inquiryType.replace('_', ' ').toUpperCase()} Inquiry from ${name}`,
        text: `New contact form submission:

Name: ${name}
Email: ${email}
Inquiry Type: ${inquiryType}

Message:
${message}

Please respond within 24-48 hours.

Best regards,
Chef Life Radio Website`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Inquiry Type:</strong> ${inquiryType.replace('_', ' ').toUpperCase()}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <hr>
          <p><em>Please respond within 24-48 hours.</em></p>
        `
      };

      const response = await this.sendEmail(emailData);
      console.log('✅ Admin notification email sent successfully');
      return response;
    } catch (error) {
      console.error('❌ Admin notification email failed:', error);
      throw error;
    }
  }

  // Generic email sending method
  async sendEmail(emailData) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/email`,
        emailData,
        {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ MailerSend email failed:', error);
      throw new Error(error.response?.data?.message || 'Email sending failed');
    }
  }

  // Get subscriber stats for admin dashboard
  async getSubscriberStats() {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions_clr2025')
        .select('*');

      if (error) throw error;

      const stats = {
        total: data.length,
        newsletter: data.filter(s => s.tags?.includes('newsletter')).length,
        leadMagnets: data.filter(s => s.tags?.includes('lead_magnet')).length,
        contacts: data.filter(s => s.source_page === 'contact').length,
        thisMonth: data.filter(s => {
          const created = new Date(s.created_at);
          const now = new Date();
          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
        }).length,
        synced: data.filter(s => s.mailersend_synced).length,
        unsynced: data.filter(s => !s.mailersend_synced).length
      };

      return { success: true, stats };
    } catch (error) {
      console.error('❌ Error fetching subscriber stats:', error);
      return { success: false, error: error.message };
    }
  }

  // Sync unsynced subscribers to MailerSend
  async syncToMailerSend() {
    try {
      if (!this.apiToken || this.apiToken === 'your_mailersend_api_token') {
        throw new Error('MailerSend API token not configured');
      }

      const { data, error } = await supabase
        .from('newsletter_subscriptions_clr2025')
        .select('*')
        .eq('mailersend_synced', false);

      if (error) throw error;

      let syncCount = 0;
      for (const subscriber of data) {
        try {
          // Send appropriate welcome email based on source
          if (subscriber.tags?.includes('lead_magnet')) {
            await this.sendLeadMagnetEmail({
              email: subscriber.email,
              firstName: subscriber.first_name
            });
          } else {
            await this.sendWelcomeEmail({
              email: subscriber.email,
              firstName: subscriber.first_name,
              role: subscriber.role
            });
          }

          // Mark as synced
          await supabase
            .from('newsletter_subscriptions_clr2025')
            .update({ mailersend_synced: true })
            .eq('id', subscriber.id);

          syncCount++;

          // Rate limiting - wait 100ms between requests
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (emailError) {
          console.error(`❌ Failed to sync ${subscriber.email}:`, emailError);
          // Continue with next subscriber
        }
      }

      return { success: true, syncCount };
    } catch (error) {
      console.error('❌ Sync to MailerSend failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Track conversion events
  trackConversionEvent(eventName, properties = {}) {
    try {
      // Google Analytics 4 tracking
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', eventName, {
          event_category: 'conversion',
          event_label: properties.source || 'website',
          value: 1,
          ...properties
        });
        console.log('📊 Google Analytics event tracked:', eventName);
      }

      // Facebook Pixel tracking
      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', {
          content_name: eventName,
          content_category: 'email_signup',
          ...properties
        });
        console.log('📊 Facebook Pixel event tracked:', eventName);
      }

      // Store conversion in database
      supabase
        .from('conversion_events_clr2025')
        .insert([{
          event_name: eventName,
          properties: properties,
          timestamp: new Date().toISOString(),
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
          page_url: typeof window !== 'undefined' ? window.location.href : 'unknown'
        }])
        .then(({ error }) => {
          if (error) console.error('❌ Conversion tracking error:', error);
          else console.log('✅ Conversion tracked in database:', eventName);
        });

      console.log('📊 Tracked conversion event:', eventName, properties);
    } catch (error) {
      console.error('❌ Error tracking conversion:', error);
    }
  }

  // Get integration status
  getStatus() {
    return {
      configured: !!(this.apiToken && this.apiToken !== 'your_mailersend_api_token'),
      domain: this.domain,
      fromEmail: this.fromEmail,
      templatesConfigured: Object.values(this.templates).filter(Boolean).length
    };
  }
}

export default new MailerSendService();