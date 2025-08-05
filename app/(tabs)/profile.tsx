import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  Modal,
  Animated,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import { 
  User, 
  Mail, 
  Calendar, 
  LogOut, 
  Save, 
  MapPin, 
  Phone, 
  Globe, 
  Briefcase, 
  Award, 
  Target, 
  Heart, 
  Settings, 
  ChevronRight, 
  Edit,
  CheckCircle,
  AlertCircle,
  Star,
  Plus,
  Camera,
  Bell,
  Shield,
  Sparkles
} from 'lucide-react-native';
import { t } from '@/lib/i18n';
import { UserProfile, CertificationLevel, SpecializationArea, WellnessPriority, calculateProfileCompletion, getProfileCompletionTasks } from '@/types/profile';
import LanguageSelector from '@/components/LanguageSelector';

interface ExtendedUserProfile extends UserProfile {
  phone?: string;
  location?: string;
  date_of_birth?: string;
  is_practitioner: boolean;
  certification_level?: CertificationLevel;
  years_experience?: number;
  specialization_areas?: SpecializationArea[];
  organization?: string;
  website?: string;
  bio?: string;
  primary_goal?: string;
  secondary_goals?: string[];
  wellness_priorities?: WellnessPriority[];
  notifications_enabled: boolean;
  email_notifications: boolean;
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<ExtendedUserProfile | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [profileAnimation] = useState(new Animated.Value(0));
  const [editingField, setEditingField] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isPractitioner, setIsPractitioner] = useState(false);
  const [certificationLevel, setCertificationLevel] = useState<CertificationLevel>('student');
  const [yearsExperience, setYearsExperience] = useState('');
  const [organization, setOrganization] = useState('');
  const [website, setWebsite] = useState('');
  const [bio, setBio] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    getProfile();
    // Animate profile load
    Animated.timing(profileAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const getProfile = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Get extended profile data from user_metadata or separate profiles table
        const extendedProfile: ExtendedUserProfile = {
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || '',
          created_at: user.created_at,
          phone: user.user_metadata?.phone || '',
          location: user.user_metadata?.location || '',
          date_of_birth: user.user_metadata?.date_of_birth || '',
          is_practitioner: user.user_metadata?.is_practitioner || false,
          certification_level: user.user_metadata?.certification_level || 'student',
          years_experience: user.user_metadata?.years_experience || 0,
          specialization_areas: user.user_metadata?.specialization_areas || [],
          organization: user.user_metadata?.organization || '',
          website: user.user_metadata?.website || '',
          bio: user.user_metadata?.bio || '',
          primary_goal: user.user_metadata?.primary_goal || '',
          secondary_goals: user.user_metadata?.secondary_goals || [],
          wellness_priorities: user.user_metadata?.wellness_priorities || [],
          notifications_enabled: user.user_metadata?.notifications_enabled ?? true,
          email_notifications: user.user_metadata?.email_notifications ?? true,
          // Required fields for UserProfile interface
          language: user.user_metadata?.language || 'en',
          theme: user.user_metadata?.theme || 'light',
          data_sharing_consent: user.user_metadata?.data_sharing_consent || false,
          marketing_consent: user.user_metadata?.marketing_consent || false,
          terms_accepted_at: user.user_metadata?.terms_accepted_at || user.created_at,
          privacy_policy_accepted_at: user.user_metadata?.privacy_policy_accepted_at || user.created_at,
          profile_completion_percentage: 0,
          onboarding_completed: user.user_metadata?.onboarding_completed || false,
          last_profile_update: user.updated_at || user.created_at,
          created_at_timestamp: user.created_at,
          updated_at: user.updated_at || user.created_at,
        };

        setProfile(extendedProfile);
        setCompletionPercentage(calculateProfileCompletion(extendedProfile));
        
        // Set form states
        setFullName(extendedProfile.full_name);
        setPhone(extendedProfile.phone || '');
        setLocation(extendedProfile.location || '');
        setDateOfBirth(extendedProfile.date_of_birth || '');
        setIsPractitioner(extendedProfile.is_practitioner);
        setCertificationLevel(extendedProfile.certification_level || 'student');
        setYearsExperience(extendedProfile.years_experience?.toString() || '');
        setOrganization(extendedProfile.organization || '');
        setWebsite(extendedProfile.website || '');
        setBio(extendedProfile.bio || '');
        setPrimaryGoal(extendedProfile.primary_goal || '');
        setNotificationsEnabled(extendedProfile.notifications_enabled);
        setEmailNotifications(extendedProfile.email_notifications);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  const onRefresh = () => {
    getProfile(true);
  };

  const updateProfile = async (updates: Partial<ExtendedUserProfile>) => {
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: updates
      });

      if (error) {
        Alert.alert(t('common.error'), error.message);
      } else {
        // Animate success
        Animated.sequence([
          Animated.timing(profileAnimation, {
            toValue: 0.8,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(profileAnimation, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          })
        ]).start();
        
        Alert.alert(
          `${t('common.success')} ✨`,
          t('profile.profileUpdated'),
          [{ text: 'Great!', style: 'default' }]
        );
        getProfile(); // Refresh profile data
        setEditingField(null);
      }
    } catch (error) {
      Alert.alert(t('common.error'), 'An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      t('auth.signOut'),
      t('profile.signOutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('auth.signOut'),
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const ProfileSection = ({ title, children, icon: Icon, color = '#3B82F6' }: {
    title: string;
    children: React.ReactNode;
    icon: any;
    color?: string;
  }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIcon, { backgroundColor: color + '20' }]}>
          <Icon size={20} color={color} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  const EditableField = ({ 
    label, 
    value, 
    onChangeText, 
    placeholder, 
    fieldKey, 
    icon: Icon,
    keyboardType = 'default',
    multiline = false 
  }: any) => {
    const isEditing = editingField === fieldKey;
    
    return (
      <View style={styles.fieldContainer}>
        <View style={styles.fieldHeader}>
          <View style={styles.fieldInfo}>
            <Icon size={16} color="#6B7280" style={styles.fieldIcon} />
            <Text style={styles.fieldLabel}>{label}</Text>
          </View>
          <TouchableOpacity 
            onPress={() => setEditingField(isEditing ? null : fieldKey)}
            style={styles.editButton}
          >
            <Edit size={14} color={isEditing ? '#10B981' : '#6B7280'} />
          </TouchableOpacity>
        </View>
        
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={[styles.editInput, multiline && styles.multilineInput]}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              keyboardType={keyboardType}
              multiline={multiline}
              numberOfLines={multiline ? 3 : 1}
              autoFocus
            />
            <View style={styles.editActions}>
              <TouchableOpacity 
                onPress={() => setEditingField(null)}
                style={[styles.actionButton, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {
                  const updates = { [fieldKey]: value };
                  updateProfile(updates);
                }}
                style={[styles.actionButton, styles.saveButton]}
                disabled={saving}
              >
                <Text style={styles.saveButtonText}>
                  {saving ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={styles.fieldValue}>{value || placeholder}</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView 
        style={[styles.content, { opacity: profileAnimation }]} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header with gradient */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{t('profile.title')}</Text>
            <TouchableOpacity style={styles.settingsButton} onPress={() => setShowLanguageModal(true)}>
              <Settings size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Profile Avatar and Basic Info */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <User size={48} color="#FFFFFF" />
            <TouchableOpacity style={styles.avatarEditButton}>
              <Camera size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{profile?.full_name || 'User'}</Text>
          <Text style={styles.userEmail}>{profile?.email}</Text>
          
          {/* Profile Completion */}
          <View style={styles.completionContainer}>
            <View style={styles.completionHeader}>
              <Sparkles size={16} color="#F59E0B" />
              <Text style={styles.completionText}>Profile {completionPercentage}% Complete</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${completionPercentage}%` }]} />
            </View>
          </View>
          
          {profile?.is_practitioner && (
            <View style={styles.practitionerBadge}>
              <Award size={16} color="#10B981" />
              <Text style={styles.practitionerText}>Balance Practitioner</Text>
            </View>
          )}
        </View>

        {/* Personal Information */}
        <ProfileSection title={t('profile.personalInfo')} icon={User} color="#3B82F6">
          <EditableField
            label={t('profile.fullName')}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            fieldKey="full_name"
            icon={User}
          />
          
          <EditableField
            label={t('profile.phone')}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            fieldKey="phone"
            icon={Phone}
            keyboardType="phone-pad"
          />
          
          <EditableField
            label={t('profile.location')}
            value={location}
            onChangeText={setLocation}
            placeholder="Enter your location"
            fieldKey="location"
            icon={MapPin}
          />
          
          <View style={styles.infoRow}>
            <Mail size={16} color="#6B7280" style={styles.fieldIcon} />
            <View style={styles.fieldInfo}>
              <Text style={styles.fieldLabel}>{t('profile.email')}</Text>
              <Text style={styles.fieldValue}>{profile?.email}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Calendar size={16} color="#6B7280" style={styles.fieldIcon} />
            <View style={styles.fieldInfo}>
              <Text style={styles.fieldLabel}>{t('profile.memberSince')}</Text>
              <Text style={styles.fieldValue}>
                {profile?.created_at ? formatDate(profile.created_at) : 'Unknown'}
              </Text>
            </View>
          </View>
        </ProfileSection>

        {/* Professional Information */}
        {profile?.is_practitioner && (
          <ProfileSection title={t('profile.practitionerInfo')} icon={Award} color="#10B981">
            <EditableField
              label={t('profile.organization')}
              value={organization}
              onChangeText={setOrganization}
              placeholder="Enter your organization"
              fieldKey="organization"
              icon={Briefcase}
            />
            
            <EditableField
              label={t('profile.website')}
              value={website}
              onChangeText={setWebsite}
              placeholder="Enter your website URL"
              fieldKey="website"
              icon={Globe}
              keyboardType="url"
            />
            
            <EditableField
              label={t('profile.bio')}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself"
              fieldKey="bio"
              icon={Heart}
              multiline
            />
          </ProfileSection>
        )}

        {/* Goals & Preferences */}
        <ProfileSection title={t('profile.goals')} icon={Target} color="#F59E0B">
          <EditableField
            label={t('profile.primaryGoal')}
            value={primaryGoal}
            onChangeText={setPrimaryGoal}
            placeholder="What's your main goal?"
            fieldKey="primary_goal"
            icon={Target}
            multiline
          />
        </ProfileSection>

        {/* Settings & Preferences */}
        <ProfileSection title={t('profile.preferences')} icon={Settings} color="#8B5CF6">
          <TouchableOpacity style={styles.preferenceItem} onPress={() => setShowLanguageModal(true)}>
            <View style={styles.preferenceInfo}>
              <Globe size={16} color="#3B82F6" style={styles.fieldIcon} />
              <Text style={styles.fieldLabel}>{t('profile.language')}</Text>
            </View>
            <ChevronRight size={16} color="#6B7280" />
          </TouchableOpacity>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Bell size={16} color="#F59E0B" style={styles.fieldIcon} />
              <Text style={styles.fieldLabel}>{t('profile.notifications')}</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={(value) => {
                setNotificationsEnabled(value);
                updateProfile({ notifications_enabled: value });
              }}
              trackColor={{ false: '#E2E8F0', true: '#93C5FD' }}
              thumbColor={notificationsEnabled ? '#3B82F6' : '#9CA3AF'}
            />
          </View>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Mail size={16} color="#10B981" style={styles.fieldIcon} />
              <Text style={styles.fieldLabel}>Email Notifications</Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={(value) => {
                setEmailNotifications(value);
                updateProfile({ email_notifications: value });
              }}
              trackColor={{ false: '#E2E8F0', true: '#A7F3D0' }}
              thumbColor={emailNotifications ? '#10B981' : '#9CA3AF'}
            />
          </View>
        </ProfileSection>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut size={20} color="#EF4444" style={styles.buttonIcon} />
          <Text style={styles.signOutButtonText}>{t('auth.signOut')}</Text>
        </TouchableOpacity>
        
        <View style={styles.bottomPadding} />
      </Animated.ScrollView>

      {/* Language Selector Modal */}
      <LanguageSelector
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        onLanguageChange={async (newLanguage) => {
          // Update the user's language preference in Supabase
          await updateProfile({ language: newLanguage });
          // Refresh profile to show changes
          getProfile();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 100,
    marginBottom: -60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  settingsButton: {
    padding: 8,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  avatarContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(59, 130, 246, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 16,
    textAlign: 'center',
  },
  completionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    maxWidth: 300,
  },
  completionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  completionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 6,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  practitionerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  practitionerText: {
    color: '#065F46',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  fieldContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fieldIcon: {
    marginRight: 8,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  fieldValue: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
    marginTop: 4,
  },
  editButton: {
    padding: 8,
    borderRadius: 6,
  },
  editContainer: {
    marginTop: 8,
  },
  editInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 12,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelButtonText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#10B981',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  preferenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  signOutButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    minHeight: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 24,
    shadowColor: '#EF4444',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  signOutButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 8,
  },
  bottomPadding: {
    height: 40,
  },
});