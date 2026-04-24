import 'reflect-metadata';
import { AuthenticateUserUseCase } from '../../../../../src/app/application/usecases/authenticateUserUseCase';
import { BadRequestException } from '../../../../../src/app/application/exceptions/BadRequest.exception';
import { ExternalServiceException } from '../../../../../src/app/application/exceptions/ExternalService.exception';

describe('AuthenticateUserUseCase', () => {
  const cobisHeaders = {
    authorization: 'Bearer token',
    requestId: 'request-1',
    endUserLogin: 'userA',
    endUserRequestDateTime: '2026-01-01T00:00:00.000Z',
    endUserTerminal: 'api',
    endUserLastLoggedDateTime: '2026-01-01T00:00:00.000Z'
  };

  const validInput = {
    request: {
      authentication: {
        login: 'user123',
        password: 'pass456'
      }
    },
    cobisHeaders
  };

  it('delegates to authentication provider and returns result', async () => {
    const authResult = { token: 'abc123', session: 'sess-1' };
    const provider = {
      authenticate: jest.fn().mockResolvedValue(authResult)
    };

    const useCase = new AuthenticateUserUseCase(provider as any);

    const result = await useCase.execute(validInput);

    expect(provider.authenticate).toHaveBeenCalledWith(validInput.request, cobisHeaders);
    expect(result).toBe(authResult);
  });

  it('throws BadRequestException when login is empty', async () => {
    const provider = { authenticate: jest.fn() };
    const useCase = new AuthenticateUserUseCase(provider as any);

    await expect(
      useCase.execute({
        request: { authentication: { login: '   ', password: 'pass456' } },
        cobisHeaders
      })
    ).rejects.toBeInstanceOf(BadRequestException);

    await expect(
      useCase.execute({
        request: { authentication: { login: '   ', password: 'pass456' } },
        cobisHeaders
      })
    ).rejects.toThrow('authentication.login is required');
  });

  it('throws BadRequestException when password is missing', async () => {
    const provider = { authenticate: jest.fn() };
    const useCase = new AuthenticateUserUseCase(provider as any);

    await expect(
      useCase.execute({
        request: { authentication: { login: 'user123', password: '' } },
        cobisHeaders
      })
    ).rejects.toBeInstanceOf(BadRequestException);

    await expect(
      useCase.execute({
        request: { authentication: { login: 'user123', password: '' } },
        cobisHeaders
      })
    ).rejects.toThrow('authentication.password is required');
  });

  it('maps 401 error to ExternalServiceException with status 401', async () => {
    const provider = {
      authenticate: jest.fn().mockRejectedValue(new Error('401 Unauthorized'))
    };
    const useCase = new AuthenticateUserUseCase(provider as any);

    await expect(useCase.execute(validInput)).rejects.toMatchObject<Partial<ExternalServiceException>>({
      statusCode: 401,
      message: 'Invalid credentials'
    });
  });

  it('maps unauthorized message to ExternalServiceException with status 401', async () => {
    const provider = {
      authenticate: jest.fn().mockRejectedValue(new Error('unauthorized access'))
    };
    const useCase = new AuthenticateUserUseCase(provider as any);

    await expect(useCase.execute(validInput)).rejects.toMatchObject<Partial<ExternalServiceException>>({
      statusCode: 401
    });
  });

  it('maps 403 error to ExternalServiceException with status 403', async () => {
    const provider = {
      authenticate: jest.fn().mockRejectedValue(new Error('403 Forbidden'))
    };
    const useCase = new AuthenticateUserUseCase(provider as any);

    await expect(useCase.execute(validInput)).rejects.toMatchObject<Partial<ExternalServiceException>>({
      statusCode: 403,
      message: 'Access forbidden by external service'
    });
  });

  it('maps forbidden message to ExternalServiceException with status 403', async () => {
    const provider = {
      authenticate: jest.fn().mockRejectedValue(new Error('forbidden resource'))
    };
    const useCase = new AuthenticateUserUseCase(provider as any);

    await expect(useCase.execute(validInput)).rejects.toMatchObject<Partial<ExternalServiceException>>({
      statusCode: 403
    });
  });

  it('maps "not configured" error to ExternalServiceException with status 500', async () => {
    const provider = {
      authenticate: jest.fn().mockRejectedValue(new Error('Cobis service is not configured'))
    };
    const useCase = new AuthenticateUserUseCase(provider as any);

    await expect(useCase.execute(validInput)).rejects.toMatchObject<Partial<ExternalServiceException>>({
      statusCode: 500,
      message: 'Cobis service is not properly configured'
    });
  });

  it('maps unknown errors to ExternalServiceException with status 502', async () => {
    const provider = {
      authenticate: jest.fn().mockRejectedValue(new Error('unknown network error'))
    };
    const useCase = new AuthenticateUserUseCase(provider as any);

    await expect(useCase.execute(validInput)).rejects.toMatchObject<Partial<ExternalServiceException>>({
      statusCode: 502
    });
  });

  it('maps non-Error rejections to ExternalServiceException with status 502', async () => {
    const provider = {
      authenticate: jest.fn().mockRejectedValue('string error')
    };
    const useCase = new AuthenticateUserUseCase(provider as any);

    await expect(useCase.execute(validInput)).rejects.toMatchObject<Partial<ExternalServiceException>>({
      statusCode: 502
    });
  });
});
