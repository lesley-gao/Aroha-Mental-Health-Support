import { saveRecord, getRecords, setCloudSyncEnabled, type PHQ9Record } from '@/utils/storage';

describe('storage record origin', () => {
  beforeEach(() => {
    // ensure cloud sync is disabled during test
    setCloudSyncEnabled(false);
    localStorage.clear();
  });

  test('saving anonymous record sets origin to local', async () => {
    const record: PHQ9Record = {
      id: 'test-1',
      answers: [0,0,0,0,0,0,0,0,0],
      total: 0,
      severity: 'Minimal',
      locale: 'en',
      createdAt: new Date().toISOString(),
    };

    await saveRecord(record);
    const records = await getRecords();
    expect(records.length).toBeGreaterThan(0);
    expect(records[0].origin).toBe('local');
  });
});
