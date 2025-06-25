# Chef Life Radio - WordPress Integration Plan

## Phase 1: Essential Integrations (Implement First)

### 1. SureFeedback Integration
**Purpose**: Collect podcast feedback, testimonials, and listener insights
**Implementation**:
- Add feedback widgets to podcast episode pages
- Collect testimonials for homepage social proof
- Gather content suggestions from audience
- Monitor show ratings and reviews

**WordPress Setup**:
```php
// Add to functions.php or use plugin
add_action('wp_footer', function() {
    if (is_single() && get_post_type() === 'podcast_episode') {
        echo '<div id="surefeedback-widget" data-episode-id="' . get_the_ID() . '"></div>';
    }
});
```

### 2. SureForms Integration
**Purpose**: Advanced contact forms and lead capture
**Implementation**:
- Replace basic contact forms
- Add conditional logic for different inquiry types
- Better lead qualification and routing
- Seamless Suremail list integration

**Forms Needed**:
- Contact/Inquiry form (with inquiry type routing)
- Speaking engagement requests
- Guest appearance applications
- Feedback and suggestions
- Newsletter subscription (enhanced)

**WordPress Setup**:
```php
// Custom form handlers
add_action('wp_ajax_sureforms_submit', 'handle_sureforms_submission');
add_action('wp_ajax_nopriv_sureforms_submit', 'handle_sureforms_submission');

function handle_sureforms_submission() {
    // Route to appropriate Suremail list based on form type
    $form_type = $_POST['form_type'];
    $suremail_list = get_suremail_list_by_type($form_type);
    // Process submission
}
```

## Phase 2: Content Enhancement (Implement Second)

### 3. PrestoPlayer Integration
**Purpose**: Enhanced video content delivery and engagement
**Implementation**:
- Replace basic YouTube embeds
- Add lead capture overlays to videos
- Track video engagement analytics
- Create video courses and training content

**Use Cases**:
- Episode highlights and clips
- Behind-the-scenes content
- Leadership training videos
- Guest interview snippets

**WordPress Setup**:
```php
// Custom video shortcode with lead capture
add_shortcode('clr_video', function($atts) {
    $defaults = array(
        'id' => '',
        'title' => '',
        'lead_magnet' => false,
        'suremail_list' => 'newsletter'
    );
    $atts = shortcode_atts($defaults, $atts);
    
    // Return PrestoPlayer embed with lead capture
    return render_prestoplayer_with_leadcapture($atts);
});
```

## Phase 3: Analytics & Optimization (Implement Third)

### 4. SureDash Integration
**Purpose**: Centralized analytics and performance monitoring
**Implementation**:
- Unified dashboard for all metrics
- Email campaign performance
- Form conversion rates
- Video engagement stats
- Podcast download analytics

**Dashboard Widgets**:
- Newsletter growth trends
- Lead magnet conversion rates
- Contact form submissions
- Video engagement metrics
- Podcast episode performance

**WordPress Setup**:
```php
// Custom dashboard widget
add_action('wp_dashboard_setup', function() {
    wp_add_dashboard_widget(
        'clr_suredash_stats',
        'Chef Life Radio Analytics',
        'display_suredash_widget'
    );
});

function display_suredash_widget() {
    // Display SureDash analytics
    echo '<div id="suredash-widget"></div>';
}
```

## Integration Architecture

### React App ↔ WordPress Communication
```javascript
// In your React app (src/services/wordpressService.js)
class WordPressService {
  constructor() {
    this.wpApiUrl = 'https://yoursite.com/wp-json/clr/v1/';
  }

  async submitFeedback(episodeId, feedback) {
    // Send to WordPress SureFeedback
    return fetch(`${this.wpApiUrl}feedback`, {
      method: 'POST',
      body: JSON.stringify({ episode_id: episodeId, feedback })
    });
  }

  async getEpisodeVideos(episodeId) {
    // Get PrestoPlayer videos for episode
    return fetch(`${this.wpApiUrl}episodes/${episodeId}/videos`);
  }

  async getAnalytics() {
    // Get SureDash analytics
    return fetch(`${this.wpApiUrl}analytics`);
  }
}
```

### WordPress API Endpoints
```php
// Custom REST API endpoints
add_action('rest_api_init', function() {
    register_rest_route('clr/v1', '/feedback', array(
        'methods' => 'POST',
        'callback' => 'handle_feedback_submission',
        'permission_callback' => '__return_true'
    ));
    
    register_rest_route('clr/v1', '/analytics', array(
        'methods' => 'GET',
        'callback' => 'get_analytics_data',
        'permission_callback' => 'check_admin_permissions'
    ));
});
```

## Phase 4: Advanced Automation (Consider Later)

### 5. OttoKit Integration
**Purpose**: Advanced workflow automation
**When to Implement**: After other integrations are stable
**Use Cases**:
- Complex email sequences based on behavior
- Advanced lead scoring
- Automated content distribution
- Cross-platform synchronization

## Implementation Priority

### Week 1-2: SureForms + SureFeedback
- Set up advanced contact forms
- Add feedback collection to podcast pages
- Test Suremail integration

### Week 3-4: PrestoPlayer
- Implement video player on key pages
- Add lead capture overlays
- Create episode highlight videos

### Week 5-6: SureDash
- Set up analytics dashboard
- Create custom reporting widgets
- Monitor all integrations

### Later: OttoKit
- Implement after other tools are proven
- Focus on advanced automation workflows