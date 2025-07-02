-- 🔒 Quick Supabase Security Fixes
-- Run these one at a time in Supabase SQL Editor

-- Fix 1: Secure database functions (RECOMMENDED)
-- This prevents search path injection attacks
ALTER FUNCTION public.send_email_mailersend SET search_path = '';
ALTER FUNCTION public.create_email_message SET search_path = '';  
ALTER FUNCTION public.update_category_post_count SET search_path = '';

-- Fix 2: Verify the functions are secured
SELECT 
    schemaname, 
    proname, 
    prosecdef,
    proconfig
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
AND proname IN ('send_email_mailersend', 'create_email_message', 'update_category_post_count');

-- Expected result: proconfig should show search_path setting

-- Fix 3: Check your tables have proper RLS (verification only)
SELECT 
    schemaname, 
    tablename, 
    rowsecurity AS rls_enabled,
    (SELECT count(*) FROM pg_policies WHERE schemaname = n.nspname AND tablename = c.relname) AS policy_count
FROM pg_class c
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public' 
AND c.relkind = 'r'
AND c.relname LIKE '%_clr2025';

-- All your tables should have RLS enabled and at least 1 policy