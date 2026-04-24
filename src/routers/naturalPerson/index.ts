import { container } from '../../app/infrastructure/di/container';
import { NaturalPersonController } from '../../app/adapter/http/controllers/naturalPerson.controller';
import { mapFindByIdentificationRequestInterceptor } from '../../app/adapter/http/interceptors/mapFindByIdentificationRequest.interceptor';
import { buildCobisHeadersPreHandler } from '../../app/adapter/http/prehandlers/buildCobisHeaders.prehandler';
import { validateFindByIdentificationRequestPreHandler } from '../../app/adapter/http/prehandlers/validateFindByIdentificationRequest.prehandler';
import { findByIdentificationBodySchema } from '../schemas/findByIdentificationBodySchema';

const naturalPersonController = container.resolve<NaturalPersonController>('NaturalPersonController');

const naturalPersonResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    statusCode: { type: 'number' },
    data: {
      type: 'object',
      additionalProperties: true
    }
  },
  additionalProperties: true,
  required: ['success', 'statusCode', 'data']
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

const cobisHeadersSchema = {
  type: 'object',
  properties: {
    authorization: { type: 'string' },
    'x-end-user-login': { type: 'string' },
    'x-request-id': { type: 'string' },
    'x-end-user-terminal': { type: 'string' },
    'x-end-user-request-date-time': { type: 'string' },
    'x-end-user-last-logged-date-time': { type: 'string' }
  },
  required: ['authorization', 'x-end-user-login']
};

const router = (app, options, done) => {
  app.route({
    method: 'POST',
    url: '/find-by-identification',
    preHandler: [
      buildCobisHeadersPreHandler,
      validateFindByIdentificationRequestPreHandler,
      mapFindByIdentificationRequestInterceptor
    ],
    schema: {
      headers: cobisHeadersSchema,
      body: findByIdentificationBodySchema,
      response: {
        200: naturalPersonResponseSchema,
        400: standardErrorResponseSchema,
        404: standardErrorResponseSchema,
        500: standardErrorResponseSchema,
        502: standardErrorResponseSchema
      }
    },
    handler: naturalPersonController.findByIdentification.bind(naturalPersonController)
  });
  done();
};

export default router;
