import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { 
  Save, 
  X, 
  ChevronDown, 
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react-native';
import { Database } from '@/types/database';

type BalanceType = Database['public']['Tables']['balance_types']['Row'];
type BalanceInsert = Database['public']['Tables']['balances']['Insert'];

export default function CreateBalanceScreen() {
  const [loading, setLoading] = useState(false);
  const [balanceTypes, setBalanceTypes] = useState<BalanceType[]>([]);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [selectedType, setSelectedType] = useState<BalanceType | null>(null);
  
  // Form fields
  const [beliefStatement, setBeliefStatement] = useState('');
  const [muscleTestResult, setMuscleTestResult] = useState<'strong' | 'weak' | 'neutral' | null>(null);
  const [stressBefore, setStressBefore] = useState<number>(5);
  const [stressAfter, setStressAfter] = useState<number>(5);
  const [outcomeNotes, setOutcomeNotes] = useState('');
  const [sessionStatus, setSessionStatus] = useState<'active' | 'completed' | 'follow_up_needed'>('completed');
  const [integrationStatus, setIntegrationStatus] = useState<'in_progress' | 'complete' | 'needs_follow_up'>('in_progress');
  
  // Validation errors
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    loadBalanceTypes();
  }, []);

  const loadBalanceTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('balance_types')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      setBalanceTypes(data || []);
    } catch (error) {
      console.error('Error loading balance types:', error);
      Alert.alert('Error', 'Failed to load balance types');
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!beliefStatement.trim()) {
      newErrors.beliefStatement = 'Belief statement is required';
    }
    
    if (!selectedType) {
      newErrors.balanceType = 'Please select a balance type';
    }
    
    if (muscleTestResult === null) {
      newErrors.muscleTestResult = 'Please select muscle test result';
    }
    
    if (stressBefore < 1 || stressBefore > 10) {
      newErrors.stressBefore = 'Stress level must be between 1-10';
    }
    
    if (stressAfter < 1 || stressAfter > 10) {
      newErrors.stressAfter = 'Stress level must be between 1-10';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    console.log('Attempting to create balance session...');
    
    try {
      // First check if user is authenticated
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('User auth error:', userError);
        Alert.alert('Authentication Error', `Please log in again: ${userError.message}`);
        return;
      }
      
      if (!user) {
        console.error('No authenticated user found');
        Alert.alert('Authentication Required', 'Please sign up or log in to create balance sessions.');
        return;
      }
      
      console.log('User authenticated:', user.email);
      
      // Check if balance types are loaded
      if (!selectedType) {
        Alert.alert('Form Error', 'Please select a balance type.');
        return;
      }
      
      const balanceData: BalanceInsert = {
        user_id: user.id,
        balance_type_id: selectedType.id,
        belief_statement: beliefStatement.trim(),
        muscle_test_result: muscleTestResult,
        stress_before: stressBefore,
        stress_after: stressAfter,
        outcome_notes: outcomeNotes.trim() || null,
        session_status: sessionStatus,
        integration_status: integrationStatus,
      };
      
      console.log('Inserting balance data:', balanceData);
      
      const { data, error } = await supabase
        .from('balances')
        .insert(balanceData)
        .select()
        .single();
      
      if (error) {
        console.error('Database insert error:', error);
        
        // Provide specific error messages based on error type
        if (error.code === '23505') {
          Alert.alert('Duplicate Error', 'This balance session already exists.');
        } else if (error.code === '23503') {
          Alert.alert('Reference Error', 'Invalid balance type selected. Please try again.');
        } else if (error.code === '42501') {
          Alert.alert('Permission Error', 'You do not have permission to create balance sessions. Please contact support.');
        } else {
          Alert.alert('Database Error', `Failed to save balance session: ${error.message}`);
        }
        return;
      }
      
      console.log('Balance created successfully:', data);
      Alert.alert(
        'Success!', 
        'Balance session recorded successfully!',
        [{ 
          text: 'OK', 
          onPress: () => {
            resetForm();
            // Optionally navigate to history or dashboard
          }
        }]
      );
      
    } catch (error) {
      console.error('Error creating balance:', error);
      Alert.alert('Error', `Failed to save balance session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setBeliefStatement('');
    setSelectedType(null);
    setMuscleTestResult(null);
    setStressBefore(5);
    setStressAfter(5);
    setOutcomeNotes('');
    setSessionStatus('completed');
    setIntegrationStatus('in_progress');
    setErrors({});
  };

  const getStressColor = (level: number) => {
    if (level <= 3) return '#10B981'; // Green
    if (level <= 6) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const getMuscleTestColor = (result: string) => {
    switch (result) {
      case 'strong': return '#10B981';
      case 'weak': return '#EF4444';
      case 'neutral': return '#6B7280';
      default: return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Balance</Text>
            <Text style={styles.subtitle}>Record a new balance session</Text>
          </View>

          <View style={styles.form}>
            {/* Belief Statement */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Belief Statement</Text>
              <TextInput
                style={[styles.textArea, errors.beliefStatement && styles.inputError]}
                placeholder="Enter the belief statement you're working with..."
                value={beliefStatement}
                onChangeText={(text) => {
                  setBeliefStatement(text);
                  if (errors.beliefStatement) setErrors({...errors, beliefStatement: ''});
                }}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              {errors.beliefStatement && (
                <View style={styles.errorContainer}>
                  <AlertCircle size={16} color="#EF4444" />
                  <Text style={styles.errorText}>{errors.beliefStatement}</Text>
                </View>
              )}
            </View>

            {/* Balance Type */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Balance Type</Text>
              <TouchableOpacity
                style={[styles.pickerButton, errors.balanceType && styles.inputError]}
                onPress={() => setShowTypePicker(!showTypePicker)}
              >
                <Text style={[styles.pickerText, !selectedType && styles.placeholderText]}>
                  {selectedType ? selectedType.name : 'Select balance type'}
                </Text>
                <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>
              {errors.balanceType && (
                <View style={styles.errorContainer}>
                  <AlertCircle size={16} color="#EF4444" />
                  <Text style={styles.errorText}>{errors.balanceType}</Text>
                </View>
              )}
              
              {showTypePicker && (
                <View style={styles.pickerDropdown}>
                  {balanceTypes.map((type) => (
                    <TouchableOpacity
                      key={type.id}
                      style={styles.pickerOption}
                      onPress={() => {
                        setSelectedType(type);
                        setShowTypePicker(false);
                        if (errors.balanceType) setErrors({...errors, balanceType: ''});
                      }}
                    >
                      <Text style={styles.pickerOptionText}>{type.name}</Text>
                      {selectedType?.id === type.id && (
                        <CheckCircle size={16} color="#3B82F6" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Muscle Test Result */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Muscle Test Result</Text>
              <View style={styles.muscleTestContainer}>
                {(['strong', 'weak', 'neutral'] as const).map((result) => (
                  <TouchableOpacity
                    key={result}
                    style={[
                      styles.muscleTestButton,
                      muscleTestResult === result && styles.muscleTestButtonActive,
                      errors.muscleTestResult && styles.inputError
                    ]}
                    onPress={() => {
                      setMuscleTestResult(result);
                      if (errors.muscleTestResult) setErrors({...errors, muscleTestResult: ''});
                    }}
                  >
                    <View style={[styles.muscleTestIcon, { backgroundColor: getMuscleTestColor(result) }]}>
                      {result === 'strong' && <TrendingUp size={16} color="white" />}
                      {result === 'weak' && <X size={16} color="white" />}
                      {result === 'neutral' && <Clock size={16} color="white" />}
                    </View>
                    <Text style={[
                      styles.muscleTestText,
                      muscleTestResult === result && styles.muscleTestTextActive
                    ]}>
                      {result.charAt(0).toUpperCase() + result.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.muscleTestResult && (
                <View style={styles.errorContainer}>
                  <AlertCircle size={16} color="#EF4444" />
                  <Text style={styles.errorText}>{errors.muscleTestResult}</Text>
                </View>
              )}
            </View>

            {/* Stress Levels */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Stress Levels</Text>
              
              <View style={styles.stressContainer}>
                <Text style={styles.stressLabel}>Before: {stressBefore}/10</Text>
                <View style={styles.sliderContainer}>
                  <TouchableOpacity
                    style={[styles.slider, { backgroundColor: getStressColor(stressBefore) }]}
                    onPress={() => setStressBefore(Math.max(1, stressBefore - 1))}
                  >
                    <Text style={styles.sliderText}>-</Text>
                  </TouchableOpacity>
                  <View style={styles.sliderTrack}>
                    <View 
                      style={[
                        styles.sliderFill, 
                        { 
                          width: `${(stressBefore / 10) * 100}%`,
                          backgroundColor: getStressColor(stressBefore)
                        }
                      ]} 
                    />
                  </View>
                  <TouchableOpacity
                    style={[styles.slider, { backgroundColor: getStressColor(stressBefore) }]}
                    onPress={() => setStressBefore(Math.min(10, stressBefore + 1))}
                  >
                    <Text style={styles.sliderText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.stressContainer}>
                <Text style={styles.stressLabel}>After: {stressAfter}/10</Text>
                <View style={styles.sliderContainer}>
                  <TouchableOpacity
                    style={[styles.slider, { backgroundColor: getStressColor(stressAfter) }]}
                    onPress={() => setStressAfter(Math.max(1, stressAfter - 1))}
                  >
                    <Text style={styles.sliderText}>-</Text>
                  </TouchableOpacity>
                  <View style={styles.sliderTrack}>
                    <View 
                      style={[
                        styles.sliderFill, 
                        { 
                          width: `${(stressAfter / 10) * 100}%`,
                          backgroundColor: getStressColor(stressAfter)
                        }
                      ]} 
                    />
                  </View>
                  <TouchableOpacity
                    style={[styles.slider, { backgroundColor: getStressColor(stressAfter) }]}
                    onPress={() => setStressAfter(Math.min(10, stressAfter + 1))}
                  >
                    <Text style={styles.sliderText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Session Status */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Session Status</Text>
              <View style={styles.statusContainer}>
                {(['active', 'completed', 'follow_up_needed'] as const).map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusButton,
                      sessionStatus === status && styles.statusButtonActive
                    ]}
                    onPress={() => setSessionStatus(status)}
                  >
                    <Text style={[
                      styles.statusText,
                      sessionStatus === status && styles.statusTextActive
                    ]}>
                      {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Integration Status */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Integration Status</Text>
              <View style={styles.statusContainer}>
                {(['in_progress', 'complete', 'needs_follow_up'] as const).map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusButton,
                      integrationStatus === status && styles.statusButtonActive
                    ]}
                    onPress={() => setIntegrationStatus(status)}
                  >
                    <Text style={[
                      styles.statusText,
                      integrationStatus === status && styles.statusTextActive
                    ]}>
                      {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Outcome Notes */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Outcome Notes (Optional)</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Record any observations, insights, or follow-up actions..."
                value={outcomeNotes}
                onChangeText={setOutcomeNotes}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Submit Button */}
            <View style={styles.submitContainer}>
              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <>
                    <Save size={20} color="white" />
                    <Text style={styles.submitButtonText}>Save Balance Session</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  form: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 100,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginLeft: 6,
  },
  pickerButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 16,
    color: '#1F2937',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  pickerDropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pickerOption: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  muscleTestContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  muscleTestButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  muscleTestButtonActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  muscleTestIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  muscleTestText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  muscleTestTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  stressContainer: {
    marginBottom: 16,
  },
  stressLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  slider: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  sliderTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    borderRadius: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  statusButtonActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  statusTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  submitContainer: {
    marginTop: 32,
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});