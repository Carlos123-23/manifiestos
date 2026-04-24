import { CobisRequestHeaders } from '../../types/cobisRequestHeaders';
import { RoleSelectionRequest } from '../input/roleSelectionInputPort';

export interface RoleSelectionProviderPort {
  selectRole(
    request: RoleSelectionRequest,
    headers: CobisRequestHeaders
  ): Promise<unknown>;
}
