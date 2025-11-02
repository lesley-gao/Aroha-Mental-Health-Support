/**
 * Unit tests for localStorage wrapper utilities
 * Tests record persistence, retrieval, and data management functions
 */

import {
  getRecords,
  saveRecord,
  clearRecords,
  getLanguage,
  setLanguage,
  getConsent,
  setConsent,
  clearAllData,
} from '../utils/storage';

describe('Storage Utilities', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('getRecords', () => {
    it('should return empty array when no records exist', async () => {
      const records = await getRecords();
      expect(records).toEqual([]);
    });

    it('should return stored records', async () => {
      const testRecord = {
        id: '1',
        answers: [0, 1, 2, 3, 0, 1, 2, 3, 1],
        total: 13,
        severity: 'Moderate',
        locale: 'en' as const,
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem('phq9_records', JSON.stringify([testRecord]));
      
      const records = await getRecords();
      expect(records).toHaveLength(1);
      expect(records[0]).toEqual(testRecord);
    });

    it('should handle corrupted data gracefully', async () => {
      localStorage.setItem('phq9_records', 'invalid json');
      
      const records = await getRecords();
      expect(records).toEqual([]);
    });

    it('should return multiple records in order', async () => {
      const records = [
        {
          id: '1',
          answers: [1, 1, 1, 1, 1, 1, 1, 1, 1],
          total: 9,
          severity: 'Mild',
          locale: 'en' as const,
          createdAt: '2025-11-01T10:00:00.000Z',
        },
        {
          id: '2',
          answers: [2, 2, 2, 2, 2, 2, 2, 2, 2],
          total: 18,
          severity: 'Moderately severe',
          locale: 'mi' as const,
          createdAt: '2025-11-01T11:00:00.000Z',
        },
      ];
      
      localStorage.setItem('phq9_records', JSON.stringify(records));
      
      const retrieved = await getRecords();
      expect(retrieved).toHaveLength(2);
      expect(retrieved[0].id).toBe('1');
      expect(retrieved[1].id).toBe('2');
    });
  });

  describe('saveRecord', () => {
    it('should save a new record', async () => {
      const newRecord = {
        id: '1',
        answers: [0, 1, 2, 3, 0, 1, 2, 3, 1],
        total: 13,
        severity: 'Moderate',
        locale: 'en' as const,
        createdAt: new Date().toISOString(),
      };
      
      await saveRecord(newRecord);
      
      const records = await getRecords();
      expect(records).toHaveLength(1);
      expect(records[0]).toEqual(newRecord);
    });

    it('should append to existing records', async () => {
      const firstRecord = {
        id: '1',
        answers: [1, 1, 1, 1, 1, 1, 1, 1, 1],
        total: 9,
        severity: 'Mild',
        locale: 'en' as const,
        createdAt: '2025-11-01T10:00:00.000Z',
      };
      
      const secondRecord = {
        id: '2',
        answers: [2, 2, 2, 2, 2, 2, 2, 2, 2],
        total: 18,
        severity: 'Moderately severe',
        locale: 'mi' as const,
        createdAt: '2025-11-01T11:00:00.000Z',
      };
      
      await saveRecord(firstRecord);
      await saveRecord(secondRecord);
      
      const records = await getRecords();
      expect(records).toHaveLength(2);
      expect(records[0].id).toBe('1');
      expect(records[1].id).toBe('2');
    });

    it('should preserve existing data when adding new record', async () => {
      const existingRecords = [
        {
          id: '1',
          answers: [0, 0, 0, 0, 0, 0, 0, 0, 0],
          total: 0,
          severity: 'Minimal',
          locale: 'en' as const,
          createdAt: '2025-11-01T09:00:00.000Z',
        },
      ];
      
      localStorage.setItem('phq9_records', JSON.stringify(existingRecords));
      
      const newRecord = {
        id: '2',
        answers: [3, 3, 3, 3, 3, 3, 3, 3, 3],
        total: 27,
        severity: 'Severe',
        locale: 'en' as const,
        createdAt: '2025-11-01T10:00:00.000Z',
      };
      
      await saveRecord(newRecord);
      
      const records = await getRecords();
      expect(records).toHaveLength(2);
      expect(records[0].total).toBe(0);
      expect(records[1].total).toBe(27);
    });
  });

  describe('clearRecords', () => {
    it('should clear all records', async () => {
      const testRecord = {
        id: '1',
        answers: [1, 1, 1, 1, 1, 1, 1, 1, 1],
        total: 9,
        severity: 'Mild',
        locale: 'en' as const,
        createdAt: new Date().toISOString(),
      };
      
      await saveRecord(testRecord);
      expect((await getRecords())).toHaveLength(1);
      
      await clearRecords();
      expect((await getRecords())).toHaveLength(0);
    });

    it('should not affect other localStorage keys', async () => {
      localStorage.setItem('phq9_lang', 'mi');
      localStorage.setItem('phq9_consent', JSON.stringify({ hasConsented: true, consentDate: new Date().toISOString() }));
      
      await clearRecords();
      
      expect(localStorage.getItem('phq9_lang')).toBe('mi');
      expect(localStorage.getItem('phq9_consent')).toBeTruthy();
    });
  });

  describe('getLanguage and setLanguage', () => {
    it('should return default language when not set', () => {
      expect(getLanguage()).toBe('en');
    });

    it('should return stored language', () => {
      setLanguage('mi');
      expect(getLanguage()).toBe('mi');
    });

    it('should update language', () => {
      setLanguage('en');
      expect(getLanguage()).toBe('en');
      
      setLanguage('mi');
      expect(getLanguage()).toBe('mi');
    });

    it('should persist language across calls', () => {
      setLanguage('mi');
      expect(getLanguage()).toBe('mi');
      expect(getLanguage()).toBe('mi');
    });
  });

  describe('getConsent and setConsent', () => {
    it('should return null when consent not given', () => {
      expect(getConsent()).toBeNull();
    });

    it('should return consent data after consent given', () => {
      const consentData = { hasConsented: true, consentDate: new Date().toISOString() };
      setConsent(consentData);
      const result = getConsent();
      expect(result).not.toBeNull();
      expect(result?.hasConsented).toBe(true);
      expect(result?.consentDate).toBe(consentData.consentDate);
    });

    it('should allow revoking consent', () => {
      const consentData = { hasConsented: true, consentDate: new Date().toISOString() };
      setConsent(consentData);
      let result = getConsent();
      expect(result?.hasConsented).toBe(true);
      
      const revokeData = { hasConsented: false, consentDate: new Date().toISOString() };
      setConsent(revokeData);
      result = getConsent();
      expect(result?.hasConsented).toBe(false);
    });

    it('should persist consent status', () => {
      const consentData = { hasConsented: true, consentDate: new Date().toISOString() };
      setConsent(consentData);
      const result1 = getConsent();
      const result2 = getConsent();
      expect(result1?.hasConsented).toBe(true);
      expect(result2?.hasConsented).toBe(true);
    });
  });

  describe('clearAllData', () => {
    it('should clear all PHQ-9 related data', async () => {
      // Set up all data types
      await saveRecord({
        id: '1',
        answers: [1, 1, 1, 1, 1, 1, 1, 1, 1],
        total: 9,
        severity: 'Mild',
        locale: 'en' as const,
        createdAt: new Date().toISOString(),
      });
      setLanguage('mi');
      const consentData = { hasConsented: true, consentDate: new Date().toISOString() };
      setConsent(consentData);
      
      // Verify data exists
      expect((await getRecords())).toHaveLength(1);
      expect(getLanguage()).toBe('mi');
      expect(getConsent()?.hasConsented).toBe(true);
      
      // Clear all data
      clearAllData();
      
      // Verify all data cleared
      expect((await getRecords())).toHaveLength(0);
      expect(getLanguage()).toBe('en'); // Returns to default
      expect(getConsent()).toBeNull(); // Returns to null
    });

    it('should not affect non-PHQ9 localStorage keys', () => {
      localStorage.setItem('other_app_data', 'should remain');
      
      clearAllData();
      
      expect(localStorage.getItem('other_app_data')).toBe('should remain');
    });
  });

  describe('data integrity', () => {
    it('should handle special characters in records', async () => {
      const record = {
        id: '1',
        answers: [0, 1, 2, 3, 0, 1, 2, 3, 1],
        total: 13,
        severity: 'Moderate',
        locale: 'en' as const,
        createdAt: new Date().toISOString(),
      };
      
      await saveRecord(record);
      const retrieved = await getRecords();
      
      expect(retrieved[0]).toEqual(record);
    });

    it('should handle large number of records', async () => {
      const records = Array.from({ length: 100 }, (_, i) => ({
        id: String(i),
        answers: [1, 1, 1, 1, 1, 1, 1, 1, 1],
        total: 9,
        severity: 'Mild',
        locale: 'en' as const,
        createdAt: new Date(Date.now() + i * 1000).toISOString(),
      }));
      
      for (const record of records) {
        await saveRecord(record);
      }
      
      const retrieved = await getRecords();
      expect(retrieved).toHaveLength(100);
    });

    it('should maintain record order chronologically', async () => {
      const times = [
        '2025-11-01T08:00:00.000Z',
        '2025-11-01T09:00:00.000Z',
        '2025-11-01T10:00:00.000Z',
      ];
      
      for (let i = 0; i < times.length; i++) {
        await saveRecord({
          id: String(i),
          answers: [i, i, i, i, i, i, i, i, i],
          total: i * 9,
          severity: 'Mild',
          locale: 'en' as const,
          createdAt: times[i],
        });
      }
      
      const records = await getRecords();
      expect(records[0].createdAt).toBe(times[0]);
      expect(records[1].createdAt).toBe(times[1]);
      expect(records[2].createdAt).toBe(times[2]);
    });
  });
});
