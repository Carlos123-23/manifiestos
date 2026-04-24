import { validateFindByIdentificationRequestPreHandler } from '../../../../../../src/app/adapter/http/prehandlers/validateFindByIdentificationRequest.prehandler';
import { BadRequestException } from '../../../../../../src/app/application/exceptions/BadRequest.exception';

describe('validateFindByIdentificationRequestPreHandler', () => {
  it('maps and validates payload using identification root format', async () => {
    const request = {
      body: {
        identification: {
          number: '43256792',
          type: 'dni'
        }
      }
    } as any;

    await validateFindByIdentificationRequestPreHandler(request, {} as any);

    expect(request.findByIdentificationRequest).toEqual({
      identificationNumber: '43256792',
      identificationType: 'dni'
    });
  });

  it('maps and validates payload using naturalPerson nested format', async () => {
    const request = {
      body: {
        naturalPerson: {
          identification: {
            number: '99887766',
            type: { code: 'ce' }
          }
        }
      }
    } as any;

    await validateFindByIdentificationRequestPreHandler(request, {} as any);

    expect(request.findByIdentificationRequest).toEqual({
      identificationNumber: '99887766',
      identificationType: 'ce'
    });
  });

  it('throws BadRequestException when payload is invalid', async () => {
    const request = {
      body: {
        identification: {
          number: ''
        }
      }
    } as any;

    await expect(
      validateFindByIdentificationRequestPreHandler(request, {} as any)
    ).rejects.toBeInstanceOf(BadRequestException);

    await expect(
      validateFindByIdentificationRequestPreHandler(request, {} as any)
    ).rejects.toThrow('Invalid request payload');
  });
});
