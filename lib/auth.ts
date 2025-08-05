import { supabase } from './supabase';
import { Alert } from 'react-native';

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
}

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }
    
    if (!user) {
      return null;
    }
    
    return {
      id: user.id,
      email: user.email || '',
      full_name: user.user_metadata?.full_name || '',
      created_at: user.created_at,
    };
  } catch (error) {
    console.error('Unexpected error getting current user:', error);
    return null;
  }
};

export const signOut = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error);
      Alert.alert('Sign Out Error', 'Failed to sign out. Please try again.');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected sign out error:', error);
    Alert.alert('Sign Out Error', 'An unexpected error occurred.');
    return false;
  }
};

export const testConnection = async (): Promise<boolean> => {
  try {
    // Test basic connection
    const { data, error } = await supabase.from('balance_types').select('count').limit(1);
    
    if (error) {
      console.error('Connection test error:', error);
      return false;
    }
    
    console.log('Connection test successful');
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};

export const testAuthentication = async (): Promise<{
  isAuthenticated: boolean;
  canAccessData: boolean;
  user?: AuthUser;
  error?: string;
}> => {
  try {
    // Test if user is authenticated
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        isAuthenticated: false,
        canAccessData: false,
        error: 'Not authenticated'
      };
    }
    
    // Test if user can access protected data (RLS test)
    const { data, error } = await supabase
      .from('balances')
      .select('count')
      .limit(1);
    
    if (error && error.code === 'PGRST301') {
      // This is expected for empty tables
      return {
        isAuthenticated: true,
        canAccessData: true,
        user
      };
    } else if (error) {
      return {
        isAuthenticated: true,
        canAccessData: false,
        user,
        error: `Database access error: ${error.message}`
      };
    }
    
    return {
      isAuthenticated: true,
      canAccessData: true,
      user
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      canAccessData: false,
      error: `Authentication test failed: ${error}`
    };
  }
};

export const validateSession = async (): Promise<boolean> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session validation error:', error);
      return false;
    }
    
    return !!session && !!session.user;
  } catch (error) {
    console.error('Session validation failed:', error);
    return false;
  }
};

// Password strength validation
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};