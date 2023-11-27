import { NextFunction, Response } from 'express';

import * as authHelper from '../helpers/userhelpers';
import UserRepository from '../repository/UserRepository';
import { ExpressRequest } from '../util/express';
import ResponseHandler from '../util/response-handler';
import { validateLogin, validateSignUp } from '../validations/user';

export async function signUp(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  const { firstname, lastname, email, password, phoneNumber } = req.body;

  try {
    const { error } = validateSignUp(req.body);
    if (error) {
      return ResponseHandler.sendErrorResponse({
        res,
        error: error.details[0].message,
      });
    }
    const checkExistingEmail = await UserRepository.getOneBy({ email });

    if (checkExistingEmail) {
      return ResponseHandler.sendErrorResponse({
        res,
        error: 'Email is already taken',
      });
    }

    const createUser = await UserRepository.create({
      firstname,
      lastname,
      email,
      phoneNumber,
      password,
    });

    const token = await authHelper.generateUserBearerToken({
      userID: createUser._id,
    });

    const userDetails = authHelper.pickUserDetails(createUser);

    return ResponseHandler.sendSuccessResponse({
      data: { user: userDetails, token },
      message: 'User account created successfully',
      res,
    });
  } catch (error) {
    return next(error);
  }
}

export async function login(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  const { email, password } = req.body;

  const { error } = validateLogin(req.body);
  if (error) {
    return ResponseHandler.sendErrorResponse({
      res,
      error: error.details[0].message,
    });
  }

  try {
    const user = await UserRepository.getOneBy({ email }, false);

    if (!user || !(await user.comparePassword(password))) {
      return ResponseHandler.sendErrorResponse({
        res,
        error: 'Invalid email/password',
      });
    }

    if (user.deleted) {
      return ResponseHandler.sendErrorResponse({
        error: `Your account has been deactivated, contact the admin`,
        res,
      });
    }
    const token = await authHelper.generateUserBearerToken({
      userID: user._id,
    });

    const userDetails = authHelper.pickUserDetails(user);

    return ResponseHandler.sendSuccessResponse({
      data: {
        user: userDetails,
        token,
      },
      message: 'Login successful',
      res,
    });
  } catch (error) {
    return next(error);
  }
}
