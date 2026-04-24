import { injectable, inject } from 'tsyringe';
import {
  FindByIdentificationInput,
  FindByIdentificationInputPort
} from '../ports/input/findByIdentificationInputPort';
import { NaturalPersonRepositoryPort } from '../ports/output/naturalPersonRepositoryPort';
import { NaturalPersonResponse } from '../../domain/entities/naturalPerson';
import { InvalidIdentificationException } from '../exceptions/InvalidIdentification.exception';
import { CustomerNotFoundException } from '../exceptions/CustomerNotFound.exception';
import { ExternalServiceException } from '../exceptions/ExternalService.exception';

type NormalizedInput = {
  identificationNumber: string;
  identificationType: string;
};

@injectable()
export class FindByIdentificationUseCase implements FindByIdentificationInputPort {
  constructor(
    @inject('NaturalPersonRepositoryPort')
    private readonly naturalPersonRepository: NaturalPersonRepositoryPort
  ) {}

  private normalizeInput(input: FindByIdentificationInput): NormalizedInput {
    const identificationNumber = input.identificationNumber?.trim();
    const identificationType = input.identificationType?.trim().toUpperCase();

    if (!identificationNumber) {
      throw new InvalidIdentificationException('identification.number is required');
    }

    if (!identificationType) {
      throw new InvalidIdentificationException('identification.type is required');
    }

    return {
      identificationNumber,
      identificationType
    };
  }

  private mapRepositoryError(error: unknown, input: NormalizedInput): never {
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.includes('Customer not found')) {
      throw new CustomerNotFoundException(input.identificationNumber, input.identificationType);
    }

    if (
      errorMessage.includes('not configured') ||
      errorMessage.includes('COBIS_NATURAL_PERSONS_URL')
    ) {
      throw new ExternalServiceException('Cobis service is not properly configured', 500, error);
    }

    if (errorMessage.includes('status')) {
      throw new ExternalServiceException(
        `Failed to retrieve customer data from external service: ${errorMessage}`,
        502,
        error
      );
    }

    if (errorMessage.includes('fetch') || errorMessage.includes('Cobis')) {
      throw new ExternalServiceException(
        `Failed to connect to external service: ${errorMessage}`,
        502,
        error
      );
    }

    throw new ExternalServiceException(
      'An unexpected error occurred while retrieving customer data',
      500,
      error
    );
  }

  async execute(input: FindByIdentificationInput): Promise<NaturalPersonResponse> {
    const normalizedInput = this.normalizeInput(input);

    try {
      const result = await this.naturalPersonRepository.findByIdentification(
        normalizedInput.identificationNumber,
        normalizedInput.identificationType,
        input.cobisHeaders
      );
      console.log('[FindByIdentificationUseCase] Find by identification successful:', result);
      return result;
    } catch (error) {
      this.mapRepositoryError(error, normalizedInput);
    }
  }
}
