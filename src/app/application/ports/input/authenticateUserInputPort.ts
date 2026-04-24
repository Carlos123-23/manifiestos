import { CobisRequestHeaders } from '../../types/cobisRequestHeaders';

export interface AuthenticateUserRequest {
  authentication: {
    login: string;
    password: string;
  };
}

export interface AuthenticateUserInput {
  request: AuthenticateUserRequest;
  cobisHeaders: CobisRequestHeaders;
}

export interface AuthenticateUserInputPort {
  execute(input: AuthenticateUserInput): Promise<unknown>;
}
