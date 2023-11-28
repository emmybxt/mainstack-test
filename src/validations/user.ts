import Joi from 'joi';

import { NextFunction, Response } from 'express';
import { ExpressRequest } from '../util/express';
import ResponseHandler from '../util/response-handler';

export async function validateSignUp(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  const schema = Joi.object()
    .keys({
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string(),
      phoneNumber: Joi.string()
        .regex(/^234[0-9]{10}$/)
        .required(),
    })
    .unknown(true);

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

export async function validateLogin(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  const schema = Joi.object()
    .keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    })
    .unknown(true);

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
