import { setLanguage, getLanguage } from '@/utils/storage';

describe('storage language', () => {
  test('setLanguage and getLanguage support zh', () => {
    setLanguage('zh');
    expect(getLanguage()).toBe('zh');
    // cleanup
    setLanguage('en');
  });
});
