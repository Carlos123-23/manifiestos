import { FastifyReply, FastifyRequest } from 'fastify';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from '../../../application/exceptions/BadRequest.exception';
import { FindByIdentificationRequestDto } from '../validators/findByIdentificationRequest.dto';

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

export const validateFindByIdentificationRequestPreHandler = async (
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> => {
  const identification = extractIdentification(request.body);
  const dto = plainToInstance(FindByIdentificationRequestDto, {
    identificationNumber: identification?.number,
    identificationType: extractTypeCode(identification?.type)
  });

  const errors = await validate(dto, {
    stopAtFirstError: false,
    whitelist: true,
    forbidUnknownValues: true
  });

  if (errors.length > 0) {
    const fields = errors.map((error) => error.property).join(', ');
    throw new BadRequestException(`Invalid request payload: ${fields}`, errors);
  }

  request.findByIdentificationRequest = {
    identificationNumber: dto.identificationNumber,
    identificationType: dto.identificationType
  };
};