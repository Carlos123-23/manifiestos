/**
 * Fastify schema for authentication body validation
 */

export const authenticationBodySchema = {
  type: 'object',
  required: ['authentication'],
  properties: {
    authentication: {
      type: 'object',
      required: ['login', 'password'],
      properties: {
        login: {
          type: 'string',
          minLength: 1,
          maxLength: 256,
          description: 'User login'
        },
        password: {
          type: 'string',
          minLength: 1,
          maxLength: 256,
          description: 'User password'
        }
      },
      additionalProperties: false
    }
  },
  additionalProperties: false
};
