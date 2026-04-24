import 'reflect-metadata';
import { RoleSelectionController } from '../../../../../../src/app/adapter/http/controllers/roleSelectionController';
import { CobisException } from '../../../../../../src/app/application/exceptions/CobisException';

describe('RoleSelectionController', () => {
  const roleResult = { authenticationResult: { authorization: 'Bearer new-token' } };

  it('delegates to use case when roleSelectionInput is present', async () => {
    const useCase = {
      execute: jest.fn().mockResolvedValue(roleResult)
    };
    const controller = new RoleSelectionController(useCase as any);

    const req = {
      roleSelectionInput: {
        request: {
          session: 'sess-1',
          authentication: { login: 'user' },
          subsidiary: { code: 1 },
          branch: { code: 2 },
          role: { code: 3 }
        },
        cobisHeaders: { authorization: 'Bearer token', requestId: 'r1', endUserLogin: 'user', endUserRequestDateTime: '', endUserTerminal: 'api', endUserLastLoggedDateTime: '' }
      }
    } as any;

    const result = await controller.selectRole(req);

    expect(useCase.execute).toHaveBeenCalledWith(req.roleSelectionInput);
    expect(result).toBe(roleResult);
  });

  it('throws CobisException(400) when roleSelectionInput is missing', async () => {
    const useCase = { execute: jest.fn() };
    const controller = new RoleSelectionController(useCase as any);

    const req = {} as any;

    await expect(controller.selectRole(req)).rejects.toBeInstanceOf(CobisException);
    await expect(controller.selectRole(req)).rejects.toMatchObject({ statusCode: 400, message: 'Mapped request is missing' });
  });
});
