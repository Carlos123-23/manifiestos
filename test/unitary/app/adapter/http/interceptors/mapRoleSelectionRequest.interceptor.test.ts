import { mapRoleSelectionRequestInterceptor } from '../../../../../../src/app/adapter/http/interceptors/mapRoleSelectionRequest.interceptor';
import { BadRequestException } from '../../../../../../src/app/application/exceptions/BadRequest.exception';

describe('mapRoleSelectionRequestInterceptor', () => {
  const cobisHeaders = {
    authorization: 'Bearer token',
    requestId: 'r1',
    endUserLogin: 'user',
    endUserRequestDateTime: '2026-01-01T00:00:00.000Z',
    endUserTerminal: 'api',
    endUserLastLoggedDateTime: '2026-01-01T00:00:00.000Z'
  };

  const validBody = {
    session: 'sess-123',
    authentication: { login: 'user123' },
    subsidiary: { code: 1 },
    branch: { code: 2 },
    role: { code: 3 }
  };

  it('maps role selection body and cobis headers to roleSelectionInput', async () => {
    const request = {
      body: validBody,
      cobisHeaders
    } as any;

    await mapRoleSelectionRequestInterceptor(request);

    expect(request.roleSelectionInput).toEqual({
      request: validBody,
      cobisHeaders
    });
  });

  it('throws BadRequestException when login is missing', async () => {
    const request = {
      body: { ...validBody, authentication: { login: '' } },
      cobisHeaders
    } as any;

    await expect(mapRoleSelectionRequestInterceptor(request)).rejects.toBeInstanceOf(
      BadRequestException
    );
    await expect(mapRoleSelectionRequestInterceptor(request)).rejects.toThrow(
      'Invalid role selection payload'
    );
  });

  it('throws BadRequestException when subsidiary.code is undefined', async () => {
    const request = {
      body: { ...validBody, subsidiary: { code: undefined } },
      cobisHeaders
    } as any;

    await expect(mapRoleSelectionRequestInterceptor(request)).rejects.toBeInstanceOf(
      BadRequestException
    );
  });

  it('throws BadRequestException when branch.code is undefined', async () => {
    const request = {
      body: { ...validBody, branch: { code: undefined } },
      cobisHeaders
    } as any;

    await expect(mapRoleSelectionRequestInterceptor(request)).rejects.toBeInstanceOf(
      BadRequestException
    );
  });

  it('throws BadRequestException when role.code is undefined', async () => {
    const request = {
      body: { ...validBody, role: { code: undefined } },
      cobisHeaders
    } as any;

    await expect(mapRoleSelectionRequestInterceptor(request)).rejects.toBeInstanceOf(
      BadRequestException
    );
  });

  it('throws BadRequestException when cobisHeaders are missing', async () => {
    const request = {
      body: validBody
    } as any;

    await expect(mapRoleSelectionRequestInterceptor(request)).rejects.toBeInstanceOf(
      BadRequestException
    );
    await expect(mapRoleSelectionRequestInterceptor(request)).rejects.toThrow(
      'Required Cobis headers are missing'
    );
  });

  it('throws BadRequestException when body is null', async () => {
    const request = {
      body: null,
      cobisHeaders
    } as any;

    await expect(mapRoleSelectionRequestInterceptor(request)).rejects.toBeInstanceOf(
      BadRequestException
    );
  });
});
