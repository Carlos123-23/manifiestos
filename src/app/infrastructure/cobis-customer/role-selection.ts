import { injectable } from 'tsyringe';
import { techLog } from '@darwin-node/logger';
import { RoleSelectionProviderPort } from '../../application/ports/output/roleSelectionProviderPort';
import { CobisRequestHeaders } from '../../application/types/cobisRequestHeaders';
import { RoleSelectionRequest } from '../../application/ports/input/roleSelectionInputPort';
import { CobisCustomerConstants } from './constants';
import { CobisHeadersBuilder } from './headers';
import { CobisHttpClient } from './http-client';

@injectable()
export class CobisRoleSelection implements RoleSelectionProviderPort {
  async selectRole(
    request: RoleSelectionRequest,
    cobisHeaders: CobisRequestHeaders
  ): Promise<unknown> {
    const url = new URL(
      CobisCustomerConstants.ROLE_SELECTION_PATH,
      CobisCustomerConstants.BASE_URL
    ).toString();

    const headers = CobisHeadersBuilder.buildRoleSelectionHeaders(cobisHeaders);

    techLog.info(`[CobisRoleSelection] Calling Cobis role selection. requestId=${headers['x-request-id']}`);

    return CobisHttpClient.post(url, headers, request, 'CobisRoleSelection');
  }
}
