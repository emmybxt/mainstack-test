import express from 'express';

import * as authController from '../controllers/auth';
import * as authvalidator from '../validations/user';
const router = express.Router();

router.post('/signup', authvalidator.validateSignUp, authController.signUp);

router.post('/login', authvalidator.validateLogin, authController.login);

export default router;
