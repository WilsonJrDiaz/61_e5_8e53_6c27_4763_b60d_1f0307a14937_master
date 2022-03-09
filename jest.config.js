module.exports = {
    collectCoverage: true,
    coverageReporters: ['lcov', 'text', 'text-summary', 'html'],
    collectCoverageFrom: [
      'src/**/*.ts',
      '!src/**/__tests__/**',
      '!**/index.ts',
      '!src/config/*',
    ],
    roots: ['./test'],
    coverageThreshold: {
      global: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
    preset: 'ts-jest',
    moduleNameMapper: {
      '^@App/(.*)$': '<rootDir>/src/$1',
      '^lib/(.*)$': '<rootDir>/common/$1',
    },
  };
  