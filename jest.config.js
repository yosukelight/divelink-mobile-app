/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    // Stub out native/Expo modules that can't run in Node
    '^expo-notifications$': '<rootDir>/__mocks__/expo-notifications.ts',
    '^expo-router$': '<rootDir>/__mocks__/expo-router.ts',
    '^expo-status-bar$': '<rootDir>/__mocks__/expo-status-bar.ts',
    '^@supabase/supabase-js$': '<rootDir>/__mocks__/@supabase/supabase-js.ts',
    '^react-native$': '<rootDir>/__mocks__/react-native.ts',
  },
  globals: {
    'ts-jest': {
      tsconfig: {
        strict: true,
        esModuleInterop: true,
        jsx: 'react',
      },
    },
  },
  collectCoverageFrom: [
    'lib/**/*.ts',
    'data/**/*.ts',
    'stores/**/*.ts',
    '!**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
