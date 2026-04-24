module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    'src/**/*.ts'
  ],
  coverageReporters: [
    'json',
    'lcov',
    'cobertura',
    'text'
  ],
  setupFiles: ['./test/helpers/global.mocks.ts'],
  coveragePathIgnorePatterns: ['./src/index.ts']

};
