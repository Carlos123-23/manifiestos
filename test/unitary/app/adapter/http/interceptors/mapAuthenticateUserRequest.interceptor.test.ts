import { mapAuthenticateUserRequestInterceptor } from '../../../../../../src/app/adapter/http/interceptors/mapAuthenticateUserRequest.interceptor';
import { BadRequestException } from '../../../../../../src/app/application/exceptions/BadRequest.exception';

describe('mapAuthenticateUserRequestInterceptor', () => {
  const cobisHeaders = {
    authorization: 'Bearer token',
    requestId: 'r1',
    endUserLogin: 'user',
    endUserRequestDateTime: '2026-01-01T00:00:00.000Z',
    endUserTerminal: 'api',
    endUserLastLoggedDateTime: '2026-01-01T00:00:00.000Z'
  };

  it('maps authentication body and cobis headers to authenticateUserInput', async () => {
    const request = {
      body: {
        authentication: {
          login: 'user123',
          password: 'pass456'
        }
      },
      cobisHeaders
    } as any;

    await mapAuthenticateUserRequestInterceptor(request);

    expect(request.authenticateUserInput).toEqual({
      request: { authentication: { login: 'user123', password: 'pass456' } },
      cobisHeaders
    });
  });

  it('throws BadRequestException when login is missing', async () => {
    const request = {
      body: {
        authentication: {
          login: '',
          password: 'pass456'
        }
      },
      cobisHeaders
    } as any;

    await expect(mapAuthenticateUserRequestInterceptor(request)).rejects.toBeInstanceOf(
      BadRequestException
    );
    await expect(mapAuthenticateUserRequestInterceptor(request)).rejects.toThrow(
      'Invalid authentication payload'
    );
  });

  it('throws BadRequestException when password is missing', async () => {
    const request = {
      body: {
        authentication: {
          login: 'user123',
          password: ''
        }
      },
      cobisHeaders
    } as any;

    await expect(mapAuthenticateUserRequestInterceptor(request)).rejects.toBeInstanceOf(
      BadRequestException
    );
  });

  it('throws BadRequestException when authentication body is missing', async () => {
    const request = {
      body: null,
      cobisHeaders
    } as any;

    await expect(mapAuthenticateUserRequestInterceptor(request)).rejects.toBeInstanceOf(
      BadRequestException
    );
  });

  it('throws BadRequestException when cobisHeaders are missing', async () => {
    const request = {
      body: {
        authentication: {
          login: 'user123',
          password: 'pass456'
        }
      }
    } as any;

    await expect(mapAuthenticateUserRequestInterceptor(request)).rejects.toBeInstanceOf(
      BadRequestException
    );
    await expect(mapAuthenticateUserRequestInterceptor(request)).rejects.toThrow(
      'Required Cobis headers are missing'
    );
  });
});
