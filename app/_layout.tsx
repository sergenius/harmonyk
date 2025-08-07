import { useEffect, useState } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  useFrameworkReady();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenLanding, setHasSeenLanding] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check if user has seen landing page
      const seenLanding = await AsyncStorage.getItem('hasSeenLanding');
      const completedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
      
      setHasSeenLanding(!!seenLanding);
      setHasCompletedOnboarding(!!completedOnboarding);
      
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        console.log('Auth state changed:', _event, session ? 'session exists' : 'no session');
        setSession(session);
        
        // Handle navigation based on auth state (only if not already navigating)
        if (!isNavigating) {
          setIsNavigating(true);
          if (session) {
            console.log('User authenticated, redirecting to main app');
            router.replace('/(tabs)');
          } else {
            console.log('User not authenticated, checking onboarding status');
            if (hasSeenLanding && hasCompletedOnboarding) {
              router.replace('/(auth)/login');
            } else if (hasSeenLanding && !hasCompletedOnboarding) {
              router.replace('/onboarding');
            } else {
              router.replace('/landing');
            }
          }
          // Reset navigation flag after a short delay
          setTimeout(() => setIsNavigating(false), 1000);
        }
      });

      setIsLoading(false);
      
      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('Error initializing app:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Determine which screen to show
  const getInitialRoute = () => {
    if (!hasSeenLanding) {
      return 'landing';
    }
    if (!hasCompletedOnboarding && !session) {
      return 'onboarding';
    }
    if (session) {
      return '(tabs)';
    }
    return '(auth)';
  };

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="landing" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
});