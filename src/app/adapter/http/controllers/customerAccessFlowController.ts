import { inject, injectable } from 'tsyringe';
import { FastifyRequest } from 'fastify';
import '../../../../types/fastify';
import { CobisException } from '../../../application/exceptions/CobisException';
import { CustomerAccessFlowInputPort } from '../../../application/ports/input/customerAccessFlowInputPort';

@injectable()
export class CustomerAccessFlowController {
  constructor(
    @inject('CustomerAccessFlowInputPort')
    private readonly customerAccessFlowUseCase: CustomerAccessFlowInputPort
  ) {}

  async execute(req: FastifyRequest): Promise<unknown> {
    if (!req.customerAccessFlowRequest || !req.cobisHeaders) {
      throw new CobisException('Mapped request is missing', 400, 'Bad Request');
    }

    return this.customerAccessFlowUseCase.execute({
      identificationNumber: req.customerAccessFlowRequest.identificationNumber,
      identificationType: req.customerAccessFlowRequest.identificationType,
      cobisHeaders: req.cobisHeaders
    });
  }
}