import 'reflect-metadata';
import { AuthenticationController } from '../../../../../../src/app/adapter/http/controllers/authenticationController';
import { CobisException } from '../../../../../../src/app/application/exceptions/CobisException';

describe('AuthenticationController', () => {
  const authResult = { token: 'abc123', session: 'sess-1' };

  it('delegates to use case when authenticateUserInput is present', async () => {
    const useCase = {
      execute: jest.fn().mockResolvedValue(authResult)
    };
    const controller = new AuthenticationController(useCase as any);

    const req = {
      authenticateUserInput: {
        request: { authentication: { login: 'user', password: 'pass' } },
        cobisHeaders: { authorization: 'Bearer token', requestId: 'r1', endUserLogin: 'user', endUserRequestDateTime: '', endUserTerminal: 'api', endUserLastLoggedDateTime: '' }
      }
    } as any;

    const result = await controller.authenticate(req);

    expect(useCase.execute).toHaveBeenCalledWith(req.authenticateUserInput);
    expect(result).toBe(authResult);
  });

  it('throws CobisException(400) when authenticateUserInput is missing', async () => {
    const useCase = { execute: jest.fn() };
    const controller = new AuthenticationController(useCase as any);

    const req = {} as any;

    await expect(controller.authenticate(req)).rejects.toBeInstanceOf(CobisException);
    await expect(controller.authenticate(req)).rejects.toMatchObject({ statusCode: 400, message: 'Mapped request is missing' });
  });
});
