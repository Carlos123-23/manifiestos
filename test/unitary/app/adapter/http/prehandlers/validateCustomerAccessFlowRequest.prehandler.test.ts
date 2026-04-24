import { validateCustomerAccessFlowRequestPreHandler } from '../../../../../../src/app/adapter/http/prehandlers/validateCustomerAccessFlowRequest.prehandler';
import { BadRequestException } from '../../../../../../src/app/application/exceptions/BadRequest.exception';

describe('validateCustomerAccessFlowRequestPreHandler', () => {
  it('maps and validates payload using identification root format', async () => {
    const request = {
      body: {
        identification: {
          number: '43256792',
          type: 'DNI'
        }
      }
    } as any;

    await validateCustomerAccessFlowRequestPreHandler(request, {} as any);

    expect(request.customerAccessFlowRequest).toEqual({
      identificationNumber: '43256792',
      identificationType: 'DNI'
    });
  });

  it('maps and validates payload using naturalPerson nested format', async () => {
    const request = {
      body: {
        naturalPerson: {
          identification: {
            number: '99887766',
            type: { code: 'CE' }
          }
        }
      }
    } as any;

    await validateCustomerAccessFlowRequestPreHandler(request, {} as any);

    expect(request.customerAccessFlowRequest).toEqual({
      identificationNumber: '99887766',
      identificationType: 'CE'
    });
  });

  it('trims whitespace from identification values', async () => {
    const request = {
      body: {
        identification: {
          number: '  43256792  ',
          type: '  DNI  '
        }
      }
    } as any;

    await validateCustomerAccessFlowRequestPreHandler(request, {} as any);

    expect(request.customerAccessFlowRequest.identificationNumber).toBe('43256792');
    expect(request.customerAccessFlowRequest.identificationType).toBe('DNI');
  });

  it('throws BadRequestException when identification number is missing', async () => {
    const request = {
      body: {
        identification: {
          number: '',
          type: 'DNI'
        }
      }
    } as any;

    await expect(
      validateCustomerAccessFlowRequestPreHandler(request, {} as any)
    ).rejects.toBeInstanceOf(BadRequestException);

    await expect(
      validateCustomerAccessFlowRequestPreHandler(request, {} as any)
    ).rejects.toThrow('identification.number is required');
  });

  it('throws BadRequestException when identification type is missing', async () => {
    const request = {
      body: {
        identification: {
          number: '43256792',
          type: ''
        }
      }
    } as any;

    await expect(
      validateCustomerAccessFlowRequestPreHandler(request, {} as any)
    ).rejects.toBeInstanceOf(BadRequestException);

    await expect(
      validateCustomerAccessFlowRequestPreHandler(request, {} as any)
    ).rejects.toThrow('identification.type is required');
  });

  it('throws BadRequestException when body is not an object', async () => {
    const request = {
      body: null
    } as any;

    await expect(
      validateCustomerAccessFlowRequestPreHandler(request, {} as any)
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws BadRequestException when identification is missing entirely', async () => {
    const request = {
      body: {}
    } as any;

    await expect(
      validateCustomerAccessFlowRequestPreHandler(request, {} as any)
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('handles type as object with code field', async () => {
    const request = {
      body: {
        identification: {
          number: '12345678',
          type: { code: 'PP' }
        }
      }
    } as any;

    await validateCustomerAccessFlowRequestPreHandler(request, {} as any);

    expect(request.customerAccessFlowRequest.identificationType).toBe('PP');
  });

  it('throws when type is an object without string code', async () => {
    const request = {
      body: {
        identification: {
          number: '12345678',
          type: { code: 123 }
        }
      }
    } as any;

    await expect(
      validateCustomerAccessFlowRequestPreHandler(request, {} as any)
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
