import 'reflect-metadata';
import { RoleSelectionUserUseCase } from '../../../../../src/app/application/usecases/roleSelectionUserUseCase';
import { BadRequestException } from '../../../../../src/app/application/exceptions/BadRequest.exception';
import { ExternalServiceException } from '../../../../../src/app/application/exceptions/ExternalService.exception';

describe('RoleSelectionUserUseCase', () => {
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
      session: 'sess-123',
      authentication: { login: 'user123' },
      subsidiary: { code: 1 },
      branch: { code: 2 },
      role: { code: 3 }
    },
    cobisHeaders
  };

  it('delegates to role selection provider and returns result', async () => {
    const roleResult = { authenticationResult: { authorization: 'Bearer new-token' } };
    const provider = {
      selectRole: jest.fn().mockResolvedValue(roleResult)
    };

    const useCase = new RoleSelectionUserUseCase(provider as any);

    const result = await useCase.execute(validInput);

    expect(provider.selectRole).toHaveBeenCalledWith(validInput.request, cobisHeaders);
    expect(result).toBe(roleResult);
  });

  it('throws BadRequestException when login is empty', async () => {
    const provider = { selectRole: jest.fn() };
    const useCase = new RoleSelectionUserUseCase(provider as any);

    await expect(
      useCase.execute({
        request: { ...validInput.request, authentication: { login: '   ' } },
        cobisHeaders
      })
    ).rejects.toBeInstanceOf(BadRequestException);

    await expect(
      useCase.execute({
        request: { ...validInput.request, authentication: { login: '' } },
        cobisHeaders
      })
    ).rejects.toThrow('authentication.login is required');
  });

  it('throws BadRequestException when subsidiary.code is missing', async () => {
    const provider = { selectRole: jest.fn() };
    const useCase = new RoleSelectionUserUseCase(provider as any);

    await expect(
      useCase.execute({
        request: { ...validInput.request, subsidiary: { code: undefined as any } },
        cobisHeaders
      })
    ).rejects.toBeInstanceOf(BadRequestException);

    await expect(
      useCase.execute({
        request: { ...validInput.request, subsidiary: { code: null as any } },
        cobisHeaders
      })
    ).rejects.toThrow('subsidiary.code is required');
  });

  it('throws BadRequestException when branch.code is missing', async () => {
    const provider = { selectRole: jest.fn() };
    const useCase = new RoleSelectionUserUseCase(provider as any);

    await expect(
      useCase.execute({
        request: { ...validInput.request, branch: { code: undefined as any } },
        cobisHeaders
      })
    ).rejects.toBeInstanceOf(BadRequestException);

    await expect(
      useCase.execute({
        request: { ...validInput.request, branch: { code: null as any } },
        cobisHeaders
      })
    ).rejects.toThrow('branch.code is required');
  });

  it('throws BadRequestException when role.code is missing', async () => {
    const provider = { selectRole: jest.fn() };
    const useCase = new RoleSelectionUserUseCase(provider as any);

    await expect(
      useCase.execute({
        request: { ...validInput.request, role: { code: undefined as any } },
        cobisHeaders
      })
    ).rejects.toBeInstanceOf(BadRequestException);

    await expect(
      useCase.execute({
        request: { ...validInput.request, role: { code: null as any } },
        cobisHeaders
      })
    ).rejects.toThrow('role.code is required');
  });

  it('maps 401 error to ExternalServiceException with status 401', async () => {
    const provider = {
      selectRole: jest.fn().mockRejectedValue(new Error('401 Unauthorized'))
    };
    const useCase = new RoleSelectionUserUseCase(provider as any);

    await expect(useCase.execute(validInput)).rejects.toMatchObject<Partial<ExternalServiceException>>({
      statusCode: 401,
      message: 'Invalid session or credentials'
    });
  });

  it('maps unauthorized message to ExternalServiceException with status 401', async () => {
    const provider = {
      selectRole: jest.fn().mockRejectedValue(new Error('unauthorized'))
    };
    const useCase = new RoleSelectionUserUseCase(provider as any);

    await expect(useCase.execute(validInput)).rejects.toMatchObject<Partial<ExternalServiceException>>({
      statusCode: 401
    });
  });

  it('maps 403 error to ExternalServiceException with status 403', async () => {
    const provider = {
      selectRole: jest.fn().mockRejectedValue(new Error('403 Forbidden'))
    };
    const useCase = new RoleSelectionUserUseCase(provider as any);

    await expect(useCase.execute(validInput)).rejects.toMatchObject<Partial<ExternalServiceException>>({
      statusCode: 403,
      message: 'Access forbidden by external service'
    });
  });

  it('maps forbidden message to ExternalServiceException with status 403', async () => {
    const provider = {
      selectRole: jest.fn().mockRejectedValue(new Error('access forbidden'))
    };
    const useCase = new RoleSelectionUserUseCase(provider as any);

    await expect(useCase.execute(validInput)).rejects.toMatchObject<Partial<ExternalServiceException>>({
      statusCode: 403
    });
  });

  it('maps "not configured" error to ExternalServiceException with status 500', async () => {
    const provider = {
      selectRole: jest.fn().mockRejectedValue(new Error('service is not configured'))
    };
    const useCase = new RoleSelectionUserUseCase(provider as any);

    await expect(useCase.execute(validInput)).rejects.toMatchObject<Partial<ExternalServiceException>>({
      statusCode: 500
    });
  });

  it('maps unknown errors to ExternalServiceException with status 502', async () => {
    const provider = {
      selectRole: jest.fn().mockRejectedValue(new Error('network timeout'))
    };
    const useCase = new RoleSelectionUserUseCase(provider as any);

    await expect(useCase.execute(validInput)).rejects.toMatchObject<Partial<ExternalServiceException>>({
      statusCode: 502
    });
  });

  it('maps non-Error rejections to ExternalServiceException with status 502', async () => {
    const provider = {
      selectRole: jest.fn().mockRejectedValue('string error')
    };
    const useCase = new RoleSelectionUserUseCase(provider as any);

    await expect(useCase.execute(validInput)).rejects.toMatchObject<Partial<ExternalServiceException>>({
      statusCode: 502
    });
  });
});
