import { NextFunction, Response } from 'express';

import { Types } from 'mongoose';
import { throwIfUndefined } from '../helpers';
import ProductRepository from '../repository/ProductRepositiory';
import { ExpressRequest } from '../util/express';
import ResponseHandler from '../util/response-handler';

export async function createProduct(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  const { name, description, price, quantity, images } = req.body;

  try {
    const user = throwIfUndefined(req.user, 'req.user');

    const nameExists = await ProductRepository.getOneBy({
      name,
      userId: user._id,
    });

    if (nameExists) {
      return ResponseHandler.sendErrorResponse({
        error: `You already have An item with this name (${name})`,
        res,
      });
    }

    const productSku = await ProductRepository.generateSKU();

    const product = await ProductRepository.create({
      name,
      description,
      price,
      quantity,
      sku: productSku,
      userId: user._id,
      images,
    });

    return ResponseHandler.sendSuccessResponse({
      res,
      data: product,
      message: 'Product created successfully',
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateProduct(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  const { productId } = req.params;
  const { name, description, price, quantity, deleted } = req.body;

  try {
    const user = throwIfUndefined(req.user, 'req.user');

    const product = await ProductRepository.getOneBy({
      _id: productId,
      userId: user._id,
    });

    if (!product) {
      return ResponseHandler.sendErrorResponse({
        res,
        error: 'Product not found',
      });
    }

    const updateProduct = await ProductRepository.update({
      product,
      name,
      description,
      price,
      quantity,
      deleted,
    });

    return ResponseHandler.sendSuccessResponse({
      res,
      data: updateProduct,
      message: 'Product updated successfully',
    });
  } catch (error) {
    return next(error);
  }
}
export async function getAllProducts(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
    const products = await ProductRepository.getAllProducts();

    return ResponseHandler.sendSuccessResponse({
      res,
      data: products,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getUserProducts(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
    const user = throwIfUndefined(req.user, 'req.user');

    const products = await ProductRepository.getUserProducts({
      userId: new Types.ObjectId(user._id),
      deleted: false,
    });

    return ResponseHandler.sendSuccessResponse({
      res,
      data: products,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getProductById(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
    const { productId } = req.params;

    const product = await ProductRepository.getOneBy({
      _id: productId,
      deleted: false,
    });

    if (!product) {
      return ResponseHandler.sendErrorResponse({
        res,
        error: 'Product not found',
      });
    }

    return ResponseHandler.sendSuccessResponse({
      res,
      data: product,
    });
  } catch (error) {
    return next(error);
  }
}
