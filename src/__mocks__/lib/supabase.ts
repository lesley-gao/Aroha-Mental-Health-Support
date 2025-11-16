/**
 * Jest mock for Supabase client used in tests.
 * This prevents evaluation of Vite's import.meta.env at test time and provides
 * a minimal, deterministic supabase surface for unit tests.
 */
export const supabase: null = null;

export const isSupabaseConfigured = (): boolean => false;

// Minimal DB types used by the app; keep shape compatible with imports
export interface PHQ9RecordDB {
  id?: string;
  user_id?: string;
  answers: number[];
  total: number;
  severity: string;
  created_at: string;
  synced_at?: string;
}

export interface UserPreferencesDB {
  id?: string;
  user_id?: string;
  language: string;
  cloud_sync_enabled: boolean;
  updated_at: string;
}

// Provide a lightweight mock for auth.getUser used in some helpers when needed.
export const mockAuth = {
  getUser: async () => ({ data: { user: null } }),
};

export default {
  supabase,
  isSupabaseConfigured,
  mockAuth,
};
