import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Brain, 
  Heart, 
  Target, 
  Shield,
  ChevronRight,
  Star,
  Zap
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const features = [
  {
    icon: Brain,
    title: 'Balance Session Tracking',
    description: 'Log and monitor your balance sessions with detailed insights and progress tracking.',
    color: '#3B82F6',
  },
  {
    icon: Heart,
    title: 'Stress Reduction',
    description: 'Track stress levels before and after sessions to measure your transformation.',
    color: '#EF4444',
  },
  {
    icon: Target,
    title: 'Goal Achievement',
    description: 'Set and achieve your personal development goals with guided tracking.',
    color: '#10B981',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    description: 'Your data is protected with enterprise-level security and privacy.',
    color: '#8B5CF6',
  },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Balance Practitioner',
    text: 'This app has transformed how I track my clients\' progress. The insights are incredible!',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Life Coach',
    text: 'Finally, a tool that makes balance tracking simple and meaningful. Highly recommended!',
    rating: 5,
  },
];

export default function LandingScreen() {
  useEffect(() => {
    // Auto-rotate feature highlights
    const timer = setInterval(() => {
      // Feature rotation logic can be added here
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleGetStarted = async () => {
    await AsyncStorage.setItem('hasSeenLanding', 'true');
    router.replace('/(auth)/signup');
  };

  const handleSignIn = () => {
    router.replace('/(auth)/login');
  };

  const handleStartOnboarding = async () => {
    await AsyncStorage.setItem('hasSeenLanding', 'true');
    router.replace('/onboarding');
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.heroSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <SafeAreaView style={styles.heroContent}>
            <View style={styles.heroHeader}>
              <View style={styles.logoContainer}>
                <Brain size={40} color="#FFFFFF" />
                <Text style={styles.logoText}>HarmonyK</Text>
              </View>
              <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
                <Text style={styles.signInText}>Sign In</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.heroMain}>
              <Text style={styles.heroTitle}>
                Transform Your Mind,{'\n'}Track Your Progress
              </Text>
              <Text style={styles.heroSubtitle}>
                The ultimate balance tracking app for practitioners and individuals seeking personal transformation.
              </Text>

              <View style={styles.heroStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>10K+</Text>
                  <Text style={styles.statLabel}>Sessions Tracked</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>95%</Text>
                  <Text style={styles.statLabel}>Success Rate</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>500+</Text>
                  <Text style={styles.statLabel}>Happy Users</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.ctaButton} onPress={handleGetStarted}>
                <Text style={styles.ctaButtonText}>Get Started Free</Text>
                <ChevronRight size={20} color="#667eea" style={styles.ctaIcon} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.learnMoreButton} onPress={handleStartOnboarding}>
                <Text style={styles.learnMoreText}>Take a Tour</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Why Choose HarmonyK?</Text>
          <Text style={styles.sectionSubtitle}>
            Discover the features that make balance tracking effortless and insightful
          </Text>

          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: `${feature.color}15` }]}>
                  <feature.icon size={24} color={feature.color} />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* How It Works Section */}
        <View style={styles.howItWorksSection}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepsContainer}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepTitle}>Create Your Account</Text>
              <Text style={styles.stepDescription}>
                Sign up in seconds and set up your personal profile
              </Text>
            </View>

            <View style={styles.stepConnector} />

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepTitle}>Log Your Sessions</Text>
              <Text style={styles.stepDescription}>
                Record balance sessions with detailed information and outcomes
              </Text>
            </View>

            <View style={styles.stepConnector} />

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepTitle}>Track Progress</Text>
              <Text style={styles.stepDescription}>
                Monitor your transformation with insights and analytics
              </Text>
            </View>
          </View>
        </View>

        {/* Testimonials Section */}
        <View style={styles.testimonialsSection}>
          <Text style={styles.sectionTitle}>What Our Users Say</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.testimonialsScroll}>
            {testimonials.map((testimonial, index) => (
              <View key={index} style={styles.testimonialCard}>
                <View style={styles.starsContainer}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} color="#F59E0B" fill="#F59E0B" />
                  ))}
                </View>
                <Text style={styles.testimonialText}>&quot;{testimonial.text}&quot;</Text>
                <Text style={styles.testimonialName}>{testimonial.name}</Text>
                <Text style={styles.testimonialRole}>{testimonial.role}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* CTA Section */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.ctaSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Zap size={48} color="#FFFFFF" />
          <Text style={styles.ctaSectionTitle}>Ready to Transform Your Life?</Text>
          <Text style={styles.ctaSectionSubtitle}>
            Join thousands of users who are already tracking their progress
          </Text>
          <TouchableOpacity style={styles.ctaSectionButton} onPress={handleGetStarted}>
            <Text style={styles.ctaSectionButtonText}>Start Your Journey</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for the balance tracking community
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  heroSection: {
    minHeight: height * 0.8,
    paddingHorizontal: 20,
  },
  heroContent: {
    flex: 1,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  signInButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  signInText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  heroMain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 44,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#E0E7FF',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#E0E7FF',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 20,
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#667eea',
  },
  ctaIcon: {
    marginLeft: 8,
  },
  learnMoreButton: {
    paddingVertical: 12,
  },
  learnMoreText: {
    color: '#E0E7FF',
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  featuresSection: {
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  howItWorksSection: {
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  stepsContainer: {
    alignItems: 'center',
  },
  step: {
    alignItems: 'center',
    maxWidth: 280,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  stepConnector: {
    width: 2,
    height: 40,
    backgroundColor: '#E2E8F0',
    marginVertical: 20,
  },
  testimonialsSection: {
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  testimonialsScroll: {
    marginTop: 20,
  },
  testimonialCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginRight: 16,
    width: width * 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  testimonialText: {
    fontSize: 16,
    color: '#1E293B',
    lineHeight: 24,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  testimonialRole: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  ctaSection: {
    padding: 40,
    alignItems: 'center',
  },
  ctaSectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  ctaSectionSubtitle: {
    fontSize: 16,
    color: '#E0E7FF',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  ctaSectionButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaSectionButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#667eea',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  footerText: {
    fontSize: 14,
    color: '#64748B',
  },
});