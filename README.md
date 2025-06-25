# Chef Life Radio Website

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure your environment variables (see below)
4. Run the development server: `npm run dev`

## Environment Variables

### Required (Supabase)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Email Marketing with MailerSend

#### Step 1: Get MailerSend API Token
1. **Sign up**: Create account at [mailersend.com](https://mailersend.com)
2. **Verify domain**: Add and verify your sending domain
3. **Get API Token**: Go to Settings → API Tokens → Create Token
4. **Copy token**: It looks like `mlsn.abc123def456...`

#### Step 2: Create Email Templates (Optional)
In MailerSend dashboard, create these templates:
- **Welcome Email** (for newsletter subscribers)
- **Lead Magnet Email** (for downloadable content)
- **Contact Confirmation** (for form submissions)

#### Step 3: Configure Environment Variables
```
# Required
VITE_MAILERSEND_API_TOKEN=mlsn.your_actual_api_token
VITE_MAILERSEND_DOMAIN=chefliferadio.com
VITE_MAILERSEND_FROM_EMAIL=adam@chefliferadio.com
VITE_MAILERSEND_FROM_NAME=Chef Adam M Lamb

# Optional (Template IDs from MailerSend)
VITE_MAILERSEND_WELCOME_TEMPLATE=template_id_123
VITE_MAILERSEND_LEADMAGNET_TEMPLATE=template_id_456
VITE_MAILERSEND_CONTACT_TEMPLATE=template_id_789
```

### WordPress Integration (Optional)
```
VITE_WORDPRESS_SITE_URL=https://cheflifemedia.com
VITE_WORDPRESS_API_URL=https://cheflifemedia.com/wp-json/clr/v1/
```

### Membership Site (Optional)
```
VITE_MEMBERSHIP_SITE_URL=https://cheflifemedia.com
VITE_MEMBERSHIP_SIGNUP_URL=https://cheflifemedia.com/join
```

### Analytics (Optional)
```
VITE_GA_TRACKING_ID=your_google_analytics_id
VITE_FACEBOOK_PIXEL_ID=your_facebook_pixel_id
```

## MailerSend Integration Features

### ✅ **Automated Email Flows**
- **Newsletter Welcome**: Sent when someone subscribes
- **Lead Magnet Delivery**: Sends download link + follow-up sequence
- **Contact Confirmations**: Confirms form submissions
- **Admin Notifications**: Alerts you of new inquiries

### ✅ **Smart Email Routing**
- **General Newsletter** → Welcome sequence
- **Lead Magnet Downloads** → High-intent nurture sequence
- **Contact Forms** → Confirmation + admin alert
- **Speaking Requests** → Priority handling

### ✅ **Analytics & Tracking**
- **Email delivery rates** and open rates
- **Conversion tracking** across all touchpoints
- **Subscriber segmentation** by source and behavior
- **Integration with GA4** and Facebook Pixel

## Contact Information

### 📧 **Contact Details**
- **Email**: adam@chefliferadio.com
- **Phone**: (828) 688-0080
- **Location**: Asheville, NC 28801

### 🎵 **Podcast Platforms**
- **Main Link**: https://therealchefliferadio.captivate.fm/listen
- **Apple Podcasts**: https://podcasts.apple.com/us/podcast/chef-life-radio/id1567763359
- **Spotify**: https://open.spotify.com/show/7w1sii8X2eukTsm8jiVEx5
- **Amazon Music**: https://music.amazon.com/podcasts/ca17afbd-1376-4ad7-a5a1-c8ff53c0e1f4/Chef-Life-Radio
- **YouTube**: https://www.youtube.com/@chefadammlamb
- **RSS Feed**: https://feeds.captivate.fm/therealchefliferadio/

### 📱 **Social Media**
- **Connect**: https://link.chefliferadio.com/connect

## Deployment Options

### **Option 1: Full MailerSend Integration**
Configure all MailerSend variables for complete email automation.

### **Option 2: Basic Setup (Database Only)**
Skip MailerSend config - emails stored in Supabase, add MailerSend later.

### **Option 3: Templates Later**
Use MailerSend API without templates initially (sends plain emails).

## MailerSend Setup Guide

### **1. Create MailerSend Account**
- Go to [mailersend.com](https://mailersend.com)
- Sign up for free account (includes 3,000 emails/month)

### **2. Verify Your Domain**
- Add your domain (e.g., `chefliferadio.com`)
- Add DNS records they provide
- Wait for verification (usually 1-24 hours)

### **3. Create API Token**
- Go to **Settings** → **API Tokens**
- Click **Create Token**
- Give it a name like "Chef Life Radio Website"
- Copy the token (starts with `mlsn.`)

### **4. Create Email Templates (Optional)**

Create these templates for professional emails:

#### Welcome Email Template:
```
Subject: Welcome to the Chef Life Radio Movement!

Hi {{first_name}},

Welcome to the Chef Life Radio community! As a {{role}}, you're joining thousands of culinary leaders who are transforming kitchen culture.

🎧 Listen to latest episodes: {{podcast_link}}

Stay Tall & Frosty,
Chef Adam M Lamb
```

#### Lead Magnet Template:
```
Subject: Your Leadership Toolkit is Ready!

Hi {{first_name}},

Here's your free Leadership Toolkit: {{download_link}}

Plus, check out these bonus resources: {{bonus_content_link}}

Welcome to the movement!

Chef Adam M Lamb
```

### **5. Add to Environment Variables**
Copy your API token and add to `.env` or deployment settings.

## Graceful Fallbacks

**Your site works perfectly even without MailerSend configured:**
- ✅ **Collects all emails** in Supabase database
- ✅ **Admin dashboard** shows all subscribers
- ✅ **Export functionality** for easy migration
- ✅ **Add MailerSend later** without losing data

## Admin Access

Default admin credentials:
- Email: `adam@chefliferadio.com`
- Password: `ChefLife2024!`

## Support

For setup help or questions, contact the development team.

### Quick Start (Minimal Config)

Just add these two variables to get started:
```
VITE_SUPABASE_URL=https://uorhddenfmzsstipytdb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvcmhkZGVuZm16c3p0aXB5dGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3OTY1NTgsImV4cCI6MjA2NjM3MjU1OH0.VRu_kU5lmD1suFt3iNK5wmHf4fBiUeHzzpQNLw0La1M
```

Everything else can be added later!