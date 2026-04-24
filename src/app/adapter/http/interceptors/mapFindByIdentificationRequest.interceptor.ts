import { FastifyRequest } from 'fastify';
import { BadRequestException } from '../../../application/exceptions/BadRequest.exception';

export const mapFindByIdentificationRequestInterceptor = async (
  request: FastifyRequest
): Promise<void> => {
  const identificationNumber = request.findByIdentificationRequest?.identificationNumber;
  const identificationType = request.findByIdentificationRequest?.identificationType;

  if (!identificationNumber || !identificationType) {
    throw new BadRequestException('Invalid request payload');
  }

  if (!request.cobisHeaders) {
    throw new BadRequestException('Required Cobis headers are missing');
  }

  request.findByIdentificationInput = {
    identificationNumber,
    identificationType,
    cobisHeaders: request.cobisHeaders
  };
};
