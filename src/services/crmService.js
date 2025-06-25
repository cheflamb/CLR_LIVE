import axios from 'axios';
import supabase from '../lib/supabase';
import mailerSendService from './mailerSendService';

// CRM Service with MailerSend integration
class CRMService {
  constructor() {
    // Membership site URLs
    this.membershipSite = import.meta.env.VITE_MEMBERSHIP_SITE_URL || 'https://cheflifemedia.com';
    this.membershipSignup = import.meta.env.VITE_MEMBERSHIP_SIGNUP_URL || 'https://cheflifemedia.com/join';
  }

  // Subscribe to newsletter with MailerSend
  async subscribeToNewsletter(data) {
    return await mailerSendService.subscribeToNewsletter(data);
  }

  // Lead magnet with MailerSend automation
  async subscribeToLeadMagnet(data) {
    return await mailerSendService.subscribeToLeadMagnet(data);
  }

  // Contact form with MailerSend follow-up
  async submitContactForm(data) {
    return await mailerSendService.submitContactForm(data);
  }

  // Membership site redirect with tracking
  redirectToMembership(source = 'join_movement') {
    console.log('🚀 Redirecting to membership site from:', source);

    // Track the membership click
    this.trackConversionEvent('membership_click', {
      source: source,
      timestamp: new Date().toISOString()
    });

    // Add UTM parameters for tracking
    const membershipUrl = new URL(this.membershipSignup);
    membershipUrl.searchParams.set('utm_source', 'chef_life_radio');
    membershipUrl.searchParams.set('utm_medium', 'website');
    membershipUrl.searchParams.set('utm_campaign', source);
    membershipUrl.searchParams.set('utm_content', 'join_movement_button');

    // Redirect to membership site
    window.open(membershipUrl.toString(), '_blank');
  }

  // Track conversion events for analytics
  trackConversionEvent(eventName, properties = {}) {
    return mailerSendService.trackConversionEvent(eventName, properties);
  }

  // Get subscriber stats for admin dashboard
  async getSubscriberStats() {
    return await mailerSendService.getSubscriberStats();
  }

  // Sync local subscribers to MailerSend (admin function)
  async syncToMailerSend() {
    return await mailerSendService.syncToMailerSend();
  }

  // Get integration status
  getIntegrationStatus() {
    return {
      mailersend: mailerSendService.getStatus(),
      membership: {
        configured: !!(this.membershipSite && this.membershipSignup),
        siteUrl: this.membershipSite,
        signupUrl: this.membershipSignup
      }
    };
  }
}

export default new CRMService();