import Joi, { ObjectSchema } from 'joi';

import { logger } from '../util/logger';

export const SCHEMA = {
  OPTIONAL_EMAIL: Joi.string().email().allow('').optional(),
  OPTIONAL_HOST_NAME: Joi.string().hostname().allow('').optional(),
  OPTIONAL_IP_STRING: Joi.string().ip().allow('').optional(),
  OPTIONAL_NUMBER: Joi.number().allow('').optional(),
  OPTIONAL_NUMERIC_SWITCH: Joi.number().integer().min(0).max(1).optional(),
  OPTIONAL_STRING: Joi.string().allow('').optional(),
  OPTIONAL_URI_STRING: Joi.string().uri().allow('').optional(),
  REQUIRED_BOOLEAN: Joi.boolean().required(),
  REQUIRED_EMAIL: Joi.string().email().required(),
  REQUIRED_HOST_NAME: Joi.string().hostname().required(),
  REQUIRED_IP_STRING: Joi.string().ip().required(),
  REQUIRED_NUMBER: Joi.number().required(),
  REQUIRED_NUMERIC_SWITCH: Joi.number().integer().min(0).max(1).required(),
  REQUIRED_STRING_ALLOW_EMPTY: Joi.string().allow('').required(),
  REQUIRED_STRING: Joi.string().required(),
  REQUIRED_URI_STRING: Joi.string().uri().required(),
};

const schema = Joi.object({
  NODE_ENV: SCHEMA.REQUIRED_STRING,
  PORT: SCHEMA.REQUIRED_NUMBER,
  MONGO_URL: SCHEMA.REQUIRED_STRING,
  MONGO_NAME: SCHEMA.REQUIRED_STRING,
  TOKEN_SECRET: SCHEMA.REQUIRED_STRING,
  REDIS_URL: SCHEMA.REQUIRED_STRING,
  SALT_ROUNDS: SCHEMA.REQUIRED_NUMBER,
});

const validateConfig = (
  schema: ObjectSchema,
  config: Record<string, unknown>,
): void => {
  const result = schema.validate(config, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (result.error) {
    logger.error(`Config validation error: ${result.error.message}`);
    process.exit(1);
  }
};
export const validateEnv = () => {
  try {
    validateConfig(schema, process.env);
  } catch (e) {
    console.error("Can't start app. Env config invalid.");
    process.exit(1);
  }
};
