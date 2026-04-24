import { FastifyRequest } from 'fastify';
import { BadRequestException } from '../../../application/exceptions/BadRequest.exception';
import { RoleSelectionRequest } from '../../../application/ports/input/roleSelectionInputPort';

export const mapRoleSelectionRequestInterceptor = async (
  request: FastifyRequest
): Promise<void> => {
  const body = request.body as RoleSelectionRequest | undefined;

  if (
    !body?.authentication?.login ||
    body?.subsidiary?.code === undefined ||
    body?.branch?.code === undefined ||
    body?.role?.code === undefined
  ) {
    throw new BadRequestException('Invalid role selection payload');
  }

  if (!request.cobisHeaders) {
    throw new BadRequestException('Required Cobis headers are missing');
  }

  request.roleSelectionInput = {
    request: body,
    cobisHeaders: request.cobisHeaders
  };
};
