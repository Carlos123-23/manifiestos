import 'reflect-metadata';
import { CobisAuthenticator } from '../../../../../src/app/infrastructure/cobis-customer/authenticator';
import { CobisHttpClient } from '../../../../../src/app/infrastructure/cobis-customer/http-client';
import { CobisHeadersBuilder } from '../../../../../src/app/infrastructure/cobis-customer/headers';
import { CobisCustomerConstants } from '../../../../../src/app/infrastructure/cobis-customer/constants';

jest.mock('../../../../../src/app/infrastructure/cobis-customer/http-client');
jest.mock('../../../../../src/app/infrastructure/cobis-customer/headers');
jest.mock('../../../../../src/app/infrastructure/cobis-customer/constants', () => ({
  CobisCustomerConstants: {
    BASE_URL: 'http://cobis.example.com',
    AUTHENTICATION_PATH: '/api/authentication',
    NATURAL_PERSON_PATH: '/api/natural-person/find-by-identification',
    ROLE_SELECTION_PATH: '/api/authentication/role-selection',
    DEFAULT_API_KEY: 'test-api-key',
    NATURAL_PERSONS_URL: 'http://cobis.example.com/api/natural-person/find-by-identification'
  }
}));

const mockPost = CobisHttpClient.post as jest.MockedFunction<typeof CobisHttpClient.post>;
const mockBuildAuthHeaders = CobisHeadersBuilder.buildAuthenticationHeaders as jest.MockedFunction<
  typeof CobisHeadersBuilder.buildAuthenticationHeaders
>;

describe('CobisAuthenticator', () => {
  const cobisHeaders = {
    authorization: 'Bearer token',
    requestId: 'r1',
    endUserLogin: 'userA',
    endUserRequestDateTime: '2026-01-01T00:00:00.000Z',
    endUserTerminal: 'api',
    endUserLastLoggedDateTime: '2026-01-01T00:00:00.000Z'
  };

  const request = {
    authentication: {
      login: 'user123',
      password: 'pass456'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockBuildAuthHeaders.mockReturnValue({ 'x-api-key': 'key', 'x-request-id': 'r1' });
    mockPost.mockResolvedValue({ token: 'abc123' });
  });

  it('builds URL from constants and calls CobisHttpClient.post with correct params', async () => {
    const authenticator = new CobisAuthenticator();

    const result = await authenticator.authenticate(request as any, cobisHeaders as any);

    expect(mockBuildAuthHeaders).toHaveBeenCalledWith(cobisHeaders);
    expect(mockPost).toHaveBeenCalledWith(
      'http://cobis.example.com/api/authentication',
      { 'x-api-key': 'key', 'x-request-id': 'r1' },
      { authentication: { login: 'user123', password: 'pass456' } },
      'CobisAuthenticator'
    );
    expect(result).toEqual({ token: 'abc123' });
  });

  it('propagates errors from CobisHttpClient.post', async () => {
    mockPost.mockRejectedValue(new Error('Service unavailable'));

    const authenticator = new CobisAuthenticator();

    await expect(authenticator.authenticate(request as any, cobisHeaders as any)).rejects.toThrow(
      'Service unavailable'
    );
  });
});
