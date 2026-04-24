import { injectable } from 'tsyringe';
import { AuthenticationProviderPort } from '../../application/ports/output/authenticationProviderPort';
import { CobisRequestHeaders } from '../../application/types/cobisRequestHeaders';
import { AuthenticateUserRequest } from '../../application/ports/input/authenticateUserInputPort';
import { CobisCustomerConstants } from './constants';
import { CobisHeadersBuilder } from './headers';
import { CobisHttpClient } from './http-client';

@injectable()
export class CobisAuthenticator implements AuthenticationProviderPort {
  async authenticate(
    request: AuthenticateUserRequest,
    cobisHeaders: CobisRequestHeaders
  ): Promise<unknown> {
    const url = new URL(
      CobisCustomerConstants.AUTHENTICATION_PATH,
      CobisCustomerConstants.BASE_URL
    ).toString();

    const headers = CobisHeadersBuilder.buildAuthenticationHeaders(cobisHeaders);

    const payload = {
      authentication: {
        login: request?.authentication?.login,
        password: request?.authentication?.password,
      },
    };

    return CobisHttpClient.post(url, headers, payload, 'CobisAuthenticator');
  }
}
