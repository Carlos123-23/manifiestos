import 'reflect-metadata';
import { FindByIdentificationUseCase } from '../../../../../src/app/application/usecases/findByIdentificationUseCase';
import { InvalidIdentificationException } from '../../../../../src/app/application/exceptions/InvalidIdentification.exception';
import { CustomerNotFoundException } from '../../../../../src/app/application/exceptions/CustomerNotFound.exception';
import { ExternalServiceException } from '../../../../../src/app/application/exceptions/ExternalService.exception';

describe('FindByIdentificationUseCase', () => {
  const cobisHeaders = {
    authorization: 'Bearer token',
    requestId: 'request-1',
    endUserLogin: 'userA',
    endUserRequestDateTime: '2026-01-01T00:00:00.000Z',
    endUserTerminal: 'api',
    endUserLastLoggedDateTime: '2026-01-01T00:00:00.000Z'
  };

  it('normalizes input and delegates to repository', async () => {
    const repository = {
      findByIdentification: jest.fn().mockResolvedValue({
        naturalPerson: {
          identification: {
            number: '12345678',
            type: { code: 'DNI' }
          }
        }
      })
    };

    const useCase = new FindByIdentificationUseCase(repository as any);

    await useCase.execute({
      identificationNumber: ' 12345678 ',
      identificationType: ' dni ',
      cobisHeaders
    });

    expect(repository.findByIdentification).toHaveBeenCalledWith('12345678', 'DNI', cobisHeaders);
  });

  it('throws InvalidIdentificationException when identification number is empty', async () => {
    const repository = {
      findByIdentification: jest.fn()
    };

    const useCase = new FindByIdentificationUseCase(repository as any);

    await expect(
      useCase.execute({
        identificationNumber: '   ',
        identificationType: 'DNI',
        cobisHeaders
      })
    ).rejects.toBeInstanceOf(InvalidIdentificationException);
  });

  it('throws InvalidIdentificationException when identification type is empty', async () => {
    const repository = {
      findByIdentification: jest.fn()
    };

    const useCase = new FindByIdentificationUseCase(repository as any);

    await expect(
      useCase.execute({
        identificationNumber: '12345678',
        identificationType: '   ',
        cobisHeaders
      })
    ).rejects.toBeInstanceOf(InvalidIdentificationException);
  });

  it('maps customer not found error from repository', async () => {
    const repository = {
      findByIdentification: jest.fn().mockRejectedValue(new Error('Customer not found: 12345678'))
    };

    const useCase = new FindByIdentificationUseCase(repository as any);

    await expect(
      useCase.execute({
        identificationNumber: '12345678',
        identificationType: 'DNI',
        cobisHeaders
      })
    ).rejects.toBeInstanceOf(CustomerNotFoundException);
  });

  it('maps configuration errors to ExternalServiceException with status 500', async () => {
    const repository = {
      findByIdentification: jest.fn().mockRejectedValue(
        new Error('COBIS_NATURAL_PERSONS_URL is not configured')
      )
    };

    const useCase = new FindByIdentificationUseCase(repository as any);

    await expect(
      useCase.execute({
        identificationNumber: '12345678',
        identificationType: 'DNI',
        cobisHeaders
      })
    ).rejects.toMatchObject<Partial<ExternalServiceException>>({
      statusCode: 500
    });
  });

  it('maps status errors to ExternalServiceException with status 502', async () => {
    const repository = {
      findByIdentification: jest.fn().mockRejectedValue(
        new Error('Cobis service responded with status 503')
      )
    };

    const useCase = new FindByIdentificationUseCase(repository as any);

    await expect(
      useCase.execute({
        identificationNumber: '12345678',
        identificationType: 'DNI',
        cobisHeaders
      })
    ).rejects.toMatchObject<Partial<ExternalServiceException>>({
      statusCode: 502
    });
  });

  it('maps connectivity errors to ExternalServiceException with status 502', async () => {
    const repository = {
      findByIdentification: jest.fn().mockRejectedValue(new Error('fetch failed'))
    };

    const useCase = new FindByIdentificationUseCase(repository as any);

    await expect(
      useCase.execute({
        identificationNumber: '12345678',
        identificationType: 'DNI',
        cobisHeaders
      })
    ).rejects.toMatchObject<Partial<ExternalServiceException>>({
      statusCode: 502
    });
  });

  it('maps unknown errors to ExternalServiceException with status 500', async () => {
    const repository = {
      findByIdentification: jest.fn().mockRejectedValue(new Error('unknown failure'))
    };

    const useCase = new FindByIdentificationUseCase(repository as any);

    await expect(
      useCase.execute({
        identificationNumber: '12345678',
        identificationType: 'DNI',
        cobisHeaders
      })
    ).rejects.toMatchObject<Partial<ExternalServiceException>>({
      statusCode: 500
    });
  });
});
