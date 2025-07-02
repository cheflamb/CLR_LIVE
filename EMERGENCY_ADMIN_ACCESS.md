# 🚨 Emergency Admin Access Instructions

## If you still can't access admin after trying the main fixes:

### Method 1: Browser Console Emergency Access
1. **Open your site**: `yoursite.com/#/admin`
2. **Open browser console** (F12 → Console tab)
3. **Paste this command**:
```javascript
// Emergency admin access
window.emergencyAdminAccess = () => {
  const authContext = window.React && window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?.ReactCurrentOwner?.current?.context;
  if (authContext && authContext.enableEmergencyAdmin) {
    authContext.enableEmergencyAdmin();
  } else {
    localStorage.setItem('emergency_admin', 'true');
    window.location.reload();
  }
};
window.emergencyAdminAccess();
```

### Method 2: Direct Supabase User Creation
**Go to Supabase Dashboard** → **Authentication** → **Add User**:

**User 1:**
- Email: `adam@chefliferadio.com` 
- Password: `ChefLife2024!`
- ✅ **Check "Email Confirmed"**

**User 2 (Backup):**
- Email: `admin@chefliferadio.com`
- Password: `AdminChefLife2024!` 
- ✅ **Check "Email Confirmed"**

### Method 3: SQL Direct Insert
**Supabase Dashboard** → **SQL Editor** → **Run this**:

```sql
-- Create admin users
INSERT INTO admin_users_clr2025 (email, full_name, role, is_active) 
VALUES 
  ('adam@chefliferadio.com', 'Chef Adam M Lamb', 'super_admin', true),
  ('admin@chefliferadio.com', 'Admin User', 'super_admin', true)
ON CONFLICT (email) DO UPDATE SET
  is_active = true,
  role = 'super_admin';

-- Check if it worked
SELECT * FROM admin_users_clr2025;
```

### Method 4: Test Credentials
Try these combinations:

1. `adam@chefliferadio.com` / `ChefLife2024!`
2. `admin@chefliferadio.com` / `AdminChefLife2024!`
3. `admin@chefliferadio.com` / `ChefLife2024!`

## 🎯 What Should Happen
After successful login:
- ✅ Redirects to admin dashboard
- ✅ Shows stats cards
- ✅ Can create/edit blog posts
- ✅ Can manage episodes

## 🔧 Still Not Working? Send Me:
1. **Your Netlify site URL**
2. **Browser console errors** (F12 → Console)
3. **Which method you tried**

**I'll get you admin access in the next 5 minutes!** 🚀