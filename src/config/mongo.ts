import mongoose from 'mongoose';

import { logger } from '../util/logger';
import { MONGO_NAME, MONGO_URL } from './env';

let attempts = 0;
export const initDatabase = async () => {
  mongoose
    .connect(`${MONGO_URL}`, {
      connectTimeoutMS: 10000,
      keepAlive: true,
      socketTimeoutMS: 0,
      dbName: MONGO_NAME,
    })
    .then(({ connection }) => {
      logger.info(
        `Successfully Connected to MongoDB. ${connection.host}:${connection.port}/${connection.db.databaseName}`,
      );
      mongoose.set('strictQuery', true);
    })
    .catch((error) => {
      const nextConnect = ++attempts * (Math.random() * 10000);

      if (attempts >= 5) {
        logger.error('Unable to establish database connection', {
          error,
        });
        process.exit(1);
      }

      logger.error(
        `[Attempt #${attempts}]. Unable to connect to Database (${MONGO_URL}): ${error}. Reconnecting in ${Math.floor(
          nextConnect / 1000,
        )} seconds`,
      );
      setTimeout(initDatabase, nextConnect);
    });
};
