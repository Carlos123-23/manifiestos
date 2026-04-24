import { FastifyRequest } from 'fastify';
import { BadRequestException } from '../../../application/exceptions/BadRequest.exception';
import { AuthenticateUserRequest } from '../../../application/ports/input/authenticateUserInputPort';

export const mapAuthenticateUserRequestInterceptor = async (
  request: FastifyRequest
): Promise<void> => {
  const body = request.body as AuthenticateUserRequest | undefined;

  if (!body?.authentication?.login || !body?.authentication?.password) {
    throw new BadRequestException('Invalid authentication payload');
  }

  if (!request.cobisHeaders) {
    console.log('[mapAuthenticateUserRequestInterceptor] Missing Cobis headers');
    throw new BadRequestException('Required Cobis headers are missing');
  }

  request.authenticateUserInput = {
    request: body,
    cobisHeaders: request.cobisHeaders
  };
};
