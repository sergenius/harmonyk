import { supabase } from './supabase';
import { Database } from '@/types/database';

type BalanceType = Database['public']['Tables']['balance_types']['Row'];
type Balance = Database['public']['Tables']['balances']['Row'];
type BalanceInsert = Database['public']['Tables']['balances']['Insert'];
type BalanceUpdate = Database['public']['Tables']['balances']['Update'];

// Balance Types
export const getBalanceTypes = async (): Promise<BalanceType[]> => {
  const { data, error } = await supabase
    .from('balance_types')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return data || [];
};

// Balances
export const createBalance = async (balance: BalanceInsert): Promise<Balance> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('balances')
    .insert({
      ...balance,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getBalances = async (limit?: number): Promise<Balance[]> => {
  let query = supabase
    .from('balances')
    .select(`
      *,
      balance_types (
        id,
        name,
        description
      )
    `)
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getBalance = async (id: string): Promise<Balance | null> => {
  const { data, error } = await supabase
    .from('balances')
    .select(`
      *,
      balance_types (
        id,
        name,
        description
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return data;
};

export const updateBalance = async (id: string, updates: BalanceUpdate): Promise<Balance> => {
  const { data, error } = await supabase
    .from('balances')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteBalance = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('balances')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Dashboard Stats
export const getDashboardStats = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Get total balances count
  const { count: totalBalances } = await supabase
    .from('balances')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  // Get completed balances count
  const { count: completedBalances } = await supabase
    .from('balances')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('session_status', 'completed');

  // Get recent balances (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const { count: recentBalances } = await supabase
    .from('balances')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', sevenDaysAgo.toISOString());

  // Get average stress reduction
  const { data: stressData } = await supabase
    .from('balances')
    .select('stress_before, stress_after')
    .eq('user_id', user.id)
    .not('stress_before', 'is', null)
    .not('stress_after', 'is', null);

  let avgStressReduction = 0;
  if (stressData && stressData.length > 0) {
    const totalReduction = stressData.reduce((sum, balance) => {
      return sum + (balance.stress_before! - balance.stress_after!);
    }, 0);
    avgStressReduction = totalReduction / stressData.length;
  }

  return {
    totalBalances: totalBalances || 0,
    completedBalances: completedBalances || 0,
    recentBalances: recentBalances || 0,
    avgStressReduction: Math.round(avgStressReduction * 10) / 10,
  };
};