import { container } from '../../app/infrastructure/di/container';
import { AuthenticationController } from '../../app/adapter/http/controllers/authenticationController';
import { RoleSelectionController } from '../../app/adapter/http/controllers/roleSelectionController';
import { CustomerAccessFlowController } from '../../app/adapter/http/controllers/customerAccessFlowController';
import { buildCobisHeadersPreHandler } from '../../app/adapter/http/prehandlers/buildCobisHeaders.prehandler';
import { mapAuthenticateUserRequestInterceptor } from '../../app/adapter/http/interceptors/mapAuthenticateUserRequest.interceptor';
import { mapRoleSelectionRequestInterceptor } from '../../app/adapter/http/interceptors/mapRoleSelectionRequest.interceptor';
import { validateCustomerAccessFlowRequestPreHandler } from '../../app/adapter/http/prehandlers/validateCustomerAccessFlowRequest.prehandler';
import { authenticationBodySchema } from '../schemas/authenticationBodySchema';
import { roleSelectionBodySchema } from '../schemas/roleSelectionBodySchema';
import { customerAccessFlowBodySchema } from '../schemas/customerAccessFlowBodySchema';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';

const authenticationController = container.resolve<AuthenticationController>('AuthenticationController');
const roleSelectionController = container.resolve<RoleSelectionController>('RoleSelectionController');
const customerAccessFlowController = container.resolve<CustomerAccessFlowController>('CustomerAccessFlowController');

const authenticationHeadersSchema = {
  type: 'object',
  properties: {
    'x-end-user-login': { type: 'string' },
    'x-request-id': { type: 'string' },
    'x-end-user-terminal': { type: 'string' },
    'x-end-user-request-date-time': { type: 'string' },
    // 'x-end-user-last-logged-date-time': { type: 'string' }
  },
  required: ['x-end-user-login']
};

const standardErrorResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    statusCode: { type: 'number' },
    error: { type: 'string' },
    message: { type: 'string' },
    detail: { type: 'object', additionalProperties: true }
  },
  required: ['success', 'statusCode', 'error', 'message']
};

const customerAccessHeadersSchema = {
  type: 'object',
  properties: {
    'x-api-key': { type: 'string' },
    'x-end-user-login': { type: 'string' },
    'x-request-id': { type: 'string' },
    'x-end-user-terminal': { type: 'string' },
    'x-end-user-request-date-time': { type: 'string' }
  },
  required: ['x-api-key', 'x-end-user-login']
};

const router = (app: FastifyInstance, _options: FastifyPluginOptions, done: () => void) => {
  app.route({
    method: 'POST',
    url: '/authentication',
    preHandler: [buildCobisHeadersPreHandler, mapAuthenticateUserRequestInterceptor],
    schema: {
      headers: authenticationHeadersSchema,
      body: authenticationBodySchema,
      response: {
        200: {
          description: 'Authentication successful',
          type: 'object',
          additionalProperties: true
        },
        400: standardErrorResponseSchema,
        401: standardErrorResponseSchema,
        403: standardErrorResponseSchema,
        500: standardErrorResponseSchema,
        502: standardErrorResponseSchema
      }
    },
    handler: authenticationController.authenticate.bind(authenticationController)
  });

  app.route({
    method: 'POST',
    url: '/authentication/role-selection',
    preHandler: [buildCobisHeadersPreHandler, mapRoleSelectionRequestInterceptor],
    schema: {
      headers: authenticationHeadersSchema,
      body: roleSelectionBodySchema,
      response: {
        200: {
          description: 'Role selection successful',
          type: 'object',
          additionalProperties: true
        },
        400: standardErrorResponseSchema,
        401: standardErrorResponseSchema,
        403: standardErrorResponseSchema,
        500: standardErrorResponseSchema,
        502: standardErrorResponseSchema
      }
    },
    handler: roleSelectionController.selectRole.bind(roleSelectionController)
  });

  app.route({
    method: 'POST',
    url: '/authentication/customer-identification',
    preHandler: [buildCobisHeadersPreHandler, validateCustomerAccessFlowRequestPreHandler],
    schema: {
      headers: customerAccessHeadersSchema,
      body: customerAccessFlowBodySchema,
      response: {
        200: {
          description: 'Customer access flow successful',
          type: 'object',
          additionalProperties: true
        },
        400: standardErrorResponseSchema,
        401: standardErrorResponseSchema,
        403: standardErrorResponseSchema,
        500: standardErrorResponseSchema,
        502: standardErrorResponseSchema
      }
    },
    handler: customerAccessFlowController.execute.bind(customerAccessFlowController)
  });

  done();
};

export default router;
