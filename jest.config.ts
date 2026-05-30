import type { Config } from 'jest';
import nextJest from 'next/jest.js';

// next/jest wires up the SWC transform, CSS/asset mocks, next.config and .env loading.
const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  // jsdom gives us a DOM for React Testing Library.
  testEnvironment: 'jest-environment-jsdom',

  // Runs after the test framework is installed — registers jest-dom + MSW lifecycle.
  setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.setup.ts'],

  // Only unit + integration suites run under Jest. E2E belongs to Playwright.
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.{ts,tsx}',
    '<rootDir>/tests/integration/**/*.test.{ts,tsx}',
  ],

  // Mirror the "@/*" path alias from tsconfig.json.
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },

  clearMocks: true,

  // Coverage gates the business-logic + reusable-component layers, where bugs are
  // costly and tests are stable. Route components (app/**) are exercised by the
  // integration + E2E suites but kept out of the gate so the thresholds aren't
  // diluted by large presentational pages (onboarding, aula, trilha detail).
  collectCoverageFrom: [
    'utils/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    'services/**/*.{ts,tsx}',
    'store/**/*.{ts,tsx}',
    'components/ui/**/*.{ts,tsx}',
    'components/auth/**/*.{ts,tsx}',
    '!**/*.d.ts',
  ],
  coverageDirectory: '<rootDir>/tests/reports/coverage',
  coverageReporters: ['text', 'text-summary', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
  },
};

export default createJestConfig(config);
