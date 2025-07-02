# 🔧 Supabase Database Cleanup & Fix

## 🚨 **STEP 1: Clean Up Existing Table**

### **Go to Supabase Dashboard → SQL Editor and run:**

```sql
-- Step 1: Delete existing entries (if any)
DELETE FROM admin_users_clr2025;

-- Step 2: Drop and recreate the table cleanly
DROP TABLE IF EXISTS admin_users_clr2025;

-- Step 3: Create fresh table
CREATE TABLE admin_users_clr2025 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Enable RLS
ALTER TABLE admin_users_clr2025 ENABLE ROW LEVEL SECURITY;

-- Step 5: Create policy
CREATE POLICY "Allow admin access" ON admin_users_clr2025
  FOR ALL 
  TO authenticated 
  USING (true);

-- Step 6: Insert clean admin records
INSERT INTO admin_users_clr2025 (email, full_name, role, is_active) 
VALUES 
  ('adam@chefliferadio.com', 'Chef Adam M Lamb', 'super_admin', true),
  ('admin@chefliferadio.com', 'Admin User', 'super_admin', true);

-- Step 7: Verify it worked
SELECT * FROM admin_users_clr2025;
```

## 🚨 **STEP 2: Create Authentication Users**

### **Go to Authentication → Users:**

**Delete any existing users with these emails first, then create:**

**User 1:**
- Email: `adam@chefliferadio.com`
- Password: `ChefLife2024!`
- ✅ **Check "Email Confirmed"**
- Click "Create User"

**User 2 (Backup):**
- Email: `admin@chefliferadio.com` 
- Password: `AdminChefLife2024!`
- ✅ **Check "Email Confirmed"**
- Click "Create User"

## 🚨 **STEP 3: Test Login**

1. **Go to your site**: `yoursite.com/#/admin`
2. **Try these credentials**:

**Primary:**
- Email: `adam@chefliferadio.com`
- Password: `ChefLife2024!`

**Backup:**
- Email: `admin@chefliferadio.com`
- Password: `AdminChefLife2024!`

## ✅ **Expected Result:**
- Login page loads without "Failed to fetch" error
- Can enter credentials and click "Sign In"
- Redirects to admin dashboard
- Shows blog posts and episodes management

## 🔧 **If Still Having Issues:**

### **Quick Browser Console Check:**
1. **Press F12 → Console tab**
2. **Look for any red error messages**
3. **Try refreshing the page**
4. **Clear browser cache**

### **Alternative Quick Fix:**
If you're still getting database errors, try this simpler approach:

```sql
-- Nuclear option: Start completely fresh
DROP TABLE IF EXISTS admin_users_clr2025;

CREATE TABLE admin_users_clr2025 (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'super_admin',
  is_active BOOLEAN DEFAULT true
);

INSERT INTO admin_users_clr2025 (email, full_name) 
VALUES ('adam@chefliferadio.com', 'Chef Adam M Lamb');

SELECT * FROM admin_users_clr2025;
```

## 📞 **Still Stuck?**
Share with me:
1. **Exact error message** from Supabase
2. **Screenshot** of the table after running SQL
3. **Browser console errors** when trying to login

**Let's get this working in the next 5 minutes!** 🚀