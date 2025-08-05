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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  Plus
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
  }, []);

  const getProfile = async () => {
    try {
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
    }
  };

  const updateProfile = async (updates: Partial<ExtendedUserProfile>) => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: updates
    });

    if (error) {
      Alert.alert(t('common.error'), error.message);
    } else {
      Alert.alert(t('common.success'), t('profile.profileUpdated'));
      getProfile(); // Refresh profile data
    }
    setSaving(false);
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

  const renderProfileCompletionCard = () => {
    const tasks = getProfileCompletionTasks(profile || {});
    
    return (
      <View style={styles.completionCard}>
        <View style={styles.completionHeader}>
          <Text style={styles.completionTitle}>Profile Completion</Text>
          <Text style={styles.completionPercentage}>{completionPercentage}%</Text>
        </View>
        
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${completionPercentage}%` }]} />
        </View>
        
        {tasks.length > 0 && (
          <View style={styles.completionTasks}>
            <Text style={styles.tasksTitle}>Complete your profile:</Text>
            {tasks.slice(0, 3).map((task, index) => (
              <View key={index} style={styles.taskItem}>
                <AlertCircle size={16} color="#F59E0B" />
                <Text style={styles.taskText}>{task}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderSection = (title: string, icon: React.ReactNode, children: React.ReactNode, sectionKey: string) => {
    const isEditing = editingSection === sectionKey;
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            {icon}
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditingSection(isEditing ? null : sectionKey)}
          >
            <Edit size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>
        <View style={styles.sectionContent}>
          {children}
        </View>
      </View>
    );
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('profile.title')}</Text>
          <TouchableOpacity style={styles.settingsButton} onPress={() => setShowLanguageModal(true)}>
            <Settings size={24} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Profile Avatar and Basic Info */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <User size={48} color="#3B82F6" />
          </View>
          <Text style={styles.userName}>{profile?.full_name || 'User'}</Text>
          <Text style={styles.userEmail}>{profile?.email}</Text>
          {profile?.is_practitioner && (
            <View style={styles.practitionerBadge}>
              <Award size={16} color="#10B981" />
              <Text style={styles.practitionerText}>PSYCH-K® Practitioner</Text>
            </View>
          )}
        </View>

        {/* Profile Completion */}
        {completionPercentage < 100 && renderProfileCompletionCard()}

        {/* Personal Information */}
        {renderSection(
          t('profile.personalInfo'),
          <User size={20} color="#3B82F6" />,
          <>
            <View style={styles.infoRow}>
              <Mail size={16} color="#6B7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t('profile.email')}</Text>
                <Text style={styles.infoValue}>{profile?.email}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <User size={16} color="#6B7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t('profile.fullName')}</Text>
                {editingSection === 'personal' ? (
                  <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder={t('profile.fullName')}
                  />
                ) : (
                  <Text style={styles.infoValue}>{profile?.full_name || 'Not set'}</Text>
                )}
              </View>
            </View>

            <View style={styles.infoRow}>
              <Phone size={16} color="#6B7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                {editingSection === 'personal' ? (
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Phone number"
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text style={styles.infoValue}>{profile?.phone || 'Not set'}</Text>
                )}
              </View>
            </View>

            <View style={styles.infoRow}>
              <MapPin size={16} color="#6B7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t('profile.location')}</Text>
                {editingSection === 'personal' ? (
                  <TextInput
                    style={styles.input}
                    value={location}
                    onChangeText={setLocation}
                    placeholder={t('profile.location')}
                  />
                ) : (
                  <Text style={styles.infoValue}>{profile?.location || 'Not set'}</Text>
                )}
              </View>
            </View>

            <View style={styles.infoRow}>
              <Calendar size={16} color="#6B7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Date of Birth</Text>
                {editingSection === 'personal' ? (
                  <TextInput
                    style={styles.input}
                    value={dateOfBirth}
                    onChangeText={setDateOfBirth}
                    placeholder="YYYY-MM-DD"
                  />
                ) : (
                  <Text style={styles.infoValue}>
                    {profile?.date_of_birth ? formatDate(profile.date_of_birth) : 'Not set'}
                  </Text>
                )}
              </View>
            </View>

            {editingSection === 'personal' && (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  updateProfile({
                    full_name: fullName,
                    phone,
                    location,
                    date_of_birth: dateOfBirth,
                  });
                  setEditingSection(null);
                }}
                disabled={saving}
              >
                <Save size={16} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>
                  {saving ? 'Saving...' : t('common.save')}
                </Text>
              </TouchableOpacity>
            )}
          </>,
          'personal'
        )}

        {/* Practitioner Information */}
        {renderSection(
          t('profile.practitionerInfo'),
          <Award size={20} color="#10B981" />,
          <>
            <View style={styles.infoRow}>
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Are you a PSYCH-K® practitioner?</Text>
                <Switch
                  value={isPractitioner}
                  onValueChange={setIsPractitioner}
                  disabled={editingSection !== 'practitioner'}
                />
              </View>
            </View>

            {isPractitioner && (
              <>
                <View style={styles.infoRow}>
                  <Award size={16} color="#6B7280" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>{t('profile.certification')}</Text>
                    {editingSection === 'practitioner' ? (
                      <View style={styles.pickerContainer}>
                        {(['student', 'basic', 'advanced', 'instructor', 'other'] as CertificationLevel[]).map(level => (
                          <TouchableOpacity
                            key={level}
                            style={[
                              styles.pickerOption,
                              certificationLevel === level && styles.pickerOptionSelected
                            ]}
                            onPress={() => setCertificationLevel(level)}
                          >
                            <Text style={[
                              styles.pickerOptionText,
                              certificationLevel === level && styles.pickerOptionTextSelected
                            ]}>
                              {t(`profile.certificationLevels.${level}`)}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    ) : (
                      <Text style={styles.infoValue}>
                        {t(`profile.certificationLevels.${profile?.certification_level || 'student'}`)}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Briefcase size={16} color="#6B7280" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>{t('profile.experience')}</Text>
                    {editingSection === 'practitioner' ? (
                      <TextInput
                        style={styles.input}
                        value={yearsExperience}
                        onChangeText={setYearsExperience}
                        placeholder="Years"
                        keyboardType="numeric"
                      />
                    ) : (
                      <Text style={styles.infoValue}>
                        {profile?.years_experience ? `${profile.years_experience} years` : 'Not set'}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Briefcase size={16} color="#6B7280" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Organization</Text>
                    {editingSection === 'practitioner' ? (
                      <TextInput
                        style={styles.input}
                        value={organization}
                        onChangeText={setOrganization}
                        placeholder="Organization or practice name"
                      />
                    ) : (
                      <Text style={styles.infoValue}>{profile?.organization || 'Not set'}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Globe size={16} color="#6B7280" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>{t('profile.website')}</Text>
                    {editingSection === 'practitioner' ? (
                      <TextInput
                        style={styles.input}
                        value={website}
                        onChangeText={setWebsite}
                        placeholder="https://..."
                        keyboardType="url"
                      />
                    ) : (
                      <Text style={styles.infoValue}>{profile?.website || 'Not set'}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.bioContainer}>
                  <Text style={styles.infoLabel}>{t('profile.bio')}</Text>
                  {editingSection === 'practitioner' ? (
                    <TextInput
                      style={styles.bioInput}
                      value={bio}
                      onChangeText={setBio}
                      placeholder="Tell us about your practice and experience..."
                      multiline
                      numberOfLines={4}
                    />
                  ) : (
                    <Text style={styles.bioText}>{profile?.bio || 'Not set'}</Text>
                  )}
                </View>
              </>
            )}

            {editingSection === 'practitioner' && (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  updateProfile({
                    is_practitioner: isPractitioner,
                    certification_level: certificationLevel,
                    years_experience: parseInt(yearsExperience) || 0,
                    organization,
                    website,
                    bio,
                  });
                  setEditingSection(null);
                }}
                disabled={saving}
              >
                <Save size={16} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>
                  {saving ? 'Saving...' : t('common.save')}
                </Text>
              </TouchableOpacity>
            )}
          </>,
          'practitioner'
        )}

        {/* Goals & Motivations */}
        {renderSection(
          t('profile.goals'),
          <Target size={20} color="#F59E0B" />,
          <>
            <View style={styles.infoRow}>
              <Target size={16} color="#6B7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t('profile.primaryGoal')}</Text>
                {editingSection === 'goals' ? (
                  <TextInput
                    style={styles.input}
                    value={primaryGoal}
                    onChangeText={setPrimaryGoal}
                    placeholder="What's your main goal?"
                  />
                ) : (
                  <Text style={styles.infoValue}>{profile?.primary_goal || 'Not set'}</Text>
                )}
              </View>
            </View>

            {editingSection === 'goals' && (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  updateProfile({
                    primary_goal: primaryGoal,
                  });
                  setEditingSection(null);
                }}
                disabled={saving}
              >
                <Save size={16} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>
                  {saving ? 'Saving...' : t('common.save')}
                </Text>
              </TouchableOpacity>
            )}
          </>,
          'goals'
        )}

        {/* Preferences */}
        {renderSection(
          t('profile.preferences'),
          <Settings size={20} color="#8B5CF6" />,
          <>
            <TouchableOpacity style={styles.preferenceRow} onPress={() => setShowLanguageModal(true)}>
              <Globe size={16} color="#6B7280" />
              <View style={styles.preferenceContent}>
                <Text style={styles.preferenceLabel}>{t('profile.language')}</Text>
                <Text style={styles.preferenceValue}>
                  {profile?.language === 'en' && 'English'}
                  {profile?.language === 'es' && 'Español'}
                  {profile?.language === 'pt' && 'Português'}
                </Text>
              </View>
              <ChevronRight size={16} color="#6B7280" />
            </TouchableOpacity>

            <View style={styles.preferenceRow}>
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>{t('profile.notifications')}</Text>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={(value) => {
                    setNotificationsEnabled(value);
                    updateProfile({ notifications_enabled: value });
                  }}
                />
              </View>
            </View>

            <View style={styles.preferenceRow}>
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Email Notifications</Text>
                <Switch
                  value={emailNotifications}
                  onValueChange={(value) => {
                    setEmailNotifications(value);
                    updateProfile({ email_notifications: value });
                  }}
                />
              </View>
            </View>
          </>,
          'preferences'
        )}

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.signOutButtonText}>{t('auth.signOut')}</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Language Selector Modal */}
      <LanguageSelector
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        onLanguageChange={() => {
          getProfile(); // Refresh to show updated language
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
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
  },
  settingsButton: {
    padding: 8,
  },
  avatarSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 12,
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
  completionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  completionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  completionPercentage: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B82F6',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  completionTasks: {},
  tasksTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  taskText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 12,
  },
  editButton: {
    padding: 8,
  },
  sectionContent: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
  },
  bioContainer: {
    marginTop: 8,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  bioText: {
    fontSize: 16,
    color: '#1E293B',
    lineHeight: 24,
    marginTop: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
    flex: 1,
  },
  pickerContainer: {
    marginTop: 8,
  },
  pickerOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pickerOptionSelected: {
    backgroundColor: '#EBF4FF',
    borderColor: '#3B82F6',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#1E293B',
  },
  pickerOptionTextSelected: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  preferenceContent: {
    marginLeft: 12,
    flex: 1,
  },
  preferenceLabel: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  preferenceValue: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    paddingVertical: 16,
  },
  signOutButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 100,
  },
});