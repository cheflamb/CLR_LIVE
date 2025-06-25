# Chef Life Radio - Deployment Guide

## 🚀 **Ready to Deploy!**

Your Chef Life Radio website is fully configured with MailerSend integration and ready for deployment.

## **Environment Variables for Netlify**

Add these to your Netlify deployment settings:

### **Required (Copy these exactly):**

```
VITE_SUPABASE_URL=https://uorhddenfmzsstipytdb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvcmhkZGVuZm16c3p0aXB5dGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3OTY1NTgsImV4cCI6MjA2NjM3MjU1OH0.VRu_kU5lmD1suFt3iNK5wmHf4fBiUeHzzpQNLw0La1M
VITE_MAILERSEND_API_TOKEN=mlsn.45f356de58c0eb7987d07df6f311126754c3d5e4c5a833b17470d6e50d2ea2ae
VITE_MAILERSEND_DOMAIN=chefliferadio.com
VITE_MAILERSEND_FROM_EMAIL=adam@chefliferadio.com
VITE_MAILERSEND_FROM_NAME=Chef Adam M Lamb
```

### **Optional (Add when ready):**

```
VITE_WORDPRESS_SITE_URL=https://cheflifemedia.com
VITE_MEMBERSHIP_SITE_URL=https://cheflifemedia.com
VITE_GA_TRACKING_ID=your_google_analytics_id
VITE_FACEBOOK_PIXEL_ID=your_facebook_pixel_id
```

## **What's Already Working:**

### ✅ **Email Marketing Automation**
- **Newsletter signups** → Automatic welcome emails
- **Lead magnet downloads** → Instant delivery + nurture sequence
- **Contact forms** → Confirmation emails + admin alerts
- **Subscriber segmentation** by source and behavior

### ✅ **Content Management**
- **Admin panel** with full CRUD for blog posts and episodes
- **Authentication system** with secure admin access
- **File uploads** and rich content editing
- **Category management** and tagging

### ✅ **Analytics & Tracking**
- **Conversion tracking** across all touchpoints
- **Subscriber analytics** in admin dashboard
- **Performance metrics** and growth trends
- **Integration hooks** for GA4 and Facebook Pixel

### ✅ **WordPress Integration Ready**
- **API endpoints** for SureFeedback, SureForms, PrestoPlayer
- **Bidirectional sync** between React app and WordPress
- **Video content management** with lead capture
- **Analytics dashboard** integration

## **Updated Contact Information:**
- **Email:** adam@chefliferadio.com
- **Phone:** (828) 688-0080
- **Location:** Asheville, NC
- **Social:** https://link.chefliferadio.com/connect

## **Updated Podcast Platforms:**
- **Main Link:** https://therealchefliferadio.captivate.fm/listen
- **Apple Podcasts:** https://podcasts.apple.com/us/podcast/chef-life-radio/id1567763359
- **Spotify:** https://open.spotify.com/show/7w1sii8X2eukTsm8jiVEx5
- **Amazon Music:** https://music.amazon.com/podcasts/ca17afbd-1376-4ad7-a5a1-c8ff53c0e1f4/Chef-Life-Radio
- **YouTube:** https://www.youtube.com/@chefadammlamb
- **RSS:** https://feeds.captivate.fm/therealchefliferadio/

## **Admin Access:**
- **URL:** `yoursite.com/#/admin`
- **Email:** `adam@chefliferadio.com`
- **Password:** `ChefLife2024!`

## **Next Steps After Deployment:**

### **1. Verify MailerSend Domain (Important!)**
- Go to [MailerSend Dashboard](https://app.mailersend.com)
- Add domain: `chefliferadio.com`
- Add the DNS records they provide
- Wait for verification (usually 1-24 hours)

### **2. Create Email Templates (Optional)**

In MailerSend, create these professional templates:

**Welcome Email:**
```
Subject: Welcome to the Chef Life Radio Movement!

Hi {{first_name}},

Welcome to the Chef Life Radio community! As a {{role}}, you're joining thousands of culinary leaders who are transforming kitchen culture.

🎧 Listen to latest episodes: {{podcast_link}}

Stay Tall & Frosty,
Chef Adam M Lamb
```

**Lead Magnet Email:**
```
Subject: Your Leadership Toolkit is Ready!

Hi {{first_name}},

Here's your free Leadership Toolkit: {{download_link}}

Plus, check out these bonus resources: {{bonus_content_link}}

Welcome to the movement!

Chef Adam M Lamb
```

### **3. Test Everything:**

After deployment, test these key features:
- Newsletter signup on homepage ✅
- Lead magnet download on subscribe page ✅
- Contact form submissions ✅
- Admin panel access ✅
- Email delivery (check your inbox) ✅

## **Deployment Commands:**

```bash
# Build the project
npm run build

# The dist/ folder is ready for Netlify
```

## **Netlify Settings:**
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** `18` or higher

## **Support:**

Your site includes comprehensive error handling and graceful fallbacks:
- Works perfectly even if MailerSend is temporarily unavailable
- All data is safely stored in Supabase
- Admin dashboard provides full visibility
- Easy to add more integrations later

## **🎉 You're All Set!**

Your Chef Life Radio website is production-ready with:
- Professional email automation ✅
- Secure admin panel ✅
- Analytics and tracking ✅
- WordPress integration hooks ✅
- Beautiful, responsive design ✅
- Real contact information ✅
- Actual podcast platform links ✅

Deploy and start building your community!