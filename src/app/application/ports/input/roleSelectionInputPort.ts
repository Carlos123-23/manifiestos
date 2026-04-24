import { CobisRequestHeaders } from '../../types/cobisRequestHeaders';

export interface RoleSelectionRequest {
  session: string;
  authentication: {
    login: string;
  };
  subsidiary: {
    code: number;
  };
  branch: {
    code: number;
  };
  role: {
    code: number;
  };
}

export interface RoleSelectionInput {
  request: RoleSelectionRequest;
  cobisHeaders: CobisRequestHeaders;
}

export interface RoleSelectionInputPort {
  execute(input: RoleSelectionInput): Promise<unknown>;
}
