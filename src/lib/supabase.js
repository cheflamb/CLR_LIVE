import { createClient } from '@supabase/supabase-js'

// CORRECTED URL - THIS IS THE EXACT URL FROM YOUR SUPABASE PROJECT
const SUPABASE_URL = 'https://uorhddenfmzsztipytdb.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvcmhkZGVuZm16c3p0aXB5dGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3OTY1NTgsImV4cCI6MjA2NjM3MjU1OH0.VRu_kU5lmD1suFt3iNK5wmHf4fBiUeHzzpQNLw0La1M'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables')
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

console.log('🔗 Supabase client initializing...')
console.log('📍 URL:', SUPABASE_URL)
console.log('🔑 Key configured:', SUPABASE_ANON_KEY ? '✅' : '❌')

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

// Test the connection
supabase.from('blog_posts_clr2025').select('count(*)', { count: 'exact', head: true })
  .then(({ data, error }) => {
    if (error) {
      console.error('❌ Supabase connection test failed:', error)
    } else {
      console.log('✅ Supabase connected successfully, total posts:', data)
    }
  })
  .catch(err => {
    console.error('❌ Supabase connection error:', err)
  })

export default supabase