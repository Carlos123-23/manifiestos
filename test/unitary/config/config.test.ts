import config from '../../../src/config/darwin.config';

jest.mock('debug', () => {
  return {
    debug: jest.fn()
  };
});

describe('****** UNIT TEST FOR stress ROUTE *****', () => {
  it('should test config', () => {
    expect(config).toBeDefined();
  });
});
