import { CobisErrorMapper } from '../../../../../src/app/application/exceptions/CobisErrorMapper';
import { CobisException } from '../../../../../src/app/application/exceptions/CobisException';
import { CobisAuthenticationError } from '../../../../../src/app/application/exceptions/CobisAuthenticationError';
import { CobisForbiddenError } from '../../../../../src/app/application/exceptions/CobisForbiddenError';
import { CobisProviderError } from '../../../../../src/app/application/exceptions/CobisProviderError';

describe('CobisErrorMapper', () => {
  describe('mapError()', () => {
    it('returns a CobisException as-is when already a CobisException', () => {
      const cobisEx = new CobisException('existing', 400, 'Bad Request');
      const result = CobisErrorMapper.mapError(cobisEx);
      expect(result).toBe(cobisEx);
    });

    it('returns CobisAuthenticationError subclass as-is', () => {
      const authError = new CobisAuthenticationError('auth failed');
      const result = CobisErrorMapper.mapError(authError);
      expect(result).toBe(authError);
    });

    it('maps "authentication" message to CobisAuthenticationError', () => {
      const result = CobisErrorMapper.mapError(new Error('authentication failed'));
      expect(result).toBeInstanceOf(CobisAuthenticationError);
      expect(result.statusCode).toBe(401);
    });

    it('maps "unauthorized" message to CobisAuthenticationError', () => {
      const result = CobisErrorMapper.mapError(new Error('Unauthorized access'));
      expect(result).toBeInstanceOf(CobisAuthenticationError);
    });

    it('maps "invalid credentials" message to CobisAuthenticationError', () => {
      const result = CobisErrorMapper.mapError(new Error('Invalid credentials provided'));
      expect(result).toBeInstanceOf(CobisAuthenticationError);
    });

    it('maps "forbidden" message to CobisForbiddenError', () => {
      const result = CobisErrorMapper.mapError(new Error('Forbidden resource'));
      expect(result).toBeInstanceOf(CobisForbiddenError);
      expect(result.statusCode).toBe(403);
    });

    it('maps "permission denied" message to CobisForbiddenError', () => {
      const result = CobisErrorMapper.mapError(new Error('Permission denied'));
      expect(result).toBeInstanceOf(CobisForbiddenError);
    });

    it('maps "access denied" message to CobisForbiddenError', () => {
      const result = CobisErrorMapper.mapError(new Error('Access denied'));
      expect(result).toBeInstanceOf(CobisForbiddenError);
    });

    it('maps "provider" message to CobisProviderError', () => {
      const result = CobisErrorMapper.mapError(new Error('provider error occurred'));
      expect(result).toBeInstanceOf(CobisProviderError);
      expect(result.statusCode).toBe(502);
    });

    it('maps "external" message to CobisProviderError', () => {
      const result = CobisErrorMapper.mapError(new Error('external service failed'));
      expect(result).toBeInstanceOf(CobisProviderError);
    });

    it('maps "service unavailable" message to CobisProviderError', () => {
      const result = CobisErrorMapper.mapError(new Error('service unavailable'));
      expect(result).toBeInstanceOf(CobisProviderError);
    });

    it('maps unknown error to CobisException with statusCode 500', () => {
      const result = CobisErrorMapper.mapError(new Error('something unexpected'));
      expect(result).toBeInstanceOf(CobisException);
      expect(result.statusCode).toBe(500);
    });

    it('handles non-Error (string) values', () => {
      const result = CobisErrorMapper.mapError('string error');
      expect(result).toBeInstanceOf(CobisException);
      expect(result.message).toBe('string error');
    });

    it('uses fallback message for empty string error', () => {
      const result = CobisErrorMapper.mapError('');
      expect(result).toBeInstanceOf(CobisException);
      expect(result.message).toBe('An unexpected error occurred');
    });

    it('accepts optional context parameter without error', () => {
      const result = CobisErrorMapper.mapError(new Error('some error'), 'context info');
      expect(result).toBeInstanceOf(CobisException);
    });
  });

  describe('toErrorResponse()', () => {
    it('converts a CobisException to error response format', () => {
      const ex = new CobisException('test error', 400, 'Bad Request');
      const response = CobisErrorMapper.toErrorResponse(ex);

      expect(response).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: 'test error'
      });
    });

    it('includes detail when present', () => {
      const detail = { field: 'login', reason: 'required' };
      const ex = new CobisException('test error', 400, 'Bad Request', detail);
      const response = CobisErrorMapper.toErrorResponse(ex);

      expect(response.detail).toEqual(detail);
    });

    it('excludes detail when not present', () => {
      const ex = new CobisException('test error', 500);
      const response = CobisErrorMapper.toErrorResponse(ex);

      expect('detail' in response).toBe(false);
    });

    it('converts CobisAuthenticationError correctly', () => {
      const ex = new CobisAuthenticationError('invalid token');
      const response = CobisErrorMapper.toErrorResponse(ex);

      expect(response.statusCode).toBe(401);
      expect(response.error).toBe('Unauthorized');
      expect(response.message).toBe('invalid token');
    });

    it('converts CobisForbiddenError correctly', () => {
      const ex = new CobisForbiddenError('no access');
      const response = CobisErrorMapper.toErrorResponse(ex);

      expect(response.statusCode).toBe(403);
      expect(response.error).toBe('Forbidden');
    });

    it('converts CobisProviderError correctly', () => {
      const ex = new CobisProviderError('provider down', 502);
      const response = CobisErrorMapper.toErrorResponse(ex);

      expect(response.statusCode).toBe(502);
      expect(response.error).toBe('Bad Gateway');
    });
  });
});
