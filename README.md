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
VITE_MAILERSEND_API_TOKEN=your_new_api_token_here
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

## 🚨 Security Notice

**NEVER commit API tokens to GitHub!** Always:
- Add API tokens only to hosting platform environment variables
- Use placeholder values in committed files
- Regenerate tokens if accidentally exposed

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

## Admin Access

Default admin credentials:
- Email: `adam@chefliferadio.com`
- Password: `ChefLife2024!`

## Quick Start (Minimal Config)

Just add these two variables to get started:
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=e

Everything else can be added later!
