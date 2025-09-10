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

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthContext: auth state change:', event, session?.user?.id);
      try {
        if (session?.user) {
          console.log('AuthContext: getting user profile for:', session.user.id);
          const userWithProfile = await getUserWithProfile(session.user);
          console.log('AuthContext: user profile loaded:', userWithProfile);
          setUser(userWithProfile);
        } else {
          console.log('AuthContext: no session, setting user to null');
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
    console.log('getUserWithProfile: starting for user:', user.id);
    const username = user.email?.split('@')[0] || 'user';
    
    try {
      // Try to get existing profile, but don't use .single() to avoid 406 error
      console.log('getUserWithProfile: fetching existing profile...');
      
      // Add timeout to prevent hanging
      const profileQuery = supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id);
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile query timeout')), 5000)
      );
      
      const { data: profiles, error } = await Promise.race([
        profileQuery,
        timeoutPromise
      ]);
      
      console.log('getUserWithProfile: profile query result:', { profiles, error });
      
      let profile = null;
      if (profiles && profiles.length > 0) {
        console.log('getUserWithProfile: found existing profile');
        profile = profiles[0];
      } else {
        console.log('getUserWithProfile: no existing profile, creating new one...');
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
          
          console.log('getUserWithProfile: profile creation result:', { newProfile, insertError });
          
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
      
      const result = {
        ...user,
        username,
        profile: profile || { id: user.id, username, biography: '' }
      };
      
      console.log('getUserWithProfile: returning user with profile:', result);
      return result;
    } catch (error) {
      console.error('Error in getUserWithProfile:', error);
      
      // If it's a timeout or profile table issue, just return user with default profile
      if (error.message === 'Profile query timeout') {
        console.log('getUserWithProfile: Profile query timed out, using default profile');
      }
      
      // Return user with default profile if anything fails
      return {
        ...user,
        username,
        profile: { id: user.id, username, biography: '' }
      };
    }
  };

  const signInWithEmail = async (email, password) => {
    console.log('AuthContext: signInWithEmail called');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('AuthContext: signIn error:', error);
      throw error;
    }
    console.log('AuthContext: signIn successful:', data);
    return data; // ← Add this line
  };
  
  const signUpWithEmail = async (email, password) => {
    console.log('AuthContext: signUpWithEmail called');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error('AuthContext: signUp error:', error);
      throw error;
    }
    console.log('AuthContext: signUp successful:', data);
    return data; // ← Add this line
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


