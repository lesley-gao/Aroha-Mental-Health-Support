import { createClient } from '@supabase/supabase-js';

// These will be set via environment variables
// For development, you can create a .env.local file with:
// VITE_SUPABASE_URL=your-project-url
// VITE_SUPABASE_ANON_KEY=your-anon-key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client (will be null if env vars not set)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return supabase !== null;
};

// Database types
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
