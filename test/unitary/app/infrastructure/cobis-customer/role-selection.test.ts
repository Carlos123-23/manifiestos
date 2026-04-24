import 'reflect-metadata';
import { CobisRoleSelection } from '../../../../../src/app/infrastructure/cobis-customer/role-selection';
import { CobisHttpClient } from '../../../../../src/app/infrastructure/cobis-customer/http-client';
import { CobisHeadersBuilder } from '../../../../../src/app/infrastructure/cobis-customer/headers';

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
const mockBuildRoleSelectionHeaders =
  CobisHeadersBuilder.buildRoleSelectionHeaders as jest.MockedFunction<
    typeof CobisHeadersBuilder.buildRoleSelectionHeaders
  >;

describe('CobisRoleSelection', () => {
  const cobisHeaders = {
    authorization: 'Bearer token',
    requestId: 'r1',
    endUserLogin: 'userA',
    endUserRequestDateTime: '2026-01-01T00:00:00.000Z',
    endUserTerminal: 'api',
    endUserLastLoggedDateTime: '2026-01-01T00:00:00.000Z'
  };

  const roleSelectionRequest = {
    session: 'sess-123',
    authentication: { login: 'user123' },
    subsidiary: { code: 1 },
    branch: { code: 2 },
    role: { code: 3 }
  };

  const roleSelectionResult = {
    authenticationResult: { authorization: 'Bearer new-token' }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockBuildRoleSelectionHeaders.mockReturnValue({ 'x-api-key': 'key', 'x-request-id': 'r1' });
    mockPost.mockResolvedValue(roleSelectionResult);
  });

  it('calls CobisHttpClient.post with correct URL, headers and body', async () => {
    const roleSelection = new CobisRoleSelection();

    const result = await roleSelection.selectRole(roleSelectionRequest as any, cobisHeaders as any);

    expect(mockBuildRoleSelectionHeaders).toHaveBeenCalledWith(cobisHeaders);
    expect(mockPost).toHaveBeenCalledWith(
      'http://cobis.example.com/api/authentication/role-selection',
      { 'x-api-key': 'key', 'x-request-id': 'r1' },
      roleSelectionRequest,
      'CobisRoleSelection'
    );
    expect(result).toEqual(roleSelectionResult);
  });

  it('propagates errors from CobisHttpClient.post', async () => {
    mockPost.mockRejectedValue(new Error('Role selection failed'));

    const roleSelection = new CobisRoleSelection();

    await expect(
      roleSelection.selectRole(roleSelectionRequest as any, cobisHeaders as any)
    ).rejects.toThrow('Role selection failed');
  });
});
