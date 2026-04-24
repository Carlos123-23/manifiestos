import * as routers from '../../../src/routers';

describe('********* UNIT TEST FOR APPLICATION SERVER *******', () => {
  it('should test application server', () => {
    expect(routers).toBeDefined();
  });
  it('should test multiple routers', () => {
    expect(routers[0].prefix).toBeDefined();
    expect(routers[0].prefix).toEqual(expect.stringContaining('/api'));
  });
});
