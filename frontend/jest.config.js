export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  moduleFileExtensions: ['js', 'jsx'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/styleMock.js'
  },
  testMatch: ['**/?(*.)+(test).[jt]sx'],
  extensionsToTreatAsEsm: ['.jsx'],
};

