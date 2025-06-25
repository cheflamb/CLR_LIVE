# ChefBot Integration Guide

## 🤖 ChefBot Setup Instructions

### Step 1: Get Your Jotform ChefBot ID
1. Go to your Jotform dashboard
2. Find your trained ChefBot form
3. Copy the form ID (the numbers/letters in the URL)
4. Example: If URL is `https://form.jotform.com/241234567890`, your ID is `241234567890`

### Step 2: Update ChefBot Component
In `src/components/ChefBot.jsx`, replace:
```javascript
const jotformId = 'YOUR_CHEFBOT_JOTFORM_ID';
```
With your actual Jotform ID:
```javascript
const jotformId = '241234567890'; // Your actual ID
```

### Step 3: ChefBot Features Included

#### 🎯 **Smart Contextual Triggers**
- **Homepage**: General navigation help
- **Contact Page**: Form selection assistance  
- **Subscribe Page**: Platform recommendations
- **Episodes Page**: Content discovery
- **Blog Page**: Article finding
- **Admin Page**: Dashboard help

#### 🚀 **Auto-Show Logic**
- Appears automatically on Contact & Subscribe pages after 3 seconds
- Notification badge for first-time visitors
- Remembers if user has seen it

#### 💬 **Contextual Quick Actions**
Each page has relevant quick questions:
- Contact: "Which form should I use?"
- Subscribe: "Which platform is best for iPhone?"
- Episodes: "Find leadership episodes"
- etc.

#### 🎨 **Design Features**
- Floating button (bottom-right)
- Branded colors (Chef Life Radio red/gold)
- Smooth animations
- Mobile-responsive modal
- Professional chef hat icon

### Step 4: Jotform ChefBot Training Suggestions

Train your ChefBot to handle these common questions:

#### **Navigation Questions**
- "How do I subscribe to the podcast?"
- "Where can I contact Chef Adam?"
- "How do I apply to be a guest?"
- "Where is the merchandise store?"

#### **Platform Questions**  
- "Which podcast platform should I use?"
- "How do I subscribe on iPhone/Android?"
- "What's the difference between platforms?"
- "How do I get notifications for new episodes?"

#### **Content Questions**
- "Find episodes about leadership"
- "Show me episodes for new chefs" 
- "What's the latest episode about?"
- "Where can I find show notes?"

#### **Support Questions**
- "How can I support the show?"
- "Where do I buy Chef Life swag?"
- "How do I leave feedback?"
- "How do I join the community?"

### Step 5: Advanced Integration Options

#### **Option A: Simple Popup (Current)**
- ChefBot opens in modal overlay
- User stays on your site
- Clean, professional experience

#### **Option B: New Tab**
```javascript
// Replace the modal code with:
window.open(jotformUrl, '_blank', 'width=800,height=600');
```

#### **Option C: Embedded Widget**
```javascript
// For always-visible chat widget in corner
<iframe 
  src={`https://form.jotform.com/${jotformId}`}
  className="fixed bottom-20 right-6 w-80 h-96 border-none rounded-lg shadow-lg z-40"
/>
```

### Step 6: Testing Checklist

✅ **Test on each page**:
- Homepage - General help
- Contact - Form guidance  
- Subscribe - Platform help
- Episodes - Content discovery
- Blog - Article finding

✅ **Test interactions**:
- Click floating button
- Try quick action buttons
- Test auto-show on Contact/Subscribe
- Verify Jotform loads correctly
- Test close functionality

✅ **Mobile testing**:
- Button visibility
- Modal responsiveness
- Touch interactions
- Performance

### Step 7: Analytics & Tracking

ChefBot interactions are automatically tracked:
```javascript
// Auto-tracked events:
- 'chefbot_opened' - When modal opens
- 'chefbot_quick_action' - Quick button clicks  
- 'chefbot_launched' - Jotform opened
- 'chefbot_auto_shown' - Auto-trigger events
```

### Step 8: Customization Options

#### **Change Auto-Show Timing**
```javascript
// In ChefBot.jsx, change delay:
setTimeout(() => {
  setIsOpen(true);
}, 5000); // 5 seconds instead of 3
```

#### **Disable Auto-Show**
```javascript
// Remove or comment out the useEffect for auto-show
```

#### **Add More Pages**
```javascript
// In getContextualGreeting() and getQuickActions(), add:
newpage: {
  greeting: "Custom greeting...",
  actions: ["Action 1", "Action 2"]
}
```

## 🎉 Benefits of This Integration

### **For Users:**
- ✅ Instant help without leaving the page
- ✅ Contextual assistance based on current page
- ✅ Quick answers to common questions
- ✅ Professional, branded experience

### **For You:**
- ✅ Reduced support emails
- ✅ Better user experience
- ✅ Higher conversion rates
- ✅ Analytics on common questions
- ✅ 24/7 automated assistance

### **For Chef Life Radio:**
- ✅ Professional, modern feel
- ✅ Increased engagement
- ✅ Better lead qualification
- ✅ Improved user journey
- ✅ Brand consistency

## 🚀 Ready to Deploy!

Once you add your Jotform ID, ChefBot will be fully functional and provide intelligent, contextual assistance across your entire Chef Life Radio website!