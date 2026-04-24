import { FastifyRequest } from 'fastify';
import { randomUUID } from 'crypto';
import { BadRequestException } from '../../../application/exceptions/BadRequest.exception';

const asString = (value: string | string[] | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }
  return Array.isArray(value) ? value[0] : value;
};

const normalizeAuthorization = (authorization: string): string => {
  return /^Bearer\s+/i.test(authorization)
    ? authorization
    : `Bearer ${authorization}`;
};

const normalizeHeaderEncoding = (value: string): string => {
  if (!/[ÃÂ]/.test(value)) {
    return value;
  }

  const decoded = Buffer.from(value, 'latin1').toString('utf8');
  return decoded.includes('\uFFFD') ? value : decoded;
};

export const buildCobisHeadersPreHandler = async (
  request: FastifyRequest
): Promise<void> => {
  const authorization = asString(request.headers.authorization);
  const endUserLoginRaw = asString(request.headers['x-end-user-login']);
  const endUserLogin = endUserLoginRaw ? normalizeHeaderEncoding(endUserLoginRaw) : '';
  const now = new Date().toISOString();

  if (!authorization || !endUserLogin) {
    throw new BadRequestException('Headers authorization and x-end-user-login are required');
  }

  request.cobisHeaders = {
    authorization: authorization ? normalizeAuthorization(authorization) : '',
    requestId: asString(request.headers['x-request-id']) ?? randomUUID(),
    endUserLogin,
    endUserRequestDateTime: asString(request.headers['x-end-user-request-date-time']) ?? now,
    endUserTerminal: asString(request.headers['x-end-user-terminal']) ?? 'api',
    endUserLastLoggedDateTime:
      asString(request.headers['x-end-user-last-logged-date-time']) ?? now,
    apiKey: asString(request.headers['x-api-key']),
    reverse: asString(request.headers['x-reverse']),
    requestIdToReverse: asString(request.headers['x-requestid-to-reverse']),
    acceptLanguage: asString(request.headers['accept-language'])
  };
};
