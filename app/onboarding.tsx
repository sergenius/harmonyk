import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Brain, 
  Heart, 
  Target, 
  BarChart3,
  Shield,
  Users,
  ChevronRight,
  ChevronLeft,
  Check
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    icon: Brain,
    title: 'Welcome to HarmonyK',
    subtitle: 'Your Balance Journey Begins',
    description: 'Track your balance sessions, monitor progress, and transform your life with our comprehensive balance tracking system.',
    color: '#3B82F6',
  },
  {
    id: 2,
    icon: Heart,
    title: 'Track Your Wellness',
    subtitle: 'Monitor Stress & Progress',
    description: 'Log stress levels before and after sessions to see your transformation in real-time with detailed analytics.',
    color: '#EF4444',
  },
  {
    id: 3,
    icon: Target,
    title: 'Achieve Your Goals',
    subtitle: 'Personalized Insights',
    description: 'Set meaningful goals and receive personalized insights to help you achieve lasting positive change.',
    color: '#10B981',
  },
  {
    id: 4,
    icon: BarChart3,
    title: 'Visualize Growth',
    subtitle: 'Powerful Analytics',
    description: 'See your progress with beautiful charts and detailed statistics that motivate continued growth.',
    color: '#F59E0B',
  },
  {
    id: 5,
    icon: Shield,
    title: 'Private & Secure',
    subtitle: 'Your Data is Protected',
    description: 'Enterprise-level security ensures your personal journey remains private and secure at all times.',
    color: '#8B5CF6',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      scrollViewRef.current?.scrollTo({
        x: prevIndex * width,
        animated: true,
      });
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
    router.replace('/(auth)/signup');
  };

  const handleComplete = async () => {
    await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
    router.replace('/(auth)/signup');
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    setCurrentIndex(index);
  };

  const currentItem = onboardingData[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[currentItem.color, `${currentItem.color}CC`]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          <Text style={styles.progressText}>
            {currentIndex + 1} of {onboardingData.length}
          </Text>
        </View>

        {/* Content */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {onboardingData.map((item, index) => (
            <View key={item.id} style={styles.slide}>
              <View style={styles.iconContainer}>
                <View style={styles.iconBackground}>
                  <item.icon size={64} color="#FFFFFF" />
                </View>
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>

              {/* Feature Preview */}
              <View style={styles.previewContainer}>
                <View style={styles.previewCard}>
                  {index === 0 && (
                    <View style={styles.dashboardPreview}>
                      <View style={styles.statCard}>
                        <Text style={styles.statNumber}>24</Text>
                        <Text style={styles.statLabel}>Sessions</Text>
                      </View>
                      <View style={styles.statCard}>
                        <Text style={styles.statNumber}>89%</Text>
                        <Text style={styles.statLabel}>Success</Text>
                      </View>
                    </View>
                  )}
                  {index === 1 && (
                    <View style={styles.stressPreview}>
                      <View style={styles.stressBar}>
                        <View style={[styles.stressFill, { width: '80%', backgroundColor: '#EF4444' }]} />
                      </View>
                      <Text style={styles.stressLabel}>Before: 8/10</Text>
                      <View style={styles.stressBar}>
                        <View style={[styles.stressFill, { width: '30%', backgroundColor: '#10B981' }]} />
                      </View>
                      <Text style={styles.stressLabel}>After: 3/10</Text>
                    </View>
                  )}
                  {index === 2 && (
                    <View style={styles.goalPreview}>
                      <View style={styles.goalItem}>
                        <Check size={16} color="#10B981" />
                        <Text style={styles.goalText}>Reduce anxiety</Text>
                      </View>
                      <View style={styles.goalItem}>
                        <Check size={16} color="#10B981" />
                        <Text style={styles.goalText}>Improve confidence</Text>
                      </View>
                      <View style={styles.goalItem}>
                        <View style={styles.goalCircle} />
                        <Text style={styles.goalText}>Better relationships</Text>
                      </View>
                    </View>
                  )}
                  {index === 3 && (
                    <View style={styles.chartPreview}>
                      <View style={styles.chartBars}>
                        <View style={[styles.chartBar, { height: 20 }]} />
                        <View style={[styles.chartBar, { height: 35 }]} />
                        <View style={[styles.chartBar, { height: 45 }]} />
                        <View style={[styles.chartBar, { height: 60 }]} />
                      </View>
                      <Text style={styles.chartLabel}>Weekly Progress</Text>
                    </View>
                  )}
                  {index === 4 && (
                    <View style={styles.securityPreview}>
                      <Shield size={48} color="#8B5CF6" />
                      <Text style={styles.securityText}>End-to-end encrypted</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index === currentIndex ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)',
                  width: index === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* Navigation */}
        <View style={styles.navigation}>
          <TouchableOpacity
            style={[styles.navButton, { opacity: currentIndex === 0 ? 0.3 : 1 }]}
            onPress={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <ChevronRight size={20} color={currentItem.color} style={styles.nextIcon} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '500',
  },
  progressText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: width,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 120,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  previewContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  previewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  dashboardPreview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  stressPreview: {
    width: '100%',
  },
  stressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginVertical: 8,
  },
  stressFill: {
    height: '100%',
    borderRadius: 4,
  },
  stressLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  goalPreview: {
    width: '100%',
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalText: {
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 12,
  },
  goalCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  chartPreview: {
    alignItems: 'center',
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'end',
    marginBottom: 16,
  },
  chartBar: {
    width: 20,
    backgroundColor: '#F59E0B',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  chartLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  securityPreview: {
    alignItems: 'center',
  },
  securityText: {
    fontSize: 16,
    color: '#1E293B',
    marginTop: 12,
    fontWeight: '500',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  nextIcon: {
    marginLeft: 8,
  },
});