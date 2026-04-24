import 'fastify';
import { AuthenticateUserInput } from '../app/application/ports/input/authenticateUserInputPort';
import { RoleSelectionInput } from '../app/application/ports/input/roleSelectionInputPort';
import { FindByIdentificationInput } from '../app/application/ports/input/findByIdentificationInputPort';
import { CobisRequestHeaders } from '../app/application/types/cobisRequestHeaders';
import { CustomerAccessFlowRequest } from '../app/application/types/customerAccessFlowRequest';
import { FindByIdentificationRequest } from '../app/application/types/findByIdentificationRequest';

declare module 'fastify' {
  interface FastifyRequest {
    cobisHeaders?: CobisRequestHeaders;
    findByIdentificationRequest?: FindByIdentificationRequest;
    findByIdentificationInput?: FindByIdentificationInput;
    authenticateUserInput?: AuthenticateUserInput;
    roleSelectionInput?: RoleSelectionInput;
    customerAccessFlowRequest?: CustomerAccessFlowRequest;
  }
}

export {};
