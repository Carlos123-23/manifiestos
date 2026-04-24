import { injectable, inject } from 'tsyringe';
import { FastifyRequest } from 'fastify';
import '../../../../types/fastify';
import { CobisException } from '../../../application/exceptions/CobisException';
import { RoleSelectionInputPort } from '../../../application/ports/input/roleSelectionInputPort';

@injectable()
export class RoleSelectionController {
  constructor(
    @inject('RoleSelectionUserInputPort')
    private readonly roleSelectionUseCase: RoleSelectionInputPort
  ) {}

  async selectRole(req: FastifyRequest): Promise<unknown> {
    console.log('[RoleSelectionController] selectRole called', req.roleSelectionInput);
    if (!req.roleSelectionInput) {
      throw new CobisException('Mapped request is missing', 400, 'Bad Request');
    }
    const result = await this.roleSelectionUseCase.execute(req.roleSelectionInput);
    console.log('[RoleSelectionController] Result from use case:', result);
    return result;
  }
}
