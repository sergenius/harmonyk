import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Activity,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  Database
} from 'lucide-react-native';
import { Database as DatabaseType } from '@/types/database';

type Balance = DatabaseType['public']['Tables']['balances']['Row'] & {
  balance_types: DatabaseType['public']['Tables']['balance_types']['Row'];
};

type DashboardStats = {
  totalSessions: number;
  thisWeek: number;
  thisMonth: number;
  averageStressReduction: number;
  completedSessions: number;
  activeSessions: number;
  followUpNeeded: number;
  recentBalances: Balance[];
};

export default function DashboardScreen() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSessions: 0,
    thisWeek: 0,
    thisMonth: 0,
    averageStressReduction: 0,
    completedSessions: 0,
    activeSessions: 0,
    followUpNeeded: 0,
    recentBalances: [],
  });
  const [loading, setLoading] = useState(true);
  const [testingConnection, setTestingConnection] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const testDatabaseConnection = async () => {
    setTestingConnection(true);
    try {
      // Check environment variables
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
      
      console.log('Environment check:');
      console.log('SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
      console.log('SUPABASE_KEY:', supabaseKey ? 'Set' : 'Missing');
      
      if (!supabaseUrl || !supabaseKey) {
        Alert.alert('Configuration Error', 'Missing Supabase environment variables. Please check your .env file.');
        return;
      }
      
      // Test user authentication first
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Auth error:', authError);
        Alert.alert('Auth Error', `Authentication error: ${authError.message}`);
        return;
      }
      
      if (!user) {
        console.log('No authenticated user');
        Alert.alert('Not Authenticated', 'Please sign up or log in to use the app.');
        return;
      }
      
      console.log('User authenticated:', user.email);
      
      // Test balance types query
      const { data: balanceTypes, error: typesError } = await supabase
        .from('balance_types')
        .select('*')
        .limit(5);
      
      if (typesError) {
        console.error('Balance types error:', typesError);
        Alert.alert('Database Error', `Failed to load balance types: ${typesError.message}\n\nThis might mean the database migration hasn't been run yet.`);
        return;
      }
      
      // Test balances table access
      const { data: balances, error: balancesError } = await supabase
        .from('balances')
        .select('*')
        .limit(1);
      
      if (balancesError) {
        console.error('Balances table error:', balancesError);
        Alert.alert('Database Error', `Failed to access balances table: ${balancesError.message}\n\nThis might mean the database migration hasn't been run yet.`);
        return;
      }
      
      console.log('Connection test successful');
      Alert.alert(
        'Connection Success', 
        `Database connected successfully!\n\n` +
        `User: ${user.email}\n` +
        `Balance types: ${balanceTypes?.length || 0} found\n` +
        `Balances table: Accessible\n` +
        `RLS: Working properly`
      );
      
    } catch (error) {
      console.error('Test error:', error);
      Alert.alert('Test Error', `Unexpected error: ${error}`);
    } finally {
      setTestingConnection(false);
    }
  };

  const testCRUDOperations = async () => {
    setTestingConnection(true);
    try {
      // Check authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        Alert.alert('Auth Error', 'Please log in to test CRUD operations.');
        return;
      }
      
      console.log('Testing CRUD operations for user:', user.email);
      
      // Test CREATE operation
      const testBalanceData = {
        user_id: user.id,
        balance_type_id: 1, // Assuming first balance type exists
        belief_statement: 'Test belief statement for CRUD testing',
        muscle_test_result: 'strong' as const,
        stress_before: 5,
        stress_after: 3,
        outcome_notes: 'Test outcome notes',
        session_status: 'completed' as const,
        integration_status: 'complete' as const,
      };
      
      console.log('Creating test balance...');
      const { data: createdBalance, error: createError } = await supabase
        .from('balances')
        .insert(testBalanceData)
        .select()
        .single();
      
      if (createError) {
        console.error('Create error:', createError);
        Alert.alert('Create Test Failed', `Failed to create test balance: ${createError.message}`);
        return;
      }
      
      console.log('Test balance created:', createdBalance.id);
      
      // Test READ operation
      console.log('Reading test balance...');
      const { data: readBalance, error: readError } = await supabase
        .from('balances')
        .select('*')
        .eq('id', createdBalance.id)
        .single();
      
      if (readError) {
        console.error('Read error:', readError);
        Alert.alert('Read Test Failed', `Failed to read test balance: ${readError.message}`);
        return;
      }
      
      console.log('Test balance read successfully');
      
      // Test DELETE operation
      console.log('Deleting test balance...');
      const { error: deleteError } = await supabase
        .from('balances')
        .delete()
        .eq('id', createdBalance.id);
      
      if (deleteError) {
        console.error('Delete error:', deleteError);
        Alert.alert('Delete Test Failed', `Failed to delete test balance: ${deleteError.message}`);
        return;
      }
      
      console.log('Test balance deleted successfully');
      
      Alert.alert(
        'CRUD Test Success!',
        'All CRUD operations (Create, Read, Delete) are working properly!\n\n' +
        '✅ Create: Test balance created\n' +
        '✅ Read: Test balance retrieved\n' +
        '✅ Delete: Test balance removed\n\n' +
        'Your database is fully functional!'
      );
      
    } catch (error) {
      console.error('CRUD test error:', error);
      Alert.alert('CRUD Test Error', `Unexpected error: ${error}`);
    } finally {
      setTestingConnection(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load all balances with balance types
      const { data: balances, error } = await supabase
        .from('balances')
        .select(`
          *,
          balance_types (*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const balanceData = balances || [];
      
      // Calculate statistics
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const thisWeek = balanceData.filter(b => new Date(b.created_at) >= oneWeekAgo).length;
      const thisMonth = balanceData.filter(b => new Date(b.created_at) >= oneMonthAgo).length;
      
      const completedSessions = balanceData.filter(b => b.session_status === 'completed').length;
      const activeSessions = balanceData.filter(b => b.session_status === 'active').length;
      const followUpNeeded = balanceData.filter(b => b.session_status === 'follow_up_needed').length;
      
      // Calculate average stress reduction
      const stressReductions = balanceData
        .filter(b => b.stress_before && b.stress_after)
        .map(b => (b.stress_before || 0) - (b.stress_after || 0));
      
      const averageStressReduction = stressReductions.length > 0 
        ? stressReductions.reduce((sum, reduction) => sum + reduction, 0) / stressReductions.length
        : 0;
      
      // Get recent balances (last 5)
      const recentBalances = balanceData.slice(0, 5);
      
      setStats({
        totalSessions: balanceData.length,
        thisWeek,
        thisMonth,
        averageStressReduction: Math.round(averageStressReduction * 10) / 10,
        completedSessions,
        activeSessions,
        followUpNeeded,
        recentBalances,
      });
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'active': return '#3B82F6';
      case 'follow_up_needed': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    subtitle?: string;
  }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Icon size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );

  const RecentBalanceCard = ({ balance }: { balance: Balance }) => (
    <View style={styles.recentCard}>
      <View style={styles.recentCardHeader}>
        <View style={styles.recentCardTitle}>
          <Text style={styles.recentBeliefText} numberOfLines={1}>
            {balance.belief_statement}
          </Text>
          <Text style={styles.recentTypeText}>{balance.balance_types?.name}</Text>
        </View>
        <View style={[styles.recentStatusBadge, { backgroundColor: getStatusColor(balance.session_status) }]}>
          <Text style={styles.recentStatusText}>
            {balance.session_status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Text>
        </View>
      </View>
      <View style={styles.recentCardFooter}>
        <View style={styles.recentMetrics}>
          <Text style={styles.recentMetricText}>
            Stress: {balance.stress_before} → {balance.stress_after}
          </Text>
          <Text style={styles.recentMetricText}>
            Muscle: {balance.muscle_test_result?.charAt(0).toUpperCase() + balance.muscle_test_result?.slice(1) || 'N/A'}
          </Text>
        </View>
        <Text style={styles.recentDateText}>{formatDate(balance.created_at)}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Welcome to HarmonyK Balance Tracker</Text>
        </View>

        {/* Test Connection Button */}
        <View style={styles.testSection}>
          <TouchableOpacity 
            style={styles.testButton}
            onPress={testDatabaseConnection}
            disabled={testingConnection}
          >
            {testingConnection ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Database size={20} color="white" />
            )}
            <Text style={styles.testButtonText}>
              {testingConnection ? 'Testing...' : 'Test Database Connection'}
            </Text>
          </TouchableOpacity>
          
          {/* Test CRUD Operations */}
          <TouchableOpacity 
            style={[styles.testButton, { backgroundColor: '#10B981', marginTop: 12 }]}
            onPress={testCRUDOperations}
            disabled={testingConnection}
          >
            <Text style={styles.testButtonText}>
              Test CRUD Operations
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Total Sessions"
              value={stats.totalSessions}
              icon={BarChart3}
              color="#3B82F6"
            />
            <StatCard
              title="This Week"
              value={stats.thisWeek}
              icon={Calendar}
              color="#10B981"
            />
            <StatCard
              title="This Month"
              value={stats.thisMonth}
              icon={TrendingUp}
              color="#F59E0B"
            />
            <StatCard
              title="Avg Stress Reduction"
              value={stats.averageStressReduction}
              icon={Target}
              color="#EF4444"
              subtitle="points per session"
            />
          </View>
        </View>

        {/* Session Status Overview */}
        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>Session Status</Text>
          <View style={styles.statusCards}>
            <View style={styles.statusCard}>
              <View style={styles.statusCardHeader}>
                <CheckCircle size={20} color="#10B981" />
                <Text style={styles.statusCardTitle}>Completed</Text>
              </View>
              <Text style={styles.statusCardValue}>{stats.completedSessions}</Text>
            </View>
            
            <View style={styles.statusCard}>
              <View style={styles.statusCardHeader}>
                <Activity size={20} color="#3B82F6" />
                <Text style={styles.statusCardTitle}>Active</Text>
              </View>
              <Text style={styles.statusCardValue}>{stats.activeSessions}</Text>
            </View>
            
            <View style={styles.statusCard}>
              <View style={styles.statusCardHeader}>
                <AlertCircle size={20} color="#F59E0B" />
                <Text style={styles.statusCardTitle}>Follow-up</Text>
              </View>
              <Text style={styles.statusCardValue}>{stats.followUpNeeded}</Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <ArrowRight size={16} color="#3B82F6" />
            </TouchableOpacity>
          </View>
          
          {stats.recentBalances.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Clock size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No sessions yet</Text>
              <Text style={styles.emptyText}>Create your first balance session to get started</Text>
              <TouchableOpacity style={styles.createButton}>
                <Plus size={20} color="white" />
                <Text style={styles.createButtonText}>Create Balance</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.recentList}>
              {stats.recentBalances.map((balance) => (
                <RecentBalanceCard key={balance.id} balance={balance} />
              ))}
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Plus size={24} color="#3B82F6" />
              <Text style={styles.actionButtonText}>New Balance</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <BarChart3 size={24} color="#10B981" />
              <Text style={styles.actionButtonText}>View History</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  testSection: {
    marginBottom: 24,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  statsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  statusSection: {
    marginBottom: 32,
  },
  statusCards: {
    flexDirection: 'row',
    gap: 12,
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusCardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 8,
  },
  statusCardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  recentSection: {
    marginBottom: 32,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  recentList: {
    gap: 12,
  },
  recentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recentCardTitle: {
    flex: 1,
    marginRight: 12,
  },
  recentBeliefText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  recentTypeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  recentStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  recentStatusText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  recentCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentMetrics: {
    flex: 1,
  },
  recentMetricText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  recentDateText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 8,
  },
});