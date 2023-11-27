import { Express } from 'express';

import authRoutes from '../routes/auth';

export const bindUserRoutes = (app: Express): void => {
  app.use('/v1/auth', authRoutes);
};
