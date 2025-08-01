export interface Database {
  public: {
    Tables: {
      balance_types: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      balances: {
        Row: {
          id: string;
          user_id: string;
          balance_type_id: number | null;
          belief_statement: string;
          muscle_test_result: 'strong' | 'weak' | 'neutral' | null;
          stress_before: number | null;
          stress_after: number | null;
          outcome_notes: string | null;
          session_status: 'active' | 'completed' | 'follow_up_needed';
          integration_status: 'in_progress' | 'complete' | 'needs_follow_up';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          balance_type_id?: number | null;
          belief_statement: string;
          muscle_test_result?: 'strong' | 'weak' | 'neutral' | null;
          stress_before?: number | null;
          stress_after?: number | null;
          outcome_notes?: string | null;
          session_status?: 'active' | 'completed' | 'follow_up_needed';
          integration_status?: 'in_progress' | 'complete' | 'needs_follow_up';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          balance_type_id?: number | null;
          belief_statement?: string;
          muscle_test_result?: 'strong' | 'weak' | 'neutral' | null;
          stress_before?: number | null;
          stress_after?: number | null;
          outcome_notes?: string | null;
          session_status?: 'active' | 'completed' | 'follow_up_needed';
          integration_status?: 'in_progress' | 'complete' | 'needs_follow_up';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}