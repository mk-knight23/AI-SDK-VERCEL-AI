// Jest setup file for InsightStream tests

// Mock environment variables
process.env.OPENAI_API_KEY = 'test-api-key';

// Mock console methods to reduce noise during tests
// but keep error logging for debugging
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: console.error,
};

// Global test timeout
jest.setTimeout(30000);
