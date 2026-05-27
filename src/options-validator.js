import * as hoek from '@hapi/hoek';

export default function validateOptions(schema, options) {
  const {error, value} = schema.validate(options);

  hoek.assert(!error, error);

  return value;
}
