// Jest configuration for Next.js with Vercel AI SDK
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  coverageDirectory: "./coverage",
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  collectCoverageFrom: [
    "app/api/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "!app/**/*.d.ts",
    "!app/**/__tests__/**",
    "!**/node_modules/**",
    "!**/*.config.*",
  ],
  testMatch: [
    "**/__tests__/**/*.test.ts",
    "**/__tests__/**/*.test.tsx",
    "**/?(*.)+(spec|test).ts",
    "**/?(*.)+(spec|test).tsx",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.ts"],
  testTimeout: 30000,
  verbose: true,
};
