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

describe('CobisCustomerConstants', () => {
  let CobisCustomerConstants: any;

  beforeEach(() => {
    jest.resetModules();
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
    CobisCustomerConstants =
      require('../../../../../src/app/infrastructure/cobis-customer/constants').CobisCustomerConstants;
  });

  it('has AUTHENTICATION_PATH from config', () => {
    expect(CobisCustomerConstants.AUTHENTICATION_PATH).toBe('/api/authentication');
  });

  it('has ROLE_SELECTION_PATH from config', () => {
    expect(CobisCustomerConstants.ROLE_SELECTION_PATH).toBe('/api/authentication/role-selection');
  });

  it('has NATURAL_PERSON_PATH from config', () => {
    expect(CobisCustomerConstants.NATURAL_PERSON_PATH).toBe(
      '/api/natural-person/find-by-identification'
    );
  });

  it('has BASE_URL from config', () => {
    expect(CobisCustomerConstants.BASE_URL).toBe('http://cobis.example.com');
  });

  it('has DEFAULT_API_KEY from config', () => {
    expect(CobisCustomerConstants.DEFAULT_API_KEY).toBe('default-api-key');
  });

  it('builds NATURAL_PERSONS_URL from BASE_URL and NATURAL_PERSON_PATH when env var is not set', () => {
    delete process.env.COBIS_NATURAL_PERSONS_URL;
    jest.resetModules();
    jest.mock('../../../../../src/config/cobis.config', () => ({
      cobisConfig: {
        baseUrl: 'http://cobis.example.com',
        apiKey: 'key',
        paths: {
          authentication: '/api/authentication',
          roleSelection: '/api/authentication/role-selection',
          naturalPerson: '/api/natural-person/find-by-identification'
        }
      }
    }));
    const { CobisCustomerConstants: C } = require('../../../../../src/app/infrastructure/cobis-customer/constants');

    expect(C.NATURAL_PERSONS_URL).toBe(
      'http://cobis.example.com/api/natural-person/find-by-identification'
    );
  });

  it('uses COBIS_NATURAL_PERSONS_URL env var when set', () => {
    process.env.COBIS_NATURAL_PERSONS_URL = 'http://custom.example.com/api/persons';
    jest.resetModules();
    jest.mock('../../../../../src/config/cobis.config', () => ({
      cobisConfig: {
        baseUrl: 'http://cobis.example.com',
        apiKey: 'key',
        paths: {
          authentication: '/api/authentication',
          roleSelection: '/api/authentication/role-selection',
          naturalPerson: '/api/natural-person'
        }
      }
    }));
    const { CobisCustomerConstants: C } = require('../../../../../src/app/infrastructure/cobis-customer/constants');

    expect(C.NATURAL_PERSONS_URL).toBe('http://custom.example.com/api/persons');
    delete process.env.COBIS_NATURAL_PERSONS_URL;
  });
});
