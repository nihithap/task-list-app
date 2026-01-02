/**
 * Jest Setup File
 * Configures test environment for Task List App
 */

// Mock localStorage
global.localStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Mock window.navigator
global.navigator = {
  onLine: true,
};

// Suppress console logs during tests (optional)
// global.console = {
//   log: jest.fn(),
//   error: jest.fn(),
//   warn: jest.fn(),
//   info: jest.fn(),
// };

console.log('Jest environment configured');
