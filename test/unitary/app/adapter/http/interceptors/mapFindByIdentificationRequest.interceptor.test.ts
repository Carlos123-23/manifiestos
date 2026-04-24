import { mapFindByIdentificationRequestInterceptor } from '../../../../../../src/app/adapter/http/interceptors/mapFindByIdentificationRequest.interceptor';
import { BadRequestException } from '../../../../../../src/app/application/exceptions/BadRequest.exception';

describe('mapFindByIdentificationRequestInterceptor', () => {
  it('maps validated request and cobis headers to use case input', async () => {
    const request = {
      findByIdentificationRequest: {
        identificationNumber: '12345678',
        identificationType: 'DNI'
      },
      cobisHeaders: {
        authorization: 'Bearer abc',
        endUserLogin: 'userA',
        requestId: 'request-1',
        endUserRequestDateTime: '2026-01-01T00:00:00.000Z',
        endUserTerminal: 'api',
        endUserLastLoggedDateTime: '2026-01-01T00:00:00.000Z'
      }
    } as any;

    await mapFindByIdentificationRequestInterceptor(request);

    expect(request.findByIdentificationInput).toEqual({
      identificationNumber: '12345678',
      identificationType: 'DNI',
      cobisHeaders: request.cobisHeaders
    });
  });

  it('throws BadRequestException when mapped identification is missing', async () => {
    const request = {
      cobisHeaders: {
        authorization: 'Bearer abc',
        endUserLogin: 'userA'
      }
    } as any;

    await expect(mapFindByIdentificationRequestInterceptor(request)).rejects.toBeInstanceOf(
      BadRequestException
    );
    await expect(mapFindByIdentificationRequestInterceptor(request)).rejects.toThrow(
      'Invalid request payload'
    );
  });

  it('throws BadRequestException when cobis headers are missing', async () => {
    const request = {
      findByIdentificationRequest: {
        identificationNumber: '12345678',
        identificationType: 'DNI'
      }
    } as any;

    await expect(mapFindByIdentificationRequestInterceptor(request)).rejects.toBeInstanceOf(
      BadRequestException
    );
    await expect(mapFindByIdentificationRequestInterceptor(request)).rejects.toThrow(
      'Required Cobis headers are missing'
    );
  });
});
