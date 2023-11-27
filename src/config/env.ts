import { config } from 'dotenv';

config();

export const env = (name: string, defaultValue = '') =>
  process.env[name] ?? defaultValue;

export const {
  NODE_ENV,
  PORT,
  MONGO_URL,
  MONGO_NAME,
  TOKEN_SECRET,
  REDIS_URL,
  SALT_ROUNDS,
} = process.env;
