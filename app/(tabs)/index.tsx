import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  Animated,
  RefreshControl,
  Dimensions,
  Vibration
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
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
  Sparkles,
  Zap,
  Heart
} from 'lucide-react-native';
import { t } from '@/lib/i18n';

const { width } = Dimensions.get('window');
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
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const navigateToCreate = () => {
    // Add haptic feedback
    Vibration.vibrate(50);
    router.push('/(tabs)/create');
  };

  const navigateToHistory = () => {
    // Add haptic feedback
    Vibration.vibrate(50);
    router.push('/(tabs)/history');
  };

  useEffect(() => {
    loadDashboardData();
    // Animate dashboard load
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);



  const loadDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
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
      if (!isRefresh) {
        Alert.alert(
          'Unable to Load Data 😟',
          'We\'re having trouble loading your dashboard. Please check your internet connection and try again.',
          [
            { text: 'Retry', onPress: () => loadDashboardData() },
            { text: 'OK', style: 'cancel' }
          ]
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    loadDashboardData(true);
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
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.loadingGradient}
        >
          <View style={styles.loadingContainer}>
            <Animated.View 
              style={{
                transform: [{ rotate: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg']
                })}]
              }}
            >
              <Sparkles size={48} color="#FFFFFF" />
            </Animated.View>
            <Text style={styles.loadingText}>Loading your dashboard...</Text>
            <Text style={styles.loadingSubtext}>Preparing your balance insights</Text>
          </View>
        </LinearGradient>
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
            <TouchableOpacity style={styles.viewAllButton} onPress={navigateToHistory}>
              <Text style={styles.viewAllText}>View All</Text>
              <ArrowRight size={16} color="#3B82F6" />
            </TouchableOpacity>
          </View>
          
          {stats.recentBalances.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Clock size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No sessions yet</Text>
              <Text style={styles.emptyText}>Create your first balance session to get started</Text>
              <TouchableOpacity style={styles.createButton} onPress={navigateToCreate}>
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
            <TouchableOpacity style={styles.actionButton} onPress={navigateToCreate}>
              <Plus size={24} color="#3B82F6" />
              <Text style={styles.actionButtonText}>New Balance</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={navigateToHistory}>
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
  loadingGradient: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 40,
    marginBottom: -20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  headerIcon: {
    opacity: 0.8,
  },
  statsSection: {
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
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
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  statCardGradient: {
    padding: 16,
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
    paddingHorizontal: 24,
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
    paddingHorizontal: 24,
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
    paddingHorizontal: 24,
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
  primaryAction: {
    borderWidth: 0,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  primaryActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 8,
  },
  bottomPadding: {
    height: 40,
  },
});