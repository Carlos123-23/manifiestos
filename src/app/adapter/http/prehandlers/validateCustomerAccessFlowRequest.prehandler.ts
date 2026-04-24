import { FastifyReply, FastifyRequest } from 'fastify';
import { BadRequestException } from '../../../application/exceptions/BadRequest.exception';
import { CustomerAccessFlowRequest } from '../../../application/types/customerAccessFlowRequest';

const extractIdentification = (body: unknown): { number?: unknown; type?: unknown } | undefined => {
  if (!body || typeof body !== 'object') {
    return undefined;
  }

  const value = body as {
    identification?: { number?: unknown; type?: unknown };
    naturalPerson?: { identification?: { number?: unknown; type?: unknown } };
  };

  return value.identification ?? value.naturalPerson?.identification;
};

const extractTypeCode = (typeValue: unknown): string | undefined => {
  if (typeof typeValue === 'string') {
    return typeValue;
  }

  if (typeValue && typeof typeValue === 'object' && 'code' in typeValue) {
    const code = (typeValue as { code?: unknown }).code;
    return typeof code === 'string' ? code : undefined;
  }

  return undefined;
};

export const validateCustomerAccessFlowRequestPreHandler = async (
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> => {
  const identification = extractIdentification(request.body);
  const identificationNumber =
    typeof identification?.number === 'string' ? identification.number.trim() : '';
  const identificationType = extractTypeCode(identification?.type)?.trim();

  if (!identificationNumber) {
    throw new BadRequestException('identification.number is required');
  }

  if (!identificationType) {
    throw new BadRequestException('identification.type is required');
  }

  request.customerAccessFlowRequest = {
    identificationNumber,
    identificationType
  } as CustomerAccessFlowRequest;
};
