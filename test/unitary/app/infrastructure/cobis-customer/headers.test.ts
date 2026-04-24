import { CobisHeadersBuilder } from '../../../../../src/app/infrastructure/cobis-customer/headers';

jest.mock('../../../../../src/config/cobis.config', () => ({
  cobisConfig: {
    baseUrl: 'http://cobis.example.com',
    apiKey: 'default-api-key',
    paths: {
      authentication: '/api/authentication',
      roleSelection: '/api/authentication/role-selection',
      naturalPerson: '/api/natural-person/find-by-identification'
    }
  }
}));

describe('CobisHeadersBuilder', () => {
  const cobisHeaders = {
    authorization: 'Bearer token',
    requestId: 'request-1',
    endUserLogin: 'userA',
    endUserRequestDateTime: '2026-01-01T00:00:00.000Z',
    endUserTerminal: 'api',
    endUserLastLoggedDateTime: '2026-01-01T00:00:00.000Z',
    apiKey: 'custom-api-key'
  };

  describe('buildAuthenticationHeaders()', () => {
    it('returns required authentication headers', () => {
      const headers = CobisHeadersBuilder.buildAuthenticationHeaders(cobisHeaders as any);

      expect(headers['x-api-key']).toBe('custom-api-key');
      expect(headers['x-request-id']).toBe('request-1');
      expect(headers['x-end-user-login']).toBe('userA');
      expect(headers['x-end-user-request-date-time']).toBe('2026-01-01T00:00:00.000Z');
      expect(headers['x-end-user-terminal']).toBe('api');
      expect(headers['content-type']).toBe('application/json');
    });

    it('uses default api key from config when apiKey is not provided', () => {
      const headersWithoutApiKey = { ...cobisHeaders, apiKey: undefined };
      const headers = CobisHeadersBuilder.buildAuthenticationHeaders(headersWithoutApiKey as any);

      expect(headers['x-api-key']).toBe('default-api-key');
    });

    it('generates a requestId when not provided', () => {
      const headersWithoutRequestId = { ...cobisHeaders, requestId: undefined };
      const headers = CobisHeadersBuilder.buildAuthenticationHeaders(headersWithoutRequestId as any);

      expect(headers['x-request-id']).toBeDefined();
      expect(typeof headers['x-request-id']).toBe('string');
      expect(headers['x-request-id'].length).toBeGreaterThan(0);
    });

    it('uses current datetime when endUserRequestDateTime is not provided', () => {
      const headersWithoutDate = { ...cobisHeaders, requestId: 'r1', endUserRequestDateTime: undefined };
      const before = new Date().toISOString();
      const headers = CobisHeadersBuilder.buildAuthenticationHeaders(headersWithoutDate as any);
      const after = new Date().toISOString();

      expect(headers['x-end-user-request-date-time'] >= before).toBe(true);
      expect(headers['x-end-user-request-date-time'] <= after).toBe(true);
    });
  });

  describe('buildNaturalPersonHeaders()', () => {
    it('returns required natural person headers', () => {
      const headers = CobisHeadersBuilder.buildNaturalPersonHeaders(cobisHeaders as any);

      expect(headers['x-api-key']).toBe('custom-api-key');
      expect(headers['x-request-id']).toBe('request-1');
      expect(headers['x-end-user-login']).toBe('userA');
      expect(headers['x-end-user-terminal']).toBe('api');
      expect(headers['x-end-user-last-logged-date-time']).toBe('2026-01-01T00:00:00.000Z');
      expect(headers['content-type']).toBe('application/json');
      expect(headers['Authorization']).toBe('Bearer token');
    });

    it('includes optional x-reverse header when provided', () => {
      const headersWithReverse = { ...cobisHeaders, reverse: 'true' };
      const headers = CobisHeadersBuilder.buildNaturalPersonHeaders(headersWithReverse as any);

      expect(headers['x-reverse']).toBe('true');
    });

    it('excludes x-reverse when not provided', () => {
      const headers = CobisHeadersBuilder.buildNaturalPersonHeaders(cobisHeaders as any);

      expect(headers['x-reverse']).toBeUndefined();
    });

    it('includes optional x-requestId-to-reverse header when provided', () => {
      const headersWithReverse = { ...cobisHeaders, requestIdToReverse: 'original-id' };
      const headers = CobisHeadersBuilder.buildNaturalPersonHeaders(headersWithReverse as any);

      expect(headers['x-requestId-to-reverse']).toBe('original-id');
    });

    it('includes optional Accept-Language header when provided', () => {
      const headersWithLang = { ...cobisHeaders, acceptLanguage: 'es-EC' };
      const headers = CobisHeadersBuilder.buildNaturalPersonHeaders(headersWithLang as any);

      expect(headers['Accept-Language']).toBe('es-EC');
    });

    it('excludes Authorization when not provided', () => {
      const headersWithoutAuth = { ...cobisHeaders, authorization: undefined };
      const headers = CobisHeadersBuilder.buildNaturalPersonHeaders(headersWithoutAuth as any);

      expect(headers['Authorization']).toBeUndefined();
    });
  });

  describe('buildRoleSelectionHeaders()', () => {
    it('returns required role selection headers', () => {
      const headers = CobisHeadersBuilder.buildRoleSelectionHeaders(cobisHeaders as any);

      expect(headers['x-api-key']).toBe('custom-api-key');
      expect(headers['x-request-id']).toBe('request-1');
      expect(headers['x-end-user-login']).toBe('userA');
      expect(headers['x-end-user-terminal']).toBe('api');
      expect(headers['x-end-user-last-logged-date-time']).toBe('2026-01-01T00:00:00.000Z');
      expect(headers['content-type']).toBe('application/json');
    });

    it('generates requestId when not provided', () => {
      const headersWithoutRequestId = { ...cobisHeaders, requestId: undefined };
      const headers = CobisHeadersBuilder.buildRoleSelectionHeaders(headersWithoutRequestId as any);

      expect(headers['x-request-id']).toBeDefined();
    });
  });
});
