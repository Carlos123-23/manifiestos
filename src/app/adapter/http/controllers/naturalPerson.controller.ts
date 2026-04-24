import { injectable, inject } from 'tsyringe';
import { FastifyRequest } from 'fastify';
import '../../../../types/fastify';
import { FindByIdentificationInputPort } from '../../../application/ports/input/findByIdentificationInputPort';
import { BadRequestException } from '../../../application/exceptions/BadRequest.exception';

@injectable()
export class NaturalPersonController {
  constructor(
    @inject('FindByIdentificationUseCase')
    private readonly findByIdentificationUseCase: FindByIdentificationInputPort
  ) {}

  async findByIdentification(req: FastifyRequest): Promise<unknown> {
    console.log('[NaturalPersonController] findByIdentification called', req.findByIdentificationInput);
    if (!req.findByIdentificationInput) {
      throw new BadRequestException('Mapped request is missing');
    }
    const result = await this.findByIdentificationUseCase.execute(req.findByIdentificationInput);
    console.log('[NaturalPersonController] Result from use case:', result);
    return result;
  }
}
