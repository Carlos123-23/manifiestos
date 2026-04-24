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

export const customerAccessFlowBodySchema = {
  type: 'object',
  properties: {
    identification: identificationSchema,
    naturalPerson: {
      type: 'object',
      properties: {
        identification: identificationSchema
      },
      required: ['identification']
    }
  },
  oneOf: [
    { required: ['identification'] },
    { required: ['naturalPerson'] }
  ],
  additionalProperties: false
};
