import { randomUUID } from 'crypto';
import { CobisRequestHeaders } from '../../application/types/cobisRequestHeaders';
import { cobisConfig } from '../../../config/cobis.config';

export class CobisHeadersBuilder {
  static buildAuthenticationHeaders(cobisHeaders: CobisRequestHeaders): Record<string, string> {
    const requestId = cobisHeaders.requestId ?? randomUUID();
    const now = new Date().toISOString();

    return {
      'x-api-key': cobisHeaders.apiKey ?? cobisConfig.apiKey,
      'x-request-id': requestId,
      'x-end-user-login': cobisHeaders.endUserLogin,
      'x-end-user-request-date-time': cobisHeaders.endUserRequestDateTime ?? now,
      'x-end-user-terminal': cobisHeaders.endUserTerminal,
      'content-type': 'application/json',
    };
  }

  static buildNaturalPersonHeaders(cobisHeaders: CobisRequestHeaders): Record<string, string> {
    const requestId = cobisHeaders.requestId ?? randomUUID();
    const now = new Date().toISOString();

    return {
      'content-type': 'application/json',
      'x-api-key': cobisHeaders.apiKey ?? cobisConfig.apiKey,
      'x-request-id': requestId,
      'x-end-user-login': cobisHeaders.endUserLogin,
      'x-end-user-request-date-time': cobisHeaders.endUserRequestDateTime ?? now,
      'x-end-user-terminal': cobisHeaders.endUserTerminal,
      'x-end-user-last-logged-date-time': cobisHeaders.endUserLastLoggedDateTime ?? now,
      ...(cobisHeaders.reverse && { 'x-reverse': cobisHeaders.reverse }),
      ...(cobisHeaders.requestIdToReverse && {
        'x-requestId-to-reverse': cobisHeaders.requestIdToReverse
      }),
      ...(cobisHeaders.acceptLanguage && { 'Accept-Language': cobisHeaders.acceptLanguage }),
      ...(cobisHeaders.authorization && { Authorization: cobisHeaders.authorization }),
    };
  }

  static buildRoleSelectionHeaders(cobisHeaders: CobisRequestHeaders): Record<string, string> {
    const requestId = cobisHeaders.requestId ?? randomUUID();
    const now = new Date().toISOString();

    return {
      'content-type': 'application/json',
      'x-api-key': cobisHeaders.apiKey ?? cobisConfig.apiKey,
      'x-request-id': requestId,
      'x-end-user-login': cobisHeaders.endUserLogin,
      'x-end-user-request-date-time': cobisHeaders.endUserRequestDateTime ?? now,
      'x-end-user-terminal': cobisHeaders.endUserTerminal,
      'x-end-user-last-logged-date-time': cobisHeaders.endUserLastLoggedDateTime ?? now,
    };
  }
}
