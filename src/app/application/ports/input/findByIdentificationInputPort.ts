import { NaturalPersonResponse } from '../../../domain/entities/naturalPerson';
import { CobisRequestHeaders } from '../../types/cobisRequestHeaders';

export interface FindByIdentificationInput {
  identificationNumber: string;
  identificationType: string;
  cobisHeaders: CobisRequestHeaders;
}

export interface FindByIdentificationInputPort {
  execute(input: FindByIdentificationInput): Promise<NaturalPersonResponse>;
}
