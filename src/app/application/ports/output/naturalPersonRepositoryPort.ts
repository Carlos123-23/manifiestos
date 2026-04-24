import { NaturalPersonResponse } from '../../../domain/entities/naturalPerson';
import { CobisRequestHeaders } from '../../types/cobisRequestHeaders';

export interface NaturalPersonRepositoryPort {
  findByIdentification(
    identificationNumber: string,
    identificationType: string,
    cobisHeaders: CobisRequestHeaders
  ): Promise<NaturalPersonResponse>;
}
