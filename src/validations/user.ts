import Joi from 'joi';

import { IUser } from '../models/user';

export const validateSignUp = (payload: IUser) => {
  const schema = Joi.object().keys({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string(),
    enableEmailNotifications: Joi.boolean().required(),
    phoneNumber: Joi.string()
      .regex(/^234[0-9]{10}$/)
      .required(),
  });

  return schema.validate(payload);
};

export const validateLogin = (payload: IUser) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(payload);
};
