export interface UserProfile {
  // Basic User Info (from auth)
  id: string;
  email: string;
  created_at: string;
  
  // Personal Information
  full_name: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  phone?: string;
  location?: string;
  timezone?: string;
  avatar_url?: string;
  
  // Professional Information
  is_practitioner: boolean;
  certification_level?: CertificationLevel;
  years_experience?: number;
  specialization_areas?: SpecializationArea[];
  organization?: string;
  website?: string;
  linkedin_url?: string;
  bio?: string;
  
  // Personal Goals & Motivations
  primary_goal?: string;
  secondary_goals?: string[];
  motivation_statement?: string;
  stress_management_goals?: string[];
  wellness_priorities?: WellnessPriority[];
  
  // Preferences
  language: 'en' | 'es' | 'pt';
  theme: 'light' | 'dark' | 'system';
  notifications_enabled: boolean;
  email_notifications: boolean;
  reminder_frequency?: ReminderFrequency;
  preferred_session_time?: string;
  
  // Privacy & Consent
  data_sharing_consent: boolean;
  marketing_consent: boolean;
  terms_accepted_at: string;
  privacy_policy_accepted_at: string;
  
  // Profile Completion
  profile_completion_percentage: number;
  onboarding_completed: boolean;
  last_profile_update: string;
  
  // Metadata
  created_at_timestamp: string;
  updated_at: string;
}

export type CertificationLevel = 
  | 'student'
  | 'basic'
  | 'advanced'
  | 'instructor'
  | 'other';

export type SpecializationArea = 
  | 'relationships'
  | 'health'
  | 'abundance'
  | 'spirituality'
  | 'performance'
  | 'stress'
  | 'trauma'
  | 'addiction'
  | 'career'
  | 'creativity'
  | 'parenting'
  | 'grief'
  | 'other';

export type WellnessPriority = 
  | 'stress_reduction'
  | 'emotional_balance'
  | 'physical_health'
  | 'mental_clarity'
  | 'spiritual_growth'
  | 'relationship_improvement'
  | 'career_success'
  | 'financial_abundance'
  | 'creativity'
  | 'personal_confidence';

export type ReminderFrequency = 
  | 'daily'
  | 'weekly'
  | 'bi_weekly'
  | 'monthly'
  | 'custom'
  | 'none';

export interface ProfileFormData {
  // Personal Info
  full_name: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone: string;
  location: string;
  
  // Professional Info
  is_practitioner: boolean;
  certification_level: CertificationLevel;
  years_experience: number;
  specialization_areas: SpecializationArea[];
  organization: string;
  website: string;
  linkedin_url: string;
  bio: string;
  
  // Goals & Motivations
  primary_goal: string;
  secondary_goals: string[];
  motivation_statement: string;
  stress_management_goals: string[];
  wellness_priorities: WellnessPriority[];
  
  // Preferences
  language: 'en' | 'es' | 'pt';
  theme: 'light' | 'dark' | 'system';
  notifications_enabled: boolean;
  email_notifications: boolean;
  reminder_frequency: ReminderFrequency;
  preferred_session_time: string;
}

export interface ProfileValidation {
  field: keyof ProfileFormData;
  isValid: boolean;
  error?: string;
}

export const calculateProfileCompletion = (profile: Partial<UserProfile>): number => {
  const fields = [
    'full_name',
    'date_of_birth',
    'location',
    'primary_goal',
    'motivation_statement',
    'language',
    'is_practitioner',
  ];
  
  const practitionerFields = [
    'certification_level',
    'years_experience',
    'specialization_areas',
    'bio',
  ];
  
  let completedFields = 0;
  let totalFields = fields.length;
  
  // Check basic fields
  fields.forEach(field => {
    if (profile[field as keyof UserProfile]) {
      completedFields++;
    }
  });
  
  // Add practitioner fields if they are a practitioner
  if (profile.is_practitioner) {
    totalFields += practitionerFields.length;
    practitionerFields.forEach(field => {
      if (profile[field as keyof UserProfile]) {
        completedFields++;
      }
    });
  }
  
  return Math.round((completedFields / totalFields) * 100);
};

export const getProfileCompletionTasks = (profile: Partial<UserProfile>): string[] => {
  const tasks: string[] = [];
  
  if (!profile.full_name) tasks.push('Add your full name');
  if (!profile.date_of_birth) tasks.push('Add your date of birth');
  if (!profile.location) tasks.push('Add your location');
  if (!profile.primary_goal) tasks.push('Set your primary goal');
  if (!profile.motivation_statement) tasks.push('Share what motivates you');
  if (!profile.language) tasks.push('Select your preferred language');
  
  if (profile.is_practitioner) {
    if (!profile.certification_level) tasks.push('Add your certification level');
    if (!profile.years_experience) tasks.push('Add your years of experience');
    if (!profile.specialization_areas?.length) tasks.push('Select your specialization areas');
    if (!profile.bio) tasks.push('Write a professional bio');
  }
  
  return tasks;
};