import { injectable } from 'tsyringe';
import { techLog } from '@darwin-node/logger';
import { NaturalPersonRepositoryPort } from '../../application/ports/output/naturalPersonRepositoryPort';
import { NaturalPersonResponse } from '../../domain/entities/naturalPerson';
import { CobisRequestHeaders } from '../../application/types/cobisRequestHeaders';
import { CobisCustomerConstants } from './constants';
import { CobisHeadersBuilder } from './headers';
import { CobisHttpClient } from './http-client';

@injectable()
export class CobisNaturalPerson implements NaturalPersonRepositoryPort {
  async findByIdentification(
    identificationNumber: string,
    identificationType: string,
    cobisHeaders: CobisRequestHeaders
  ): Promise<NaturalPersonResponse> {
    const url = CobisCustomerConstants.NATURAL_PERSONS_URL;
    const headers = CobisHeadersBuilder.buildNaturalPersonHeaders(cobisHeaders);
    const body = {
      naturalPerson: {
        identification: {
          number: identificationNumber,
          type: { code: identificationType }
        }
      }
    };

    techLog.info(`[CobisNaturalPerson] Calling Cobis. requestId=${headers['x-request-id']}, type=${identificationType}`);

    try {
      const response = await CobisHttpClient.post(url, headers, body, 'CobisNaturalPerson');

      if (!response?.naturalPerson?.identification) {
        throw new Error('Cobis response does not contain naturalPerson.identification');
      }

      return response as NaturalPersonResponse;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('404')) {
        throw new Error(`Customer not found: ${identificationNumber}`);
      }
      throw error;
    }
  }
}
