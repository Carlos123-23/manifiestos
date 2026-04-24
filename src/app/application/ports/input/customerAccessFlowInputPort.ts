import { CobisRequestHeaders } from '../../types/cobisRequestHeaders';
import { NaturalPersonResponse } from '../../../domain/entities/naturalPerson';

export interface CustomerAccessFlowInput {
  identificationNumber: string;
  identificationType: string;
  cobisHeaders: CobisRequestHeaders;
}

export interface CustomerAccessFlowInputPort {
  execute(input: CustomerAccessFlowInput): Promise<NaturalPersonResponse>;
}