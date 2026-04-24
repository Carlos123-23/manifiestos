import * as server from '../../../src/server';

jest.mock('../../../src/routers/index', () => {
  return [];
});

jest.mock('@darwin-node/composer', () => {
  return {
    generateFastifyApp: jest.fn().mockImplementation(() => {
      return {
        listen: jest.fn().mockImplementation((port, cb) => { return cb(); })
      };
    })
  };
});

describe('********* UNIT TEST FOR APPLICATION SERVER *******', () => {
  it('should test application server', () => {
    expect(server).toBeDefined();
  });
});
