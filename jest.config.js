export default {
  // Use the ts-jest ESM preset to better align with Vite (import.meta) and ESM modules
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.app.json',
      useESM: true,
      isolatedModules: true,
    },
  },
  // Treat TS/TSX as ESM files during tests
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
  '^@/lib/supabase$': '<rootDir>/src/__mocks__/lib/supabase.ts',
  '^@/utils/test-supabase$': '<rootDir>/src/__mocks__/utils/test-supabase.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  setupFiles: [],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        jsx: 'react-jsx',
      },
    }],
  },
};
