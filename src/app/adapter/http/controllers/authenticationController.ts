import { injectable, inject } from 'tsyringe';
import { FastifyRequest } from 'fastify';
import '../../../../types/fastify';
import { CobisException } from '../../../application/exceptions/CobisException';
import { AuthenticateUserInputPort } from '../../../application/ports/input/authenticateUserInputPort';

@injectable()
export class AuthenticationController {
  constructor(
    @inject('AuthenticateUserInputPort')
    private readonly authenticateUserUseCase: AuthenticateUserInputPort
  ) {}

  async authenticate(req: FastifyRequest): Promise<unknown> {
    console.log('[AuthenticationController] authenticate called', req.authenticateUserInput);
    if (!req.authenticateUserInput) {
      throw new CobisException('Mapped request is missing', 400, 'Bad Request');
    }
    const result = await this.authenticateUserUseCase.execute(req.authenticateUserInput);
    console.log('[AuthenticationController] Result from use case:', result);
    return result;
  }
}
