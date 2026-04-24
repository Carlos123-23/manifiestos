import 'reflect-metadata';

jest.mock('@darwin-node/logger', () => {
  return {
    actLog: {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn()
    },
    funcLog: {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn()
    },
    techLog: {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn()
    }
  };
});

jest.mock('@darwin-node/error', () => {
  return {
    AppError: jest.fn()
  };
});
