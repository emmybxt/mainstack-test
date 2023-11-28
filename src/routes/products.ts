import express from 'express';

import * as productController from '../controllers/products';
import { validateToken } from '../middlewares/validateToken';
import * as productValidator from '../validations/products';
const router = express.Router();

router.use(validateToken);
router.post(
  '/',
  productValidator.validateCreateProduct,
  productController.createProduct,
);

router.put(
  '/update/:productId',
  productValidator.validateUpdateProduct,
  productController.updateProduct,
);

router.get('/:productId', productController.getProductById);

router.get('/', productController.getAllProducts);

router.get('/user', productController.getUserProducts);
export default router;
