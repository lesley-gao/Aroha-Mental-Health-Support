/**
 * Storage utilities for Aroha MVP
 * Handles localStorage operations for PHQ-9 records, user preferences, and consent
 * Also supports Supabase cloud sync when enabled
 */

import { supabase, isSupabaseConfigured, type PHQ9RecordDB } from '@/lib/supabase';
import type { Locale } from '@/i18n/messages';

// Storage keys
const STORAGE_KEYS = {
  RECORDS: 'phq9_records',
  LANGUAGE: 'phq9_lang',
  CONSENT: 'phq9_consent',
  CONSENT_FLAG: 'phq9_consented',
  CLOUD_SYNC: 'phq9_cloud_sync_enabled',
  USER_ID: 'phq9_user_id', // Anonymous user ID for Supabase
  MIGRATION_PROMPT_PREFIX: 'phq9_migration_prompted_',
} as const;

// Type definitions
export interface PHQ9Record {
  id: string;
  answers: number[]; // Array of 9 answers (0-3)
  total: number;
  severity: string;
  locale: Locale | string; // 'en' | 'mi' | 'zh' (string for backward compatibility)
  createdAt: string; // ISO 8601 date string
  origin?: 'local' | 'cloud';
}

export interface ConsentData {
  hasConsented: boolean;
  consentDate: string; // ISO 8601 date string
}

/**
 * Get all PHQ-9 records from localStorage
 * @returns Promise resolving to array of PHQ9Record
 */
export async function getRecords(): Promise<PHQ9Record[]> {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (!data) return [];
    return JSON.parse(data) as PHQ9Record[];
  } catch (error) {
    console.error('Error reading records from localStorage:', error);
    return [];
  }
}

/**
 * Migration prompt helpers
 * We store a simple per-user flag so we don't repeatedly prompt authenticated users
 */
export function hasSeenMigrationPrompt(userId: string): boolean {
  try {
    const key = `${STORAGE_KEYS.MIGRATION_PROMPT_PREFIX}${userId}`;
    return localStorage.getItem(key) === 'true';
  } catch (err) {
    console.error('Error checking migration prompt flag:', err);
    return false;
  }
}

export function setSeenMigrationPrompt(userId: string): void {
  try {
    const key = `${STORAGE_KEYS.MIGRATION_PROMPT_PREFIX}${userId}`;
    localStorage.setItem(key, 'true');
  } catch (err) {
    console.error('Error setting migration prompt flag:', err);
  }
}

/**
 * Save a new PHQ-9 record to localStorage
 * Also syncs to Supabase if cloud sync is enabled
 * @param record - The PHQ9Record to save
 * @returns Promise resolving when save is complete
 */
export async function saveRecord(record: PHQ9Record): Promise<void> {
  try {
    const records = await getRecords();
    // Mark as local origin if not provided
    if (!record.origin) record.origin = 'local';
    records.push(record);
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    
    // Sync to Supabase if enabled
    if (isCloudSyncEnabled()) {
      await syncRecordToSupabase(record);
    }
  } catch (error) {
    console.error('Error saving record to localStorage:', error);
    throw error;
  }
}

/**
 * Clear all PHQ-9 records from localStorage
 * @returns Promise resolving when clear is complete
 */
export async function clearRecords(): Promise<void> {
  try {
    localStorage.removeItem(STORAGE_KEYS.RECORDS);
  } catch (error) {
    console.error('Error clearing records from localStorage:', error);
    throw error;
  }
}

/**
 * Get the current language preference
 * @returns The language code ('en' or 'mi'), defaults to 'en'
 */
export function getLanguage(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';
  } catch (error) {
    console.error('Error reading language from localStorage:', error);
    return 'en';
  }
}

/**
 * Set the language preference
 * @param lang - The language code to set ('en' or 'mi')
 */
export function setLanguage(lang: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  } catch (error) {
    console.error('Error saving language to localStorage:', error);
    throw error;
  }
}

/**
 * Get the user's consent status
 * @returns The consent data, or null if not set
 */
export function getConsent(): ConsentData | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CONSENT);
    // Try parsing the structured consent object first
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed && typeof parsed === 'object' && 'hasConsented' in parsed) {
          return parsed as ConsentData;
        }
      } catch {
        // Not JSON — fall through to check simple formats
      }

      // Accept legacy string 'true' or 'false'
      if (data === 'true') {
        return { hasConsented: true, consentDate: new Date().toISOString() };
      }
    }

    // Fallback: check a simple consent flag (robustness for older storage formats)
    const flag = localStorage.getItem(STORAGE_KEYS.CONSENT_FLAG);
    if (flag === 'true') {
      return { hasConsented: true, consentDate: new Date().toISOString() };
    }

    return null;
    } catch (error) {
    console.error('Error reading consent from localStorage:', error);
    return null;
  }
}

/**
 * Set the user's consent status
 * @param consentData - The consent data to save
 */
export function setConsent(consentData: ConsentData): void {
  try {
    // Persist both a structured object and a simple flag for robustness
    localStorage.setItem(STORAGE_KEYS.CONSENT, JSON.stringify(consentData));
    try {
      localStorage.setItem(STORAGE_KEYS.CONSENT_FLAG, consentData.hasConsented ? 'true' : 'false');
    } catch (e) {
      // Non-fatal: if flag can't be set, structured object is still the source of truth
      console.warn('Could not set simple consent flag:', e);
    }
  } catch (error) {
    console.error('Error saving consent to localStorage:', error);
    throw error;
  }
}

/**
 * Clear all data from localStorage (records, language, consent)
 * @returns Promise resolving when all data is cleared
 */
export async function clearAllData(): Promise<void> {
  try {
    localStorage.removeItem(STORAGE_KEYS.RECORDS);
    localStorage.removeItem(STORAGE_KEYS.LANGUAGE);
    localStorage.removeItem(STORAGE_KEYS.CONSENT);
    // Also remove the simple consent flag to fully clear consent state
    localStorage.removeItem(STORAGE_KEYS.CONSENT_FLAG);
  } catch (error) {
    console.error('Error clearing all data from localStorage:', error);
    throw error;
  }
}

/**
 * Export all data as JSON string (for user download)
 * @returns Promise resolving to JSON string of all user data
 */
export async function exportAllData(): Promise<string> {
  try {
    const records = await getRecords();
    const language = getLanguage();
    const consent = getConsent();
    
    const exportData = {
      records,
      language,
      consent,
      exportDate: new Date().toISOString(),
    };
    
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
}

/**
 * Cloud Sync Functions (Supabase)
 */

/**
 * Check if cloud sync is enabled
 * @returns boolean indicating if cloud sync is enabled
 */
export function isCloudSyncEnabled(): boolean {
  try {
    const enabled = localStorage.getItem(STORAGE_KEYS.CLOUD_SYNC);
    return enabled === 'true' && isSupabaseConfigured();
  } catch (error) {
    console.error('Error checking cloud sync status:', error);
    return false;
  }
}

/**
 * Enable or disable cloud sync
 * @param enabled - Whether to enable cloud sync
 */
export function setCloudSyncEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CLOUD_SYNC, enabled.toString());
  } catch (error) {
    console.error('Error setting cloud sync status:', error);
    throw error;
  }
}

/**
 * Get authenticated user ID from Supabase
 * @returns The user ID or null if not authenticated
 */
async function getUserId(): Promise<string | null> {
  try {
    if (!supabase) {
      console.warn('⚠️ Supabase client not initialized');
      return null;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    console.log('👤 Current user:', user?.id, user?.email);
    return user?.id || null;
  } catch (error) {
    console.error('❌ Error getting user ID:', error);
    return null;
  }
}

/**
 * Sync a record to Supabase
 * @param record - The PHQ9Record to sync
 */
async function syncRecordToSupabase(record: PHQ9Record): Promise<void> {
  if (!isCloudSyncEnabled() || !supabase) {
    return;
  }

  try {
    const userId = await getUserId();
    if (!userId) {
      console.error('No authenticated user, skipping sync');
      return;
    }

    const dbRecord: PHQ9RecordDB = {
      user_id: userId,
      answers: record.answers,
      total: record.total,
      severity: record.severity,
      created_at: record.createdAt,
      synced_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('phq9_records')
      .insert(dbRecord);

    if (error) {
      console.error('Error syncing record to Supabase:', error);
    }
  } catch (error) {
    console.error('Error syncing record to Supabase:', error);
  }
}

/**
 * Fetch all records from Supabase
 * @returns Promise resolving to array of PHQ9Record
 */
export async function fetchRecordsFromSupabase(): Promise<PHQ9Record[]> {
  if (!isCloudSyncEnabled() || !supabase) {
    return [];
  }

  try {
    const userId = await getUserId();
    console.log('🔍 Fetching PHQ-9 records for user:', userId);
    if (!userId) {
      console.warn('⚠️ No userId found, cannot fetch PHQ-9 records');
      return [];
    }

    const { data, error } = await supabase
      .from('phq9_records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching records from Supabase:', error);
      return [];
    }

    console.log('✅ PHQ-9 records fetched:', data?.length || 0, 'records');
    console.log('📊 First record:', data?.[0]);
    if (data?.[0]) {
      console.log('📅 First record created_at:', data[0].created_at, 'type:', typeof data[0].created_at);
    }

    // Convert DB records to PHQ9Record format
    return (data || []).map((dbRecord: PHQ9RecordDB) => {
  const dbLocale = (dbRecord as unknown as { locale?: string }).locale as Locale | undefined;
      return {
        id: dbRecord.id || '',
        answers: dbRecord.answers,
        total: dbRecord.total,
        severity: dbRecord.severity,
        locale: dbLocale || 'en', // Default to 'en' if not set
        createdAt: dbRecord.created_at,
      } as PHQ9Record;
    });
  } catch (error) {
    console.error('Error fetching records from Supabase:', error);
    return [];
  }
}

/**
 * Sync all local records to Supabase
 * @returns Promise resolving when sync is complete
 */
export async function syncAllRecordsToSupabase(): Promise<void> {
  if (!isCloudSyncEnabled() || !supabase) {
    return;
  }

  try {
    const localRecords = await getRecords();
    const userId = await getUserId();
    if (!userId) {
      console.error('No authenticated user, skipping sync');
      return;
    }

    // Get existing records from Supabase
    const { data: existingRecords } = await supabase
      .from('phq9_records')
      .select('created_at')
      .eq('user_id', userId);

    const existingDates = new Set(
      (existingRecords || []).map((r: { created_at: string }) => r.created_at)
    );

    // Sync only new records
    for (const record of localRecords) {
      if (!existingDates.has(record.createdAt)) {
        await syncRecordToSupabase(record);
      }
    }
  } catch (error) {
    console.error('Error syncing all records to Supabase:', error);
  }
}

/**
 * Migrate given local records (or all local records if omitted) to Supabase for the current user.
 * This is an opt-in flow that should be triggered after a user authenticates and explicitly consents.
 * It will deduplicate by createdAt and mark migrated local records with origin='cloud'.
 */
export async function migrateLocalRecordsToCloud(records?: PHQ9Record[]): Promise<{migrated: number; skipped: number; errors: number}> {
  const result = { migrated: 0, skipped: 0, errors: 0 };

  if (!isCloudSyncEnabled() || !supabase) {
    // If cloud sync is disabled, still allow migration but warn that cloud sync flag may be off.
  }

  try {
    const localRecords = records ?? (await getRecords());
    if (localRecords.length === 0) return result;

    const userId = await getUserId();
    if (!userId) {
      console.error('No authenticated user; cannot migrate records');
      return result;
    }

    if (!supabase) {
      console.error('Supabase client not initialized; cannot migrate records');
      return result;
    }

    // Fetch existing created_at values for this user to avoid duplicates
    const fetchResp = await supabase
      .from('phq9_records')
      .select('created_at')
      .eq('user_id', userId);

  // ts-jest and SDK types are sometimes loose here; coerce carefully
  const fetchRespAny = fetchResp as unknown as { data?: Array<{ created_at: string }>; error?: unknown } | null;
  const existing = fetchRespAny?.data ?? null;
  const fetchErr = fetchRespAny?.error ?? null;

    if (fetchErr) {
      console.error('Error fetching existing records for migration:', fetchErr);
    }

    const existingDates = new Set<string>((existing || []).map((r) => r.created_at));

    for (const record of localRecords) {
      try {
        if (existingDates.has(record.createdAt)) {
          result.skipped += 1;
          continue;
        }

        const dbRecord = {
          user_id: userId,
          answers: record.answers,
          total: record.total,
          severity: record.severity,
          created_at: record.createdAt,
          synced_at: new Date().toISOString(),
        } as Record<string, unknown>;

        const insertRespTyped = (await supabase.from('phq9_records').insert(dbRecord)) as { error?: Error };
        const insertErr = insertRespTyped?.error ?? null;
        if (insertErr) {
          console.error('Error inserting record during migration:', insertErr);
          result.errors += 1;
          continue;
        }

        // Mark local record as migrated/cloud-origin
        record.origin = 'cloud';
        result.migrated += 1;
      } catch (err) {
        console.error('Unexpected error migrating record:', err);
        result.errors += 1;
      }
    }

    // Persist updates to localStorage so migrated records are marked
    try {
      const stored = await getRecords();
      const updated = stored.map(r => {
        const match = localRecords.find(l => l.createdAt === r.createdAt);
        return match ? { ...r, origin: match.origin ?? r.origin } : r;
      });
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(updated));
    } catch (err) {
      console.error('Error updating local records after migration:', err);
    }

    return result;
  } catch (error) {
    console.error('Migration failed:', error);
    return result;
  }
}

/**
 * Merge local and cloud records (removes duplicates by createdAt)
 * @returns Promise resolving to merged array of PHQ9Record
 */
export async function getMergedRecords(): Promise<PHQ9Record[]> {
  console.log('🔄 getMergedRecords() called');
  try {
    const localRecords = await getRecords();
    console.log('💾 Local records:', localRecords.length);
    
    if (!isCloudSyncEnabled()) {
      console.log('☁️ Cloud sync disabled, using local only');
      return localRecords;
    }

    console.log('☁️ Cloud sync enabled, fetching from Supabase...');
    const cloudRecords = await fetchRecordsFromSupabase();
    console.log('☁️ Cloud records:', cloudRecords.length);
    
    // Merge and deduplicate by createdAt
    const recordMap = new Map<string, PHQ9Record>();
    
    [...localRecords, ...cloudRecords].forEach(record => {
      recordMap.set(record.createdAt, record);
    });
    
    const mergedRecords = Array.from(recordMap.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    console.log('✅ Merged records:', mergedRecords.length);
    return mergedRecords;
  } catch (error) {
    console.error('❌ Error merging records:', error);
    return await getRecords(); // Fallback to local only
  }
}
