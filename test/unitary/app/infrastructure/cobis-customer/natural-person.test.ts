import 'reflect-metadata';
import { CobisNaturalPerson } from '../../../../../src/app/infrastructure/cobis-customer/natural-person';
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
const mockBuildNaturalPersonHeaders = CobisHeadersBuilder.buildNaturalPersonHeaders as jest.MockedFunction<
  typeof CobisHeadersBuilder.buildNaturalPersonHeaders
>;

describe('CobisNaturalPerson', () => {
  const cobisHeaders = {
    authorization: 'Bearer token',
    requestId: 'r1',
    endUserLogin: 'userA',
    endUserRequestDateTime: '2026-01-01T00:00:00.000Z',
    endUserTerminal: 'api',
    endUserLastLoggedDateTime: '2026-01-01T00:00:00.000Z'
  };

  const naturalPersonResponse = {
    naturalPerson: {
      identification: {
        number: '12345678',
        type: { code: 'DNI' }
      }
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockBuildNaturalPersonHeaders.mockReturnValue({ 'x-api-key': 'key', 'x-request-id': 'r1' });
    mockPost.mockResolvedValue(naturalPersonResponse);
  });

  it('calls CobisHttpClient.post with correct URL, headers and body', async () => {
    const repo = new CobisNaturalPerson();

    const result = await repo.findByIdentification('12345678', 'DNI', cobisHeaders as any);

    expect(mockBuildNaturalPersonHeaders).toHaveBeenCalledWith(cobisHeaders);
    expect(mockPost).toHaveBeenCalledWith(
      'http://cobis.example.com/api/natural-person/find-by-identification',
      { 'x-api-key': 'key', 'x-request-id': 'r1' },
      {
        naturalPerson: {
          identification: {
            number: '12345678',
            type: { code: 'DNI' }
          }
        }
      },
      'CobisNaturalPerson'
    );
    expect(result).toEqual(naturalPersonResponse);
  });

  it('throws when response does not contain naturalPerson.identification', async () => {
    mockPost.mockResolvedValue({ naturalPerson: {} });

    const repo = new CobisNaturalPerson();

    await expect(repo.findByIdentification('12345678', 'DNI', cobisHeaders as any)).rejects.toThrow(
      'Cobis response does not contain naturalPerson.identification'
    );
  });

  it('maps 404 error to "Customer not found" error', async () => {
    mockPost.mockRejectedValue(new Error('responded with status 404: Not found'));

    const repo = new CobisNaturalPerson();

    await expect(
      repo.findByIdentification('12345678', 'DNI', cobisHeaders as any)
    ).rejects.toThrow('Customer not found: 12345678');
  });

  it('re-throws non-404 errors as-is', async () => {
    const error = new Error('Internal server error 500');
    mockPost.mockRejectedValue(error);

    const repo = new CobisNaturalPerson();

    await expect(
      repo.findByIdentification('12345678', 'DNI', cobisHeaders as any)
    ).rejects.toThrow('Internal server error 500');
  });
});
