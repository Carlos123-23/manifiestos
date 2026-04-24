import { buildCobisHeadersPreHandler } from '../../../../../../src/app/adapter/http/prehandlers/buildCobisHeaders.prehandler';
import { BadRequestException } from '../../../../../../src/app/application/exceptions/BadRequest.exception';

describe('buildCobisHeadersPreHandler', () => {
  it('builds normalized cobis headers when required headers are present', async () => {
    const request = {
      headers: {
        authorization: 'token-123',
        'x-end-user-login': 'userA'
      }
    } as any;

    await buildCobisHeadersPreHandler(request);

    expect(request.cobisHeaders).toBeDefined();
    expect(request.cobisHeaders.authorization).toBe('Bearer token-123');
    expect(request.cobisHeaders.endUserLogin).toBe('userA');
    expect(request.cobisHeaders.endUserTerminal).toBe('api');
    expect(request.cobisHeaders.requestId).toBeDefined();
    expect(request.cobisHeaders.endUserRequestDateTime).toBeDefined();
    expect(request.cobisHeaders.endUserLastLoggedDateTime).toBeDefined();
  });

  it('keeps authorization unchanged when Bearer prefix already exists', async () => {
    const request = {
      headers: {
        authorization: 'Bearer abc',
        'x-end-user-login': 'userA',
        'x-end-user-terminal': 'web',
        'x-request-id': 'request-1'
      }
    } as any;

    await buildCobisHeadersPreHandler(request);

    expect(request.cobisHeaders.authorization).toBe('Bearer abc');
    expect(request.cobisHeaders.endUserTerminal).toBe('web');
    expect(request.cobisHeaders.requestId).toBe('request-1');
  });

  it('throws BadRequestException when required headers are missing', async () => {
    const request = {
      headers: {
        authorization: 'Bearer abc'
      }
    } as any;

    await expect(buildCobisHeadersPreHandler(request)).rejects.toBeInstanceOf(BadRequestException);
    await expect(buildCobisHeadersPreHandler(request)).rejects.toThrow(
      'Headers authorization and x-end-user-login are required'
    );
  });
});
