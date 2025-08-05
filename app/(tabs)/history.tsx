import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  X,
  ChevronDown
} from 'lucide-react-native';
import { Database } from '@/types/database';

type Balance = Database['public']['Tables']['balances']['Row'] & {
  balance_types: Database['public']['Tables']['balance_types']['Row'];
};

export default function HistoryScreen() {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [balanceTypes, setBalanceTypes] = useState<Database['public']['Tables']['balance_types']['Row'][]>([]);

  useEffect(() => {
    loadBalanceTypes();
    loadBalances();
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
    }
  };

  const loadBalances = async () => {
    try {
      setLoading(true);
      
      // First check if user is authenticated
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('User auth error:', userError);
        Alert.alert('Authentication Error', 'Please log in again to view your balance history.');
        return;
      }
      
      if (!user) {
        console.error('No authenticated user found');
        Alert.alert('Authentication Required', 'Please sign up or log in to view balance history.');
        return;
      }
      
      console.log('Loading balances for user:', user.email);
      
      const { data, error } = await supabase
        .from('balances')
        .select(`
          *,
          balance_types (*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error loading balances:', error);
        
        if (error.code === '42501') {
          Alert.alert('Permission Error', 'You do not have permission to view balance history. Please contact support.');
        } else {
          Alert.alert('Database Error', `Failed to load balance history: ${error.message}`);
        }
        return;
      }
      
      console.log('Loaded balances:', data?.length || 0);
      setBalances(data || []);
      
    } catch (error) {
      console.error('Error loading balances:', error);
      Alert.alert('Error', 'Failed to load balance history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBalances();
    setRefreshing(false);
  };

  const handleDeleteBalance = async (balanceId: string) => {
    Alert.alert(
      'Delete Balance',
      'Are you sure you want to delete this balance session? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Deleting balance:', balanceId);
              
              // First check if user is authenticated
              const { data: { user }, error: userError } = await supabase.auth.getUser();
              
              if (userError) {
                console.error('User auth error:', userError);
                Alert.alert('Authentication Error', 'Please log in again to delete balance sessions.');
                return;
              }
              
              if (!user) {
                console.error('No authenticated user found');
                Alert.alert('Authentication Required', 'Please sign up or log in to delete balance sessions.');
                return;
              }
              
              const { error } = await supabase
                .from('balances')
                .delete()
                .eq('id', balanceId);
              
              if (error) {
                console.error('Delete error:', error);
                
                if (error.code === '42501') {
                  Alert.alert('Permission Error', 'You do not have permission to delete this balance session.');
                } else if (error.code === '23503') {
                  Alert.alert('Reference Error', 'Cannot delete this balance session due to database constraints.');
                } else {
                  Alert.alert('Database Error', `Failed to delete balance session: ${error.message}`);
                }
                return;
              }
              
              console.log('Balance deleted successfully');
              Alert.alert('Success', 'Balance session deleted successfully');
              loadBalances(); // Reload the list
              
            } catch (error) {
              console.error('Error deleting balance:', error);
              Alert.alert('Error', 'Failed to delete balance session. Please try again.');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'active': return '#3B82F6';
      case 'follow_up_needed': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getMuscleTestColor = (result: string) => {
    switch (result) {
      case 'strong': return '#10B981';
      case 'weak': return '#EF4444';
      case 'neutral': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStressColor = (level: number) => {
    if (level <= 3) return '#10B981';
    if (level <= 6) return '#F59E0B';
    return '#EF4444';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredBalances = balances.filter(balance => {
    const matchesSearch = balance.belief_statement.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         balance.outcome_notes?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || balance.session_status === selectedStatus;
    const matchesType = selectedType === 'all' || balance.balance_types?.id.toString() === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const renderBalanceCard = (balance: Balance) => (
    <View key={balance.id} style={styles.balanceCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitle}>
          <Text style={styles.beliefText} numberOfLines={2}>
            {balance.belief_statement}
          </Text>
          <View style={styles.balanceType}>
            <Text style={styles.typeText}>{balance.balance_types?.name}</Text>
          </View>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Eye size={16} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Edit size={16} color="#10B981" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDeleteBalance(balance.id)}
          >
            <Trash2 size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Muscle Test</Text>
            <View style={[styles.metricValue, { backgroundColor: getMuscleTestColor(balance.muscle_test_result || '') }]}>
              <Text style={styles.metricText}>
                {balance.muscle_test_result?.charAt(0).toUpperCase() + balance.muscle_test_result?.slice(1) || 'N/A'}
              </Text>
            </View>
          </View>
          
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Stress Before</Text>
            <View style={[styles.stressIndicator, { backgroundColor: getStressColor(balance.stress_before || 0) }]}>
              <Text style={styles.stressText}>{balance.stress_before || 'N/A'}</Text>
            </View>
          </View>
          
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Stress After</Text>
            <View style={[styles.stressIndicator, { backgroundColor: getStressColor(balance.stress_after || 0) }]}>
              <Text style={styles.stressText}>{balance.stress_after || 'N/A'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(balance.session_status) }]}>
            <Text style={styles.statusText}>
              {balance.session_status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Text>
          </View>
          
          <View style={[styles.integrationBadge, { backgroundColor: getStatusColor(balance.integration_status) }]}>
            <Text style={styles.integrationText}>
              {balance.integration_status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Text>
          </View>
        </View>

        {balance.outcome_notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText} numberOfLines={3}>
              {balance.outcome_notes}
            </Text>
          </View>
        )}

        <View style={styles.cardFooter}>
          <View style={styles.dateContainer}>
            <Calendar size={14} color="#6B7280" />
            <Text style={styles.dateText}>{formatDate(balance.created_at)}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading balance history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Balance History</Text>
        <Text style={styles.subtitle}>Review your past sessions</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInput}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchTextInput}
            placeholder="Search belief statements or notes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Status:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[styles.filterChip, selectedStatus === 'all' && styles.filterChipActive]}
                onPress={() => setSelectedStatus('all')}
              >
                <Text style={[styles.filterChipText, selectedStatus === 'all' && styles.filterChipTextActive]}>
                  All
                </Text>
              </TouchableOpacity>
              {(['active', 'completed', 'follow_up_needed'] as const).map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[styles.filterChip, selectedStatus === status && styles.filterChipActive]}
                  onPress={() => setSelectedStatus(status)}
                >
                  <Text style={[styles.filterChipText, selectedStatus === status && styles.filterChipTextActive]}>
                    {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Type:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[styles.filterChip, selectedType === 'all' && styles.filterChipActive]}
                onPress={() => setSelectedType('all')}
              >
                <Text style={[styles.filterChipText, selectedType === 'all' && styles.filterChipTextActive]}>
                  All
                </Text>
              </TouchableOpacity>
              {balanceTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[styles.filterChip, selectedType === type.id.toString() && styles.filterChipActive]}
                  onPress={() => setSelectedType(type.id.toString())}
                >
                  <Text style={[styles.filterChipText, selectedType === type.id.toString() && styles.filterChipTextActive]}>
                    {type.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredBalances.length} balance session{filteredBalances.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* Balance List */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredBalances.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Clock size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No balance sessions found</Text>
            <Text style={styles.emptyText}>
              {searchQuery || selectedStatus !== 'all' || selectedType !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first balance session to get started'
              }
            </Text>
          </View>
        ) : (
          <View style={styles.balanceList}>
            {filteredBalances.map(renderBalanceCard)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchTextInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 12,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterRow: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  resultsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    color: '#6B7280',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  balanceList: {
    gap: 16,
    paddingBottom: 24,
  },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardTitle: {
    flex: 1,
    marginRight: 12,
  },
  beliefText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 22,
    marginBottom: 8,
  },
  balanceType: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3B82F6',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    gap: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  metricValue: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  metricText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  stressIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  integrationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  integrationText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  notesContainer: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
  },
});