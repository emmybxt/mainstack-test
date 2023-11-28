import Joi from 'joi';

import { NextFunction, Response } from 'express';
import { ExpressRequest } from '../util/express';
import ResponseHandler from '../util/response-handler';

export async function validateCreateProduct(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
    images: Joi.array().items(Joi.string()).required(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    const error = validation.error.message
      ? validation.error.message
      : validation.error.details[0].message;
    return ResponseHandler.sendErrorResponse({
      error,
      res,
    });
  }
  return next();
}

export async function validateUpdateProduct(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  const schema = Joi.object().keys({
    productId: Joi.string().length(24).required(),
    name: Joi.string(),
    description: Joi.string(),
    price: Joi.number(),
    quantity: Joi.number(),
    images: Joi.array().items(Joi.string()),
  });

  const validation = schema.validate({ ...req.body, ...req.params });

  if (validation.error) {
    const error = validation.error.message
      ? validation.error.message
      : validation.error.details[0].message;
    return ResponseHandler.sendErrorResponse({
      error,
      res,
    });
  }
  return next();
}
export async function validateGetProductById(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  const schema = Joi.object().keys({
    productId: Joi.string().length(24).required(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    const error = validation.error.message
      ? validation.error.message
      : validation.error.details[0].message;
    return ResponseHandler.sendErrorResponse({
      error,
      res,
    });
  }
  return next();
}
