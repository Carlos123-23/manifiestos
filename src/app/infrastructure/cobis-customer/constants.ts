import { cobisConfig } from '../../../config/cobis.config';

export class CobisCustomerConstants {
  static readonly AUTHENTICATION_PATH = cobisConfig.paths.authentication;
  static readonly NATURAL_PERSON_PATH = cobisConfig.paths.naturalPerson;
  static readonly ROLE_SELECTION_PATH = cobisConfig.paths.roleSelection;
  
  static readonly BASE_URL = cobisConfig.baseUrl;
  static readonly DEFAULT_API_KEY = cobisConfig.apiKey;
  
  static readonly NATURAL_PERSONS_URL = 
    process.env.COBIS_NATURAL_PERSONS_URL ?? 
    `${CobisCustomerConstants.BASE_URL}${CobisCustomerConstants.NATURAL_PERSON_PATH}`;
}
