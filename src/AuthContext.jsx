import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from './lib/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userWithProfile = await getUserWithProfile(session.user);
          setUser(userWithProfile);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error in auth init:', error);
        setUser(null);
      }
    };
    init();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session?.user) {
          const userWithProfile = await getUserWithProfile(session.user);
          setUser(userWithProfile);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        // Set user to null if there's an error to prevent hanging
        setUser(null);
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const getUserWithProfile = async (user) => {
    const username = user.email?.split('@')[0] || 'user';
    
    try {
      // Try to get existing profile, but don't use .single() to avoid 406 error
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id);
      
      let profile = null;
      if (profiles && profiles.length > 0) {
        profile = profiles[0];
      } else {
        // Create profile if it doesn't exist
        try {
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              username,
              biography: ''
            })
            .select()
            .single();
          
          if (insertError) {
            console.error('Error creating profile:', insertError);
            // If profile creation fails, just use a default profile
            profile = { id: user.id, username, biography: '' };
          } else {
            profile = newProfile;
          }
        } catch (insertErr) {
          console.error('Profile creation failed:', insertErr);
          profile = { id: user.id, username, biography: '' };
        }
      }
      
      return {
        ...user,
        username,
        profile: profile || { id: user.id, username, biography: '' }
      };
    } catch (error) {
      console.error('Error in getUserWithProfile:', error);
      // Return user with default profile if anything fails
      return {
        ...user,
        username,
        profile: { id: user.id, username, biography: '' }
      };
    }
  };

  const signInWithEmail = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUpWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    
    // Profile will be created automatically by the trigger
    // No need to manually create it here
  };

  const signInWithOtp = async (email) => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw error;
  };

  const signInWithProvider = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (updates) => {
    if (!user) return;
    
    // First check if profile exists
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id);
    
    if (profiles && profiles.length > 0) {
      // Profile exists, update it
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      if (error) throw error;
    } else {
      // Profile doesn't exist, create it
      const username = user.email?.split('@')[0] || 'user';
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username,
          biography: '',
          ...updates
        });
      if (error) throw error;
    }
    
    // Refresh user data
    const userWithProfile = await getUserWithProfile(user);
    setUser(userWithProfile);
  };

  const value = useMemo(() => ({ 
    user, 
    signInWithEmail, 
    signUpWithEmail, 
    signInWithOtp, 
    signInWithProvider, 
    signOut,
    updateProfile
  }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const RequireAuth = ({ children }) => {
  const { user } = useAuth();
  if (!user) return null;
  return children;
};


