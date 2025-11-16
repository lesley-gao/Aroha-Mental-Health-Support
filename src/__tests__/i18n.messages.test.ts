import { getMessages, type Locale } from '@/i18n/messages';

describe('i18n messages', () => {
  test('supports zh locale and returns appTitle', () => {
    const msgs = getMessages('zh' as Locale);
    expect(msgs).toBeDefined();
    expect(typeof msgs.appTitle).toBe('string');
    expect(msgs.appTitle.length).toBeGreaterThan(0);
  });

  test('falls back to en for unknown locale', () => {
    const msgs = getMessages('xx' as unknown as Locale);
    expect(msgs).toBeDefined();
    // English appTitle contains 'Aroha' (from repository)
    expect(msgs.appTitle).toMatch(/Aroha|Aroha -/i);
  });
});
