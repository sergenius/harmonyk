import 'react-native-url-polyfill/auto';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Debug environment variables
console.log('Environment variables check:');
console.log('EXPO_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
console.log('EXPO_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');

// Fallback values for development (you can remove these once env vars work)
const fallbackUrl = 'https://tpstpxnokhbotwagdrje.supabase.co';
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwc3RweG5va2hib3R3YWdkcmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNDU4MzgsImV4cCI6MjA2OTYyMTgzOH0.3KdRSBh7EhPzcHJKfwzudpGRQNSKiRYfTbHY1MPZP68';

const finalUrl = supabaseUrl || fallbackUrl;
const finalKey = supabaseAnonKey || fallbackKey;

console.log('Using Supabase URL:', finalUrl);
console.log('Using Supabase Key:', finalKey ? 'Set' : 'Missing');

if (!finalUrl || !finalKey) {
  console.error('❌ Supabase configuration is missing!');
  console.error('Please check your environment variables.');
}

export const supabase = createClient<Database>(finalUrl, finalKey, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Test the connection
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('❌ Supabase connection error:', error);
  } else {
    console.log('✅ Supabase connection successful');
    console.log('Session status:', data.session ? 'Authenticated' : 'Not authenticated');
  }
});

// Handle app state changes for auth refresh
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});