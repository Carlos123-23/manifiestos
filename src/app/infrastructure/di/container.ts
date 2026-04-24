import { container } from 'tsyringe';
import { DI_TOKENS } from './tokens';

// Controllers
import { NaturalPersonController } from '../../adapter/http/controllers/naturalPerson.controller';
import { AuthenticationController } from '../../adapter/http/controllers/authenticationController';
import { RoleSelectionController } from '../../adapter/http/controllers/roleSelectionController';
import { CustomerAccessFlowController } from '../../adapter/http/controllers/customerAccessFlowController';

// Use Cases
import { AuthenticateUserUseCase } from '../../application/usecases/authenticateUserUseCase';
import { RoleSelectionUserUseCase } from '../../application/usecases/roleSelectionUserUseCase';
import { FindByIdentificationUseCase } from '../../application/usecases/findByIdentificationUseCase';
import { CustomerAccessFlowUseCase } from '../../application/usecases/customerAccessFlowUseCase';

// Cobis Customer Services
import { CobisAuthenticator, CobisRoleSelection, CobisNaturalPerson } from '../cobis-customer';

// Register Output Ports (Cobis Customer Services)
container.register(DI_TOKENS.NATURAL_PERSON_REPOSITORY_PORT, {
  useClass: CobisNaturalPerson
});
container.register(DI_TOKENS.AUTHENTICATION_PROVIDER_PORT, {
  useClass: CobisAuthenticator
});
container.register(DI_TOKENS.ROLE_SELECTION_PROVIDER_PORT, {
  useClass: CobisRoleSelection
});

// Register Use Cases
container.register(DI_TOKENS.FIND_BY_IDENTIFICATION_USE_CASE, {
  useClass: FindByIdentificationUseCase
});
container.register(DI_TOKENS.FIND_BY_IDENTIFICATION_INPUT_PORT, {
  useClass: FindByIdentificationUseCase
});
container.register(DI_TOKENS.AUTHENTICATE_USER_USE_CASE, {
  useClass: AuthenticateUserUseCase
});
container.register(DI_TOKENS.AUTHENTICATE_USER_INPUT_PORT, {
  useClass: AuthenticateUserUseCase
});
container.register(DI_TOKENS.ROLE_SELECTION_INPUT_PORT, {
  useClass: RoleSelectionUserUseCase
});
container.register(DI_TOKENS.CUSTOMER_ACCESS_FLOW_USE_CASE, {
  useClass: CustomerAccessFlowUseCase
});
container.register(DI_TOKENS.CUSTOMER_ACCESS_FLOW_INPUT_PORT, {
  useClass: CustomerAccessFlowUseCase
});

// Register Controllers
container.register(DI_TOKENS.NATURAL_PERSON_CONTROLLER, {
  useClass: NaturalPersonController
});
container.register(DI_TOKENS.AUTHENTICATION_CONTROLLER, {
  useClass: AuthenticationController
});
container.register(DI_TOKENS.ROLE_SELECTION_CONTROLLER, {
  useClass: RoleSelectionController
});
container.register(DI_TOKENS.CUSTOMER_ACCESS_FLOW_CONTROLLER, {
  useClass: CustomerAccessFlowController
});

// Backward compatibility - register with old token names for existing code
container.register('NaturalPersonRepositoryPort', {
  useClass: CobisNaturalPerson
});
container.register('FindByIdentificationUseCase', {
  useClass: FindByIdentificationUseCase
});
container.register('FindByIdentificationInputPort', {
  useClass: FindByIdentificationUseCase
});
container.register('AuthenticationProviderPort', {
  useClass: CobisAuthenticator
});
container.register('AuthenticateUserUseCase', {
  useClass: AuthenticateUserUseCase
});
container.register('AuthenticateUserInputPort', {
  useClass: AuthenticateUserUseCase
});
container.register('RoleSelectionProviderPort', {
  useClass: CobisRoleSelection
});
container.register('RoleSelectionUserUseCase', {
  useClass: RoleSelectionUserUseCase
});
container.register('RoleSelectionUserInputPort', {
  useClass: RoleSelectionUserUseCase
});
container.register('CustomerAccessFlowUseCase', {
  useClass: CustomerAccessFlowUseCase
});
container.register('CustomerAccessFlowInputPort', {
  useClass: CustomerAccessFlowUseCase
});
container.register('NaturalPersonController', {
  useClass: NaturalPersonController
});
container.register('CustomerAccessFlowController', {
  useClass: CustomerAccessFlowController
});

export { container };
