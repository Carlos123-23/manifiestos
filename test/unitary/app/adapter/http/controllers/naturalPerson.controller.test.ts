import 'reflect-metadata';
import { NaturalPersonController } from '../../../../../../src/app/adapter/http/controllers/naturalPerson.controller';
import { BadRequestException } from '../../../../../../src/app/application/exceptions/BadRequest.exception';

describe('NaturalPersonController', () => {
  const mockFindByIdentificationResult = {
    naturalPerson: {
      identification: { number: '12345678', type: { code: 'DNI' } }
    }
  };

  it('delegates to use case when findByIdentificationInput is present', async () => {
    const useCase = {
      execute: jest.fn().mockResolvedValue(mockFindByIdentificationResult)
    };
    const controller = new NaturalPersonController(useCase as any);

    const req = {
      findByIdentificationInput: {
        identificationNumber: '12345678',
        identificationType: 'DNI',
        cobisHeaders: { authorization: 'Bearer token', requestId: 'r1', endUserLogin: 'user', endUserRequestDateTime: '', endUserTerminal: 'api', endUserLastLoggedDateTime: '' }
      }
    } as any;

    const result = await controller.findByIdentification(req);

    expect(useCase.execute).toHaveBeenCalledWith(req.findByIdentificationInput);
    expect(result).toBe(mockFindByIdentificationResult);
  });

  it('throws BadRequestException when findByIdentificationInput is missing', async () => {
    const useCase = { execute: jest.fn() };
    const controller = new NaturalPersonController(useCase as any);

    const req = {} as any;

    await expect(controller.findByIdentification(req)).rejects.toBeInstanceOf(BadRequestException);
    await expect(controller.findByIdentification(req)).rejects.toThrow('Mapped request is missing');
  });
});
