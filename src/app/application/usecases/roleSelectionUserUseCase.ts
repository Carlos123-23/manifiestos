import { inject, injectable } from 'tsyringe';
import {
  RoleSelectionInput,
  RoleSelectionInputPort
} from '../ports/input/roleSelectionInputPort';
import { RoleSelectionProviderPort } from '../ports/output/roleSelectionProviderPort';
import { BadRequestException } from '../exceptions/BadRequest.exception';
import { ExternalServiceException } from '../exceptions/ExternalService.exception';

@injectable()
export class RoleSelectionUserUseCase implements RoleSelectionInputPort {
  constructor(
    @inject('RoleSelectionProviderPort')
    private readonly roleSelectionProvider: RoleSelectionProviderPort
  ) {}

  private validateInput(input: RoleSelectionInput): void {
    const login = input.request?.authentication?.login?.trim();
    const subsidiaryCode = input.request?.subsidiary?.code;
    const branchCode = input.request?.branch?.code;
    const roleCode = input.request?.role?.code;

    if (!login) {
      throw new BadRequestException('authentication.login is required');
    }

    if (subsidiaryCode === undefined || subsidiaryCode === null) {
      throw new BadRequestException('subsidiary.code is required');
    }

    if (branchCode === undefined || branchCode === null) {
      throw new BadRequestException('branch.code is required');
    }

    if (roleCode === undefined || roleCode === null) {
      throw new BadRequestException('role.code is required');
    }
  }

  async execute(input: RoleSelectionInput): Promise<unknown> {
    this.validateInput(input);

    try {
      const result = await this.roleSelectionProvider.selectRole(input.request, input.cobisHeaders);
      console.log('[RoleSelectionUserUseCase] Role selection successful:', result);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      if (message.includes('401') || message.toLowerCase().includes('unauthorized')) {
        throw new ExternalServiceException('Invalid session or credentials', 401, error);
      }

      if (message.includes('403') || message.toLowerCase().includes('forbidden')) {
        throw new ExternalServiceException('Access forbidden by external service', 403, error);
      }

      if (message.includes('not configured')) {
        throw new ExternalServiceException('Cobis service is not properly configured', 500, error);
      }

      throw new ExternalServiceException(
        `Failed to select role in external service: ${message}`,
        502,
        error
      );
    }
  }
}
