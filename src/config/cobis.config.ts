export const cobisConfig = {
  baseUrl: process.env.COBIS_BASE_URL ?? 'http://localhost:8080',
  apiKey: process.env.COBIS_API_KEY ?? '',
  paths: {
    authentication: process.env.COBIS_AUTHENTICATION_PATH ?? '/api/authentication',
    roleSelection: process.env.COBIS_ROLE_SELECTION_PATH ?? '/api/authentication/role-selection',
    naturalPerson: process.env.COBIS_NATURAL_PERSONS_PATH ?? '/api/natural-person/find-by-identification'
  }
};
