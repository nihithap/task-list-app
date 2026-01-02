{
  "testEnvironment": "jsdom",
  "testMatch": [
    "**/tests/**/*.test.js"
  ],
  "collectCoverageFrom": [
    "src/**/*.js",
    "!src/**/*.min.js"
  ],
  "coveragePathIgnorePatterns": [
    "/node_modules/"
  ],
  "setupFilesAfterEnv": [
    "<rootDir>/jest.setup.js"
  ],
  "testTimeout": 10000,
  "verbose": true,
  "bail": false
}
