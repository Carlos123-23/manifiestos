import { CobisRequestHeaders } from '../../types/cobisRequestHeaders';
import { AuthenticateUserRequest } from '../input/authenticateUserInputPort';

export interface AuthenticationProviderPort {
  authenticate(
    request: AuthenticateUserRequest,
    headers: CobisRequestHeaders
  ): Promise<unknown>;
}
