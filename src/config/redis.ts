import IORedis, { Redis } from 'ioredis';

import { REDIS_URL } from '../config/env';
import { logger } from '../util/logger';

let redis: Redis;

/**
 * Create the connection to the redis server
 */
export const getRedisConnection = (): Redis => {
  if (!redis) {
    redis = new IORedis(`${REDIS_URL}`);

    const connectHandler = (...args: any[]) => {
      logger.info(`Default Connection to Redis established. ${args}`);
    };

    redis.on('connect', connectHandler);

    redis.once('close', () => {
      logger.error(`Default connection to redis closed`, {});
      process.exit(1);
    });

    redis.once('error', (error) => {
      logger.error(`Unable to establish default connection to redis`, {
        error,
      });
      process.exit(1);
    });
  }

  return redis;
};
