import { BadRequestException } from '../../../../../src/app/application/exceptions/BadRequest.exception';
import { InvalidIdentificationException } from '../../../../../src/app/application/exceptions/InvalidIdentification.exception';
import { CustomerNotFoundException } from '../../../../../src/app/application/exceptions/CustomerNotFound.exception';
import { ExternalServiceException } from '../../../../../src/app/application/exceptions/ExternalService.exception';
import { CobisException } from '../../../../../src/app/application/exceptions/CobisException';
import { CobisAuthenticationError } from '../../../../../src/app/application/exceptions/CobisAuthenticationError';
import { CobisForbiddenError } from '../../../../../src/app/application/exceptions/CobisForbiddenError';
import { CobisProviderError } from '../../../../../src/app/application/exceptions/CobisProviderError';

describe('Exception Classes', () => {
  describe('BadRequestException', () => {
    it('has statusCode 400 and error "Bad Request"', () => {
      const ex = new BadRequestException('test error');
      expect(ex.message).toBe('test error');
      expect(ex.statusCode).toBe(400);
      expect(ex.error).toBe('Bad Request');
      expect(ex.name).toBe('BadRequestException');
      expect(ex).toBeInstanceOf(Error);
    });

    it('accepts optional detail', () => {
      const detail = { field: 'login' };
      const ex = new BadRequestException('test', detail);
      expect(ex.detail).toEqual(detail);
    });
  });

  describe('InvalidIdentificationException', () => {
    it('has statusCode 400 and error "Bad Request"', () => {
      const ex = new InvalidIdentificationException('invalid id');
      expect(ex.message).toBe('invalid id');
      expect(ex.statusCode).toBe(400);
      expect(ex.error).toBe('Bad Request');
      expect(ex.name).toBe('InvalidIdentificationException');
      expect(ex).toBeInstanceOf(Error);
    });
  });

  describe('CustomerNotFoundException', () => {
    it('has statusCode 404 and error "Not Found"', () => {
      const ex = new CustomerNotFoundException('12345678', 'DNI');
      expect(ex.message).toContain('12345678');
      expect(ex.message).toContain('DNI');
      expect(ex.statusCode).toBe(404);
      expect(ex.error).toBe('Not Found');
      expect(ex.name).toBe('CustomerNotFoundException');
      expect(ex).toBeInstanceOf(Error);
    });
  });

  describe('ExternalServiceException', () => {
    it('has default statusCode 502 and error "Bad Gateway"', () => {
      const ex = new ExternalServiceException('external error');
      expect(ex.message).toBe('external error');
      expect(ex.statusCode).toBe(502);
      expect(ex.error).toBe('Bad Gateway');
      expect(ex.name).toBe('ExternalServiceException');
      expect(ex).toBeInstanceOf(Error);
    });

    it('accepts custom statusCode >= 500 → error "Bad Gateway"', () => {
      const ex = new ExternalServiceException('server error', 500);
      expect(ex.statusCode).toBe(500);
      expect(ex.error).toBe('Bad Gateway');
    });

    it('uses "External Service Error" for status codes < 500', () => {
      const ex = new ExternalServiceException('client error', 401);
      expect(ex.statusCode).toBe(401);
      expect(ex.error).toBe('External Service Error');
    });

    it('stores externalError', () => {
      const cause = new Error('cause');
      const ex = new ExternalServiceException('error', 502, cause);
      expect(ex.externalError).toBe(cause);
    });
  });

  describe('CobisException', () => {
    it('has default statusCode 500 and error "Internal Server Error"', () => {
      const ex = new CobisException('cobis error');
      expect(ex.message).toBe('cobis error');
      expect(ex.statusCode).toBe(500);
      expect(ex.error).toBe('Internal Server Error');
      expect(ex.name).toBe('CobisException');
      expect(ex).toBeInstanceOf(Error);
    });

    it('accepts custom statusCode, error, and detail', () => {
      const detail = { code: 'ERR001' };
      const ex = new CobisException('custom error', 400, 'Bad Request', detail);
      expect(ex.statusCode).toBe(400);
      expect(ex.error).toBe('Bad Request');
      expect(ex.detail).toEqual(detail);
    });

    it('maintains prototype chain for instanceof checks', () => {
      const ex = new CobisException('test');
      expect(ex instanceof CobisException).toBe(true);
      expect(ex instanceof Error).toBe(true);
    });
  });

  describe('CobisAuthenticationError', () => {
    it('has statusCode 401 and error "Unauthorized"', () => {
      const ex = new CobisAuthenticationError();
      expect(ex.statusCode).toBe(401);
      expect(ex.error).toBe('Unauthorized');
      expect(ex.name).toBe('CobisAuthenticationError');
      expect(ex).toBeInstanceOf(CobisException);
    });

    it('accepts custom message and detail', () => {
      const detail = new Error('cause');
      const ex = new CobisAuthenticationError('custom auth error', detail);
      expect(ex.message).toBe('custom auth error');
      expect(ex.detail).toBe(detail);
    });

    it('uses default message when none provided', () => {
      const ex = new CobisAuthenticationError();
      expect(ex.message).toBe('Authentication failed');
    });

    it('maintains prototype chain', () => {
      const ex = new CobisAuthenticationError();
      expect(ex instanceof CobisAuthenticationError).toBe(true);
      expect(ex instanceof CobisException).toBe(true);
    });
  });

  describe('CobisForbiddenError', () => {
    it('has statusCode 403 and error "Forbidden"', () => {
      const ex = new CobisForbiddenError();
      expect(ex.statusCode).toBe(403);
      expect(ex.error).toBe('Forbidden');
      expect(ex.name).toBe('CobisForbiddenError');
      expect(ex).toBeInstanceOf(CobisException);
    });

    it('accepts custom message', () => {
      const ex = new CobisForbiddenError('access denied');
      expect(ex.message).toBe('access denied');
    });

    it('uses default message when none provided', () => {
      const ex = new CobisForbiddenError();
      expect(ex.message).toBe('Access forbidden');
    });

    it('maintains prototype chain', () => {
      const ex = new CobisForbiddenError();
      expect(ex instanceof CobisForbiddenError).toBe(true);
      expect(ex instanceof CobisException).toBe(true);
    });
  });

  describe('CobisProviderError', () => {
    it('has default statusCode 502 and error "Bad Gateway"', () => {
      const ex = new CobisProviderError();
      expect(ex.statusCode).toBe(502);
      expect(ex.error).toBe('Bad Gateway');
      expect(ex.name).toBe('CobisProviderError');
      expect(ex).toBeInstanceOf(CobisException);
    });

    it('accepts custom message, statusCode, and externalError', () => {
      const cause = new Error('external cause');
      const ex = new CobisProviderError('provider failure', 503, cause);
      expect(ex.message).toBe('provider failure');
      expect(ex.statusCode).toBe(503);
      expect(ex.externalError).toBe(cause);
    });

    it('uses "External Service Error" for non-5xx status codes', () => {
      const ex = new CobisProviderError('client error', 400);
      expect(ex.error).toBe('External Service Error');
    });

    it('maintains prototype chain', () => {
      const ex = new CobisProviderError();
      expect(ex instanceof CobisProviderError).toBe(true);
      expect(ex instanceof CobisException).toBe(true);
    });
  });
});
