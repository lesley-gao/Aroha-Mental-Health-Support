import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Reset localStorage before each test
beforeEach(() => {
  // Use fake timers to ensure any setTimeout/setInterval are controllable and cleared
  try {
    jest.useFakeTimers();
  } catch {
    // ignore if jest timer APIs are not available
  }

  localStorage.clear();
});

// Common teardown to avoid leaked handles (timers, listeners, mocks)
afterEach(() => {
  // cleanup mounted DOM trees from React Testing Library
  try {
    cleanup();
  } catch {
    // ignore cleanup errors in older RTL versions
  }

  // Clear any pending timers that may have been created by components
  try {
    jest.clearAllTimers();
  } catch {
    // jest might not support timer APIs in some environments
  }

  // Restore mocks to avoid cross-test pollution
  try {
    jest.restoreAllMocks();
  } catch {
    // ignore if not available
  }
});

afterAll(() => {
  // Ensure real timers are used after tests complete
  try {
    jest.useRealTimers();
  } catch {
    // ignore
  }
});

// Provide a lightweight mock for Supabase so tests don't attempt to evaluate import.meta.env
// and so components that import '@/lib/supabase' can be exercised without network.
jest.mock('@/lib/supabase', () => {
  const mockSub = { unsubscribe: jest.fn() };
  const mockAuth = {
    getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
    getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
    onAuthStateChange: jest.fn().mockReturnValue({ data: { subscription: mockSub } }),
    signInWithPassword: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
    signUp: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
    signOut: jest.fn().mockResolvedValue({ error: null }),
  };

  return {
    supabase: { auth: mockAuth },
    isSupabaseConfigured: () => false,
  };
});
