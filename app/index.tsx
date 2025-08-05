import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';

export default function Index() {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkInitialRoute();
  }, []);

  const checkInitialRoute = async () => {
    try {
      console.log('Checking initial route...');
      
      // Check if user has seen landing page
      const hasSeenLanding = await AsyncStorage.getItem('hasSeenLanding');
      const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
      
      console.log('hasSeenLanding:', hasSeenLanding);
      console.log('hasCompletedOnboarding:', hasCompletedOnboarding);
      
      // Check authentication status
      const { data: { session } } = await supabase.auth.getSession();
      console.log('session:', session ? 'exists' : 'none');
      
      // Add a small delay to prevent flash
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!hasSeenLanding) {
        console.log('Redirecting to landing page');
        router.replace('/landing');
      } else if (!hasCompletedOnboarding && !session) {
        console.log('Redirecting to onboarding');
        router.replace('/onboarding');
      } else if (session) {
        console.log('Redirecting to main app');
        router.replace('/(tabs)');
      } else {
        console.log('Redirecting to login');
        router.replace('/(auth)/login');
      }
    } catch (error) {
      console.error('Error checking initial route:', error);
      // Fallback to landing page
      router.replace('/landing');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text style={styles.loadingText}>
        {isChecking ? 'Loading HarmonyK...' : 'Redirecting...'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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