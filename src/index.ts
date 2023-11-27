import { PORT } from './config/env';
import { initDatabase } from './config/mongo';
import { getRedisConnection } from './config/redis';
import { createApp } from './util/express';
import { logger } from './util/logger';
import { bindUserRoutes } from './util/useRoutes';

const name = 'Product Service';

const init = () => createApp(name, bindUserRoutes);

(async () => {
  //   validateEnv();

  logger.info('Connecting to database');
  await initDatabase();

  logger.info('Starting Redis connection');
  getRedisConnection();

  init().listen(PORT, () => {
    logger.info(`${name} Started successfully on :${PORT}`);
  });
})();
