import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Ensure admin user record exists on app load
    const ensureAdminUserExists = async () => {
      try {
        console.log('🔧 Ensuring admin user record exists...');
        const { error } = await supabase
          .from('admin_users_clr2025')
          .upsert([{
            email: 'admin@chefliferadio.com',
            full_name: 'Admin User',
            role: 'super_admin',
            is_active: true
          }], {
            onConflict: 'email',
            ignoreDuplicates: false
          });

        if (error) {
          console.error('❌ Error ensuring admin user exists:', error);
        } else {
          console.log('✅ Admin user record ensured in database');
        }
      } catch (error) {
        console.error('❌ Error in ensureAdminUserExists:', error);
      }
    };

    // Get initial session
    const getSession = async () => {
      try {
        console.log('🔍 Getting initial session...');
        
        // First ensure admin user record exists
        await ensureAdminUserExists();

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Session error:', error);
          throw error;
        }

        if (session?.user) {
          console.log('👤 User found:', session.user.email);
          setUser(session.user);
          await checkAdminStatus(session.user);
        } else {
          console.log('👤 No user session found');
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('❌ Error getting session:', error);
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
        console.log('🏁 Auth initialization complete');
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out, clearing state');
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        if (session?.user) {
          setUser(session.user);
          await checkAdminStatus(session.user);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const checkAdminStatus = async (user) => {
    try {
      console.log('🔐 Checking admin status for:', user.email);
      
      // Check if user exists in admin_users table
      const { data, error } = await supabase
        .from('admin_users_clr2025')
        .select('*')
        .eq('email', user.email)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }

      const adminStatus = !!data;
      console.log('🔐 Admin status result:', { adminStatus, hasData: !!data, error: error?.message });
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error('❌ Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      console.log('🔑 Attempting sign in for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ Sign in error:', error);
        throw error;
      }

      console.log('✅ Sign in successful for:', data.user?.email);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Sign in failed:', error.message);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      console.log('👋 Initiating sign out...');
      
      // Clear local state first
      setUser(null);
      setIsAdmin(false);
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Sign out error:', error);
        // Even if there's an error, we've cleared local state
        return { success: true }; // Consider it successful since we cleared state
      }

      console.log('✅ Sign out successful');
      return { success: true };
    } catch (error) {
      console.error('❌ Sign out error:', error);
      // Even if there's an error, we've cleared local state
      return { success: true }; // Consider it successful since we cleared state
    }
  };

  const value = {
    user,
    isAdmin,
    loading,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};