/**
 * Fastify schema for role selection body validation
 */

export const roleSelectionBodySchema = {
  type: 'object',
  required: ['session', 'authentication', 'subsidiary', 'branch', 'role'],
  properties: {
    session: {
      type: 'string',
      description: 'Session identifier'
    },
    authentication: {
      type: 'object',
      required: ['login'],
      properties: {
        login: {
          type: 'string',
          description: 'User login'
        }
      },
      additionalProperties: false
    },
    subsidiary: {
      type: 'object',
      required: ['code'],
      properties: {
        code: {
          type: 'number',
          description: 'Subsidiary code'
        }
      },
      additionalProperties: false
    },
    branch: {
      type: 'object',
      required: ['code'],
      properties: {
        code: {
          type: 'number',
          description: 'Branch code'
        }
      },
      additionalProperties: false
    },
    role: {
      type: 'object',
      required: ['code'],
      properties: {
        code: {
          type: 'number',
          description: 'Role code'
        }
      },
      additionalProperties: false
    }
  },
  additionalProperties: false
};
