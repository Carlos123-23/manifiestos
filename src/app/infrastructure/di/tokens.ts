/**
 * Dependency injection container tokens
 * Defines all injectable service identifiers
 */

export const DI_TOKENS = {
  // Use cases
  FIND_BY_IDENTIFICATION_USE_CASE: 'FindByIdentificationUseCase',
  AUTHENTICATE_USER_USE_CASE: 'AuthenticateUserUseCase',
  ROLE_SELECTION_USE_CASE: 'RoleSelectionUserUseCase',
  CUSTOMER_ACCESS_FLOW_USE_CASE: 'CustomerAccessFlowUseCase',

  // Ports (output)
  NATURAL_PERSON_REPOSITORY_PORT: 'NaturalPersonRepositoryPort',
  AUTHENTICATION_PROVIDER_PORT: 'AuthenticationProviderPort',
  ROLE_SELECTION_PROVIDER_PORT: 'RoleSelectionProviderPort',

  // Ports (input)
  FIND_BY_IDENTIFICATION_INPUT_PORT: 'FindByIdentificationInputPort',
  AUTHENTICATE_USER_INPUT_PORT: 'AuthenticateUserInputPort',
  ROLE_SELECTION_INPUT_PORT: 'RoleSelectionUserInputPort',
  CUSTOMER_ACCESS_FLOW_INPUT_PORT: 'CustomerAccessFlowInputPort',

  // Controllers
  NATURAL_PERSON_CONTROLLER: 'NaturalPersonController',
  AUTHENTICATION_CONTROLLER: 'AuthenticationController',
  ROLE_SELECTION_CONTROLLER: 'RoleSelectionController',
  CUSTOMER_ACCESS_FLOW_CONTROLLER: 'CustomerAccessFlowController'
};
