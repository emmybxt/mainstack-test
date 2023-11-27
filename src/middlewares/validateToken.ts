import { NextFunction, Response } from 'express';
import Joi from 'joi';
import jwt from 'jsonwebtoken';

import { TOKEN_SECRET } from '../config/env';
import { throwIfUndefined } from '../helpers';
import * as authHelper from '../helpers/userhelpers';
import UserRepository from '../repository/UserRepository';
import { ExpressRequest } from '../util/express';
import ResponseHandler from '../util/response-handler';

export async function validateToken(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> {
  let { authorization } = req.headers;

  const schema = Joi.object()
    .keys({
      authorization: Joi.string()
        .regex(/^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
        .required()
        .label('authorization [header]'),
    })
    .unknown(true);
  const validation = schema.validate(req.headers);
  if (validation.error) {
    return ResponseHandler.sendErrorResponse({
      res,
      error: validation.error.details[0].message,
    });
  }

  try {
    authorization = throwIfUndefined(authorization, 'authorization');

    const [, token] = authorization.split('Bearer ');
    let decoded: { id: string };

    try {
      decoded = jwt.verify(token, `${TOKEN_SECRET}`) as {
        id: string;
      };
    } catch {
      return ResponseHandler.sendErrorResponse({
        error: `You're not authorized to carry out this operation. Kindly log out and login with authorized credentials`,
        res,
        status: 401,
      });
    }

    const status = await authHelper.isTokenValid(token);
    if (!status) {
      return ResponseHandler.sendErrorResponse({
        error: `You're not authorized to carry out this operation. Kindly log out and login with authorized credentials`,
        res,
        status: 401,
      });
    }

    const user = await UserRepository.getOneBy({
      _id: decoded.id,
      deleted: false,
    });

    if (!user) {
      return ResponseHandler.sendErrorResponse({
        error: `You're not authorized to carry out this operation. Kindly log out and login with authorized credentials`,
        res,
        status: 401,
      });
    }

    if (user.deleted) {
      return ResponseHandler.sendErrorResponse({
        error: `Your account has been deactivated, please contact support if it was an error.",
          `,
        res,
        status: 401,
      });
    }
    req.user = user;

    return next();
  } catch (error) {
    return next(error);
  }
}
