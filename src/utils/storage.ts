/**
 * Storage utilities for Aroha MVP
 * Handles localStorage operations for PHQ-9 records, user preferences, and consent
 * Also supports Supabase cloud sync when enabled
 */

import { supabase, isSupabaseConfigured, type PHQ9RecordDB } from '../lib/supabase';

// Storage keys
const STORAGE_KEYS = {
  RECORDS: 'phq9_records',
  LANGUAGE: 'phq9_lang',
  CONSENT: 'phq9_consent',
  CLOUD_SYNC: 'phq9_cloud_sync_enabled',
  USER_ID: 'phq9_user_id', // Anonymous user ID for Supabase
} as const;

// Type definitions
export interface PHQ9Record {
  id: string;
  answers: number[]; // Array of 9 answers (0-3)
  total: number;
  severity: string;
  locale: string; // 'en' or 'mi'
  createdAt: string; // ISO 8601 date string
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
 * Save a new PHQ-9 record to localStorage
 * Also syncs to Supabase if cloud sync is enabled
 * @param record - The PHQ9Record to save
 * @returns Promise resolving when save is complete
 */
export async function saveRecord(record: PHQ9Record): Promise<void> {
  try {
    const records = await getRecords();
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
    if (!data) return null;
    return JSON.parse(data) as ConsentData;
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
    localStorage.setItem(STORAGE_KEYS.CONSENT, JSON.stringify(consentData));
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
 * Get or create anonymous user ID for Supabase
 * @returns The user ID
 */
function getUserId(): string {
  try {
    let userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (!userId) {
      // Generate a random UUID-like ID
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
    }
    return userId;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return 'user_default';
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
    const userId = getUserId();
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
    const userId = getUserId();
    const { data, error } = await supabase
      .from('phq9_records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching records from Supabase:', error);
      return [];
    }

    // Convert DB records to PHQ9Record format
    return (data || []).map((dbRecord: PHQ9RecordDB) => ({
      id: dbRecord.id || '',
      answers: dbRecord.answers,
      total: dbRecord.total,
      severity: dbRecord.severity,
      locale: 'en', // Default, can be enhanced later
      createdAt: dbRecord.created_at,
    }));
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
    const userId = getUserId();

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
 * Merge local and cloud records (removes duplicates by createdAt)
 * @returns Promise resolving to merged array of PHQ9Record
 */
export async function getMergedRecords(): Promise<PHQ9Record[]> {
  try {
    const localRecords = await getRecords();
    
    if (!isCloudSyncEnabled()) {
      return localRecords;
    }

    const cloudRecords = await fetchRecordsFromSupabase();
    
    // Merge and deduplicate by createdAt
    const recordMap = new Map<string, PHQ9Record>();
    
    [...localRecords, ...cloudRecords].forEach(record => {
      recordMap.set(record.createdAt, record);
    });
    
    // Sort by createdAt descending
    return Array.from(recordMap.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error merging records:', error);
    return await getRecords(); // Fallback to local only
  }
}
