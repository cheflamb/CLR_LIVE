import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://uorhddenfmzsztipytdb.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvcmhkZGVuZm16c3p0aXB5dGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3OTY1NTgsImV4cCI6MjA2NjM3MjU1OH0.VRu_kU5lmD1suFt3iNK5wmHf4fBiUeHzzpQNLw0La1M'

if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})