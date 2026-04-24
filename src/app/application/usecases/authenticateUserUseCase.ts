import { inject, injectable } from 'tsyringe';
import {
  AuthenticateUserInput,
  AuthenticateUserInputPort
} from '../ports/input/authenticateUserInputPort';
import { AuthenticationProviderPort } from '../ports/output/authenticationProviderPort';
import { BadRequestException } from '../exceptions/BadRequest.exception';
import { ExternalServiceException } from '../exceptions/ExternalService.exception';

@injectable()
export class AuthenticateUserUseCase implements AuthenticateUserInputPort {
  constructor(
    @inject('AuthenticationProviderPort')
    private readonly authenticationProvider: AuthenticationProviderPort
  ) {}

  private validateInput(input: AuthenticateUserInput): void {
    const login = input.request?.authentication?.login?.trim();
    const password = input.request?.authentication?.password;

    if (!login) {
      throw new BadRequestException('authentication.login is required');
    }

    if (!password) {
      throw new BadRequestException('authentication.password is required');
    }
  }

  async execute(input: AuthenticateUserInput): Promise<unknown> {
    this.validateInput(input);

    try {
      const result = await this.authenticationProvider.authenticate(input.request, input.cobisHeaders);
      console.log('[AuthenticateUserUseCase] Authentication successful:', result);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log('[AuthenticateUserUseCase] Authentication error:', message, 'Input:', input);
      if (message.includes('401') || message.toLowerCase().includes('unauthorized')) {
        console.log('[AuthenticateUserUseCase] Invalid credentials provided');
        throw new ExternalServiceException('Invalid credentials', 401, error);
      }

      if (message.includes('403') || message.toLowerCase().includes('forbidden')) {
        throw new ExternalServiceException('Access forbidden by external service', 403, error);
      }

      if (message.includes('not configured')) {
        throw new ExternalServiceException('Cobis service is not properly configured', 500, error);
      }

      throw new ExternalServiceException(
        `Failed to authenticate user in external service: ${message}`,
        502,
        error
      );
    }
  }
}
