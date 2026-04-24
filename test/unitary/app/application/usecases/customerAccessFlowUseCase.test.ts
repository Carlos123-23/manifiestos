import 'reflect-metadata';
import { BadRequestException } from '../../../../../src/app/application/exceptions/BadRequest.exception';
import { ExternalServiceException } from '../../../../../src/app/application/exceptions/ExternalService.exception';

const cobisHeaders = {
  authorization: 'Bearer token',
  requestId: 'request-1',
  endUserLogin: 'userA',
  endUserRequestDateTime: '2026-01-01T00:00:00.000Z',
  endUserTerminal: 'api',
  endUserLastLoggedDateTime: '2026-01-01T00:00:00.000Z'
};

const validInput = {
  identificationNumber: '12345678',
  identificationType: 'DNI',
  cobisHeaders
};

const authResult = {
  data: {
    session: 'sess-abc',
    official: {
      subsidiaries: [{ code: 1 }],
      branches: [{ code: 2 }],
      roles: [{ code: 3 }]
    }
  }
};

const roleResult = {
  data: {
    authenticationResult: {
      authorization: 'Bearer new-token'
    }
  }
};

const naturalPersonResult = {
  naturalPerson: {
    identification: { number: '12345678', type: { code: 'DNI' } }
  }
};

const makeUseCases = (overrides: Record<string, any> = {}) => {
  const authenticateUserUseCase = {
    execute: jest.fn().mockResolvedValue(authResult),
    ...overrides.authenticateUserUseCase
  };
  const roleSelectionUseCase = {
    execute: jest.fn().mockResolvedValue(roleResult),
    ...overrides.roleSelectionUseCase
  };
  const findByIdentificationUseCase = {
    execute: jest.fn().mockResolvedValue(naturalPersonResult),
    ...overrides.findByIdentificationUseCase
  };
  return { authenticateUserUseCase, roleSelectionUseCase, findByIdentificationUseCase };
};

describe('CustomerAccessFlowUseCase', () => {
  describe('with env vars configured', () => {
    let CustomerAccessFlowUseCase: any;

    beforeEach(() => {
      process.env.CUSTOMER_ACCESS_FLOW_LOGIN = 'flow-login';
      process.env.CUSTOMER_ACCESS_FLOW_PASSWORD = 'flow-password';
      jest.resetModules();
      CustomerAccessFlowUseCase =
        require('../../../../../src/app/application/usecases/customerAccessFlowUseCase').CustomerAccessFlowUseCase;
    });

    afterEach(() => {
      delete process.env.CUSTOMER_ACCESS_FLOW_LOGIN;
      delete process.env.CUSTOMER_ACCESS_FLOW_PASSWORD;
    });

    it('executes full flow and returns natural person data', async () => {
      const { authenticateUserUseCase, roleSelectionUseCase, findByIdentificationUseCase } =
        makeUseCases();

      const useCase = new CustomerAccessFlowUseCase(
        authenticateUserUseCase,
        roleSelectionUseCase,
        findByIdentificationUseCase
      );

      const result = await useCase.execute(validInput);

      expect(authenticateUserUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          request: { authentication: { login: 'flow-login', password: 'flow-password' } }
        })
      );
      expect(roleSelectionUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          request: expect.objectContaining({
            session: 'sess-abc',
            authentication: { login: 'flow-login' },
            subsidiary: { code: 1 },
            branch: { code: 2 },
            role: { code: 3 }
          })
        })
      );
      expect(findByIdentificationUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          identificationNumber: '12345678',
          identificationType: 'DNI',
          cobisHeaders: expect.objectContaining({ authorization: 'Bearer new-token' })
        })
      );
      expect(result).toBe(naturalPersonResult);
    });

    it('throws BadRequestException when identificationNumber is empty', async () => {
      const { authenticateUserUseCase, roleSelectionUseCase, findByIdentificationUseCase } =
        makeUseCases();
      const useCase = new CustomerAccessFlowUseCase(
        authenticateUserUseCase,
        roleSelectionUseCase,
        findByIdentificationUseCase
      );

      await expect(
        useCase.execute({ ...validInput, identificationNumber: '   ' })
      ).rejects.toMatchObject({ statusCode: 400, error: 'Bad Request' });

      await expect(
        useCase.execute({ ...validInput, identificationNumber: '' })
      ).rejects.toThrow('identification.number is required');
    });

    it('throws BadRequestException when identificationType is empty', async () => {
      const { authenticateUserUseCase, roleSelectionUseCase, findByIdentificationUseCase } =
        makeUseCases();
      const useCase = new CustomerAccessFlowUseCase(
        authenticateUserUseCase,
        roleSelectionUseCase,
        findByIdentificationUseCase
      );

      await expect(
        useCase.execute({ ...validInput, identificationType: '   ' })
      ).rejects.toMatchObject({ statusCode: 400, error: 'Bad Request' });
    });

    it('wraps authentication step error in ExternalServiceException(502)', async () => {
      const { roleSelectionUseCase, findByIdentificationUseCase } = makeUseCases();
      const authenticateUserUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('Auth failed'))
      };
      const useCase = new CustomerAccessFlowUseCase(
        authenticateUserUseCase,
        roleSelectionUseCase,
        findByIdentificationUseCase
      );

      await expect(useCase.execute(validInput)).rejects.toMatchObject<Partial<ExternalServiceException>>(
        {
          statusCode: 502,
          message: 'Customer access flow failed during authentication step'
        }
      );
    });

    it('throws ExternalServiceException when authentication response is not an object', async () => {
      const { roleSelectionUseCase, findByIdentificationUseCase } = makeUseCases();
      const authenticateUserUseCase = {
        execute: jest.fn().mockResolvedValue(null)
      };
      const useCase = new CustomerAccessFlowUseCase(
        authenticateUserUseCase,
        roleSelectionUseCase,
        findByIdentificationUseCase
      );

      await expect(useCase.execute(validInput)).rejects.toMatchObject<Partial<ExternalServiceException>>(
        { statusCode: 502 }
      );
    });

    it('throws ExternalServiceException when authentication response missing session', async () => {
      const { roleSelectionUseCase, findByIdentificationUseCase } = makeUseCases();
      const authenticateUserUseCase = {
        execute: jest.fn().mockResolvedValue({ data: { official: { subsidiaries: [{ code: 1 }], branches: [{ code: 2 }], roles: [{ code: 3 }] } } })
      };
      const useCase = new CustomerAccessFlowUseCase(
        authenticateUserUseCase,
        roleSelectionUseCase,
        findByIdentificationUseCase
      );

      await expect(useCase.execute(validInput)).rejects.toMatchObject<Partial<ExternalServiceException>>(
        { statusCode: 502, message: 'Authentication response did not include session' }
      );
    });

    it('throws ExternalServiceException when authentication response missing subsidiaries', async () => {
      const { roleSelectionUseCase, findByIdentificationUseCase } = makeUseCases();
      const authenticateUserUseCase = {
        execute: jest.fn().mockResolvedValue({ session: 'sess-abc', subsidiaries: [], branches: [], roles: [] })
      };
      const useCase = new CustomerAccessFlowUseCase(
        authenticateUserUseCase,
        roleSelectionUseCase,
        findByIdentificationUseCase
      );

      await expect(useCase.execute(validInput)).rejects.toMatchObject<Partial<ExternalServiceException>>(
        { statusCode: 502 }
      );
    });

    it('wraps role selection step error in ExternalServiceException(502)', async () => {
      const { authenticateUserUseCase, findByIdentificationUseCase } = makeUseCases();
      const roleSelectionUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('Role selection failed'))
      };
      const useCase = new CustomerAccessFlowUseCase(
        authenticateUserUseCase,
        roleSelectionUseCase,
        findByIdentificationUseCase
      );

      await expect(useCase.execute(validInput)).rejects.toMatchObject<Partial<ExternalServiceException>>(
        { statusCode: 502, message: 'Customer access flow failed during role selection step' }
      );
    });

    it('throws ExternalServiceException when role selection response missing authorization', async () => {
      const { authenticateUserUseCase, findByIdentificationUseCase } = makeUseCases();
      const roleSelectionUseCase = {
        execute: jest.fn().mockResolvedValue({ data: { authenticationResult: {} } })
      };
      const useCase = new CustomerAccessFlowUseCase(
        authenticateUserUseCase,
        roleSelectionUseCase,
        findByIdentificationUseCase
      );

      await expect(useCase.execute(validInput)).rejects.toMatchObject<Partial<ExternalServiceException>>(
        {
          statusCode: 502,
          message: 'Role selection response did not include authenticationResult.authorization'
        }
      );
    });

    it('wraps find by identification step error in ExternalServiceException(502)', async () => {
      const { authenticateUserUseCase, roleSelectionUseCase } = makeUseCases();
      const findByIdentificationUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('Customer lookup failed'))
      };
      const useCase = new CustomerAccessFlowUseCase(
        authenticateUserUseCase,
        roleSelectionUseCase,
        findByIdentificationUseCase
      );

      await expect(useCase.execute(validInput)).rejects.toMatchObject<Partial<ExternalServiceException>>(
        {
          statusCode: 502,
          message: 'Customer access flow failed during find by identification step'
        }
      );
    });

    it('normalizes authorization token without Bearer prefix', async () => {
      const { authenticateUserUseCase, roleSelectionUseCase, findByIdentificationUseCase } =
        makeUseCases({
          roleSelectionUseCase: {
            execute: jest.fn().mockResolvedValue({ authenticationResult: { authorization: 'raw-token' } })
          }
        });
      const useCase = new CustomerAccessFlowUseCase(
        authenticateUserUseCase,
        roleSelectionUseCase,
        findByIdentificationUseCase
      );

      await useCase.execute(validInput);

      expect(findByIdentificationUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          cobisHeaders: expect.objectContaining({ authorization: 'Bearer raw-token' })
        })
      );
    });

    it('handles authentication response with flat session field', async () => {
      const { roleSelectionUseCase, findByIdentificationUseCase } = makeUseCases();
      const authenticateUserUseCase = {
        execute: jest.fn().mockResolvedValue({
          session: 'flat-session',
          subsidiaries: [{ code: 10 }],
          branches: [{ code: 20 }],
          roles: [{ code: 30 }]
        })
      };
      const useCase = new CustomerAccessFlowUseCase(
        authenticateUserUseCase,
        roleSelectionUseCase,
        findByIdentificationUseCase
      );

      await useCase.execute(validInput);

      expect(roleSelectionUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          request: expect.objectContaining({ session: 'flat-session', subsidiary: { code: 10 } })
        })
      );
    });
  });

  describe('with missing env vars', () => {
    let CustomerAccessFlowUseCase: any;

    beforeEach(() => {
      delete process.env.CUSTOMER_ACCESS_FLOW_LOGIN;
      delete process.env.CUSTOMER_ACCESS_FLOW_PASSWORD;
      jest.resetModules();
      CustomerAccessFlowUseCase =
        require('../../../../../src/app/application/usecases/customerAccessFlowUseCase').CustomerAccessFlowUseCase;
    });

    it('throws ExternalServiceException when CUSTOMER_ACCESS_FLOW_LOGIN is not set', async () => {
      const useCase = new CustomerAccessFlowUseCase(
        { execute: jest.fn() },
        { execute: jest.fn() },
        { execute: jest.fn() }
      );

      await expect(useCase.execute(validInput)).rejects.toMatchObject<Partial<ExternalServiceException>>(
        { statusCode: 500, message: 'CUSTOMER_ACCESS_FLOW_LOGIN is not configured' }
      );
    });

    it('throws ExternalServiceException when CUSTOMER_ACCESS_FLOW_PASSWORD is not set', async () => {
      process.env.CUSTOMER_ACCESS_FLOW_LOGIN = 'some-login';
      jest.resetModules();
      CustomerAccessFlowUseCase =
        require('../../../../../src/app/application/usecases/customerAccessFlowUseCase').CustomerAccessFlowUseCase;

      const useCase = new CustomerAccessFlowUseCase(
        { execute: jest.fn() },
        { execute: jest.fn() },
        { execute: jest.fn() }
      );

      await expect(useCase.execute(validInput)).rejects.toMatchObject<Partial<ExternalServiceException>>(
        { statusCode: 500, message: 'CUSTOMER_ACCESS_FLOW_PASSWORD is not configured' }
      );

      delete process.env.CUSTOMER_ACCESS_FLOW_LOGIN;
    });
  });
});
