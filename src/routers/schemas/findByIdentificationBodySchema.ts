const identificationTypeSchema = {
  oneOf: [
    { type: 'string' },
    {
      type: 'object',
      properties: {
        code: { type: 'string' }
      },
      required: ['code']
    }
  ]
};

const identificationSchema = {
  type: 'object',
  properties: {
    number: { type: 'string' },
    type: identificationTypeSchema
  },
  required: ['number', 'type']
};

export const findByIdentificationBodySchema = {
  oneOf: [
    {
      type: 'object',
      properties: {
        identification: identificationSchema
      },
      required: ['identification']
    },
    {
      type: 'object',
      properties: {
        naturalPerson: {
          type: 'object',
          properties: {
            identification: identificationSchema
          },
          required: ['identification']
        }
      },
      required: ['naturalPerson']
    }
  ]
};