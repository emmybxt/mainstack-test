import { Express } from 'express';

import authRoutes from '../routes/auth';
import productRoutes from '../routes/products';

export const bindUserRoutes = (app: Express): void => {
  app.use('/v1/auth', authRoutes);
  app.use('/v1/product', productRoutes);
};
