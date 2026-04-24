import 'reflect-metadata';
import { CustomerAccessFlowController } from '../../../../../../src/app/adapter/http/controllers/customerAccessFlowController';
import { CobisException } from '../../../../../../src/app/application/exceptions/CobisException';

describe('CustomerAccessFlowController', () => {
  const cobisHeaders = {
    authorization: 'Bearer token',
    requestId: 'r1',
    endUserLogin: 'user',
    endUserRequestDateTime: '2026-01-01T00:00:00.000Z',
    endUserTerminal: 'api',
    endUserLastLoggedDateTime: '2026-01-01T00:00:00.000Z'
  };

  const naturalPersonResult = {
    naturalPerson: { identification: { number: '12345678', type: { code: 'DNI' } } }
  };

  it('delegates to use case when customerAccessFlowRequest and cobisHeaders are present', async () => {
    const useCase = {
      execute: jest.fn().mockResolvedValue(naturalPersonResult)
    };
    const controller = new CustomerAccessFlowController(useCase as any);

    const req = {
      customerAccessFlowRequest: {
        identificationNumber: '12345678',
        identificationType: 'DNI'
      },
      cobisHeaders
    } as any;

    const result = await controller.execute(req);

    expect(useCase.execute).toHaveBeenCalledWith({
      identificationNumber: '12345678',
      identificationType: 'DNI',
      cobisHeaders
    });
    expect(result).toBe(naturalPersonResult);
  });

  it('throws CobisException(400) when customerAccessFlowRequest is missing', async () => {
    const useCase = { execute: jest.fn() };
    const controller = new CustomerAccessFlowController(useCase as any);

    const req = { cobisHeaders } as any;

    await expect(controller.execute(req)).rejects.toBeInstanceOf(CobisException);
    await expect(controller.execute(req)).rejects.toMatchObject({ statusCode: 400 });
  });

  it('throws CobisException(400) when cobisHeaders is missing', async () => {
    const useCase = { execute: jest.fn() };
    const controller = new CustomerAccessFlowController(useCase as any);

    const req = {
      customerAccessFlowRequest: { identificationNumber: '12345678', identificationType: 'DNI' }
    } as any;

    await expect(controller.execute(req)).rejects.toBeInstanceOf(CobisException);
    await expect(controller.execute(req)).rejects.toMatchObject({ statusCode: 400 });
  });
});
