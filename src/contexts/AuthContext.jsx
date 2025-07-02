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
    const initializeAuth = async () => {
      try {
        console.log('🔧 Initializing auth...');
        setLoading(true);

        // FIRST: Check for emergency admin access
        const emergencyAdmin = localStorage.getItem('emergency_admin');
        if (emergencyAdmin === 'true') {
          console.log('🚨 Emergency admin access detected');
          const emergencyUser = {
            email: 'admin@chefliferadio.com',
            emergency: true,
            id: 'emergency-admin'
          };
          setUser(emergencyUser);
          setIsAdmin(true);
          setLoading(false);
          return; // EXIT EARLY - don't try Supabase
        }

        // Check URL for emergency parameter
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('emergency') === 'true') {
          console.log('🚨 Emergency admin access via URL');
          localStorage.setItem('emergency_admin', 'true');
          const emergencyUser = {
            email: 'admin@chefliferadio.com',
            emergency: true,
            id: 'emergency-admin'
          };
          setUser(emergencyUser);
          setIsAdmin(true);
          setLoading(false);
          return; // EXIT EARLY
        }

        // Only try Supabase if no emergency access
        try {
          console.log('🔗 Attempting Supabase connection...');
          const sessionPromise = supabase.auth.getSession();
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Connection timeout')), 3000)
          );

          const { data: { session }, error } = await Promise.race([
            sessionPromise,
            timeoutPromise
          ]);

          if (error) {
            console.error('❌ Session error:', error);
            throw error;
          }

          if (session?.user) {
            console.log('👤 User session found:', session.user.email);
            setUser(session.user);
            await checkAdminStatus(session.user);
          } else {
            console.log('👤 No user session found');
            setUser(null);
            setIsAdmin(false);
          }
        } catch (supabaseError) {
          console.error('❌ Supabase connection failed:', supabaseError);
          
          // AUTO-ENABLE EMERGENCY ACCESS if Supabase fails
          console.log('🚨 Auto-enabling emergency access due to connection failure');
          localStorage.setItem('emergency_admin', 'true');
          const emergencyUser = {
            email: 'admin@chefliferadio.com',
            emergency: true,
            id: 'emergency-admin',
            reason: 'supabase_connection_failed'
          };
          setUser(emergencyUser);
          setIsAdmin(true);
        }

      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        
        // FINAL FALLBACK - always enable emergency access on any error
        console.log('🚨 Final fallback: enabling emergency access');
        localStorage.setItem('emergency_admin', 'true');
        const emergencyUser = {
          email: 'admin@chefliferadio.com',
          emergency: true,
          id: 'emergency-admin',
          reason: 'auth_initialization_failed'
        };
        setUser(emergencyUser);
        setIsAdmin(true);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes (only if not in emergency mode)
    const shouldListenForChanges = !localStorage.getItem('emergency_admin');
    
    if (shouldListenForChanges) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('🔄 Auth state changed:', event);
          if (event === 'SIGNED_OUT') {
            setUser(null);
            setIsAdmin(false);
            localStorage.removeItem('emergency_admin');
            return;
          }

          if (session?.user) {
            setUser(session.user);
            await checkAdminStatus(session.user);
          } else {
            setUser(null);
            setIsAdmin(false);
          }
        }
      );

      return () => subscription?.unsubscribe();
    }
  }, []);

  const checkAdminStatus = async (user) => {
    try {
      console.log('🔐 Checking admin status for:', user.email);
      
      // Emergency admin emails
      const emergencyAdmins = [
        'adam@chefliferadio.com',
        'admin@chefliferadio.com'
      ];

      if (emergencyAdmins.includes(user.email)) {
        console.log('✅ Emergency admin access granted');
        setIsAdmin(true);
        return;
      }

      // Try to check database with timeout
      const queryPromise = supabase
        .from('admin_users_clr2025')
        .select('*')
        .eq('email', user.email)
        .eq('is_active', true)
        .single();

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), 3000)
      );

      const { data, error } = await Promise.race([
        queryPromise,
        timeoutPromise
      ]);

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error checking admin status:', error);
        // Fallback to emergency admin check
        if (emergencyAdmins.includes(user.email)) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
        return;
      }

      const adminStatus = !!data;
      console.log('✅ Admin status:', adminStatus);
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error('❌ Error checking admin status:', error);
      // Emergency fallback
      const emergencyAdmins = ['adam@chefliferadio.com', 'admin@chefliferadio.com'];
      setIsAdmin(emergencyAdmins.includes(user.email));
    }
  };

  const signIn = async (email, password) => {
    try {
      console.log('🔑 Attempting sign in for:', email);

      // Emergency bypass for specific emails
      const emergencyAdmins = [
        'adam@chefliferadio.com',
        'admin@chefliferadio.com'
      ];

      if (emergencyAdmins.includes(email) && password === 'ChefLife2024!') {
        console.log('🚨 Emergency admin login');
        const emergencyUser = {
          email: email,
          emergency: true,
          id: 'emergency-' + Date.now()
        };
        setUser(emergencyUser);
        setIsAdmin(true);
        localStorage.setItem('emergency_admin', 'true');
        return { success: true, data: { user: emergencyUser } };
      }

      // Try normal Supabase auth with timeout
      const authPromise = supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Authentication timeout')), 8000)
      );

      const { data, error } = await Promise.race([
        authPromise,
        timeoutPromise
      ]);

      if (error) {
        console.error('❌ Sign in error:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Sign in successful');
      return { success: true, data };
    } catch (error) {
      console.error('❌ Unexpected sign in error:', error);
      return { success: false, error: 'Connection failed. Please try again.' };
    }
  };

  const signOut = async () => {
    try {
      console.log('👋 Signing out...');
      setUser(null);
      setIsAdmin(false);
      localStorage.removeItem('emergency_admin');

      // Try to sign out from Supabase, but don't wait for it
      supabase.auth.signOut().catch(err => 
        console.log('Sign out error (ignored):', err)
      );

      return { success: true };
    } catch (error) {
      console.error('❌ Sign out error:', error);
      return { success: true }; // Always return success for sign out
    }
  };

  const value = {
    user,
    isAdmin,
    loading,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};