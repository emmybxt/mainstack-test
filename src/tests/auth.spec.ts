import { createMock } from '@golevelup/ts-jest';
import { Response } from 'express';

import { login, signUp } from '../controllers/auth';
import * as authHelper from '../helpers/userhelpers';
import { IUser } from '../models/user';
import UserRepository from '../repository/UserRepository';
import { ExpressRequest } from '../util/express';
import ResponseHandler from '../util/response-handler';

jest.mock('../repository/UserRepository');
jest.mock('../helpers/userhelpers');
jest.mock('../util/response-handler');

describe('Auth Controller', () => {
  const nextFn = jest.fn();
  let resMock: Response;
  let createUserSpy: jest.SpyInstance;
  // let generateUserBearerTokenSpy: jest.SpyInstance;
  let pickUserDetailsSpy: jest.SpyInstance;
  let getOneBySpy: jest.SpyInstance;
  let sendSuccessResponseSpy: jest.SpyInstance;
  let comparePasswordSpy: jest.SpyInstance;
  let user: IUser;

  const fakeObjectId = 'e175cac316a79afdd0ad3afb';

  beforeEach(() => {
    getOneBySpy = jest.spyOn(UserRepository, 'getOneBy');
    createUserSpy = jest.spyOn(UserRepository, 'create');
    // generateUserBearerTokenSpy = jest.spyOn(
    //   authHelper,
    //   'generateUserBearerToken',
    // );
    pickUserDetailsSpy = jest.spyOn(authHelper, 'pickUserDetails');
    sendSuccessResponseSpy = jest.spyOn(ResponseHandler, 'sendSuccessResponse');
    resMock = createMock<Response>();
    resMock.status = jest.fn().mockReturnValue(resMock);

    user = createMock<IUser>({
      firstname: 'emm',
      lastname: 'ooo',
      email: 'testmail@kaka.com',
      password: 'somePassword',
      phoneNumber: '1234567890',
    });

    user._id = fakeObjectId;
    comparePasswordSpy = jest.spyOn(user, 'comparePassword');
  });
  afterEach(jest.resetAllMocks);

  describe('signUp', () => {
    const createPayload = {
      firstname: 'emm',
      lastname: 'ooo',
      email: 'testmail@kaka.com',
      password: 'somePassword',
      phoneNumber: '1234567890',
    };

    const loginPayload = {
      email: 'testmail@kaka.com',
      password: 'somePassword',
    };

    it('should not create a user with an existing email', async () => {
      const user2 = createMock<IUser>({
        email: 'testmail@kaka.com',
      });

      getOneBySpy.mockResolvedValue(user2);

      const req = createMock<ExpressRequest>();
      req.body = createPayload;

      await signUp(req, resMock, nextFn);

      expect(getOneBySpy).toHaveBeenCalled();
      expect(createUserSpy).not.toHaveBeenCalled();
      expect(authHelper.generateUserBearerToken).not.toHaveBeenCalled();
      expect(authHelper.pickUserDetails).not.toHaveBeenCalled();
      expect(sendSuccessResponseSpy).not.toHaveBeenCalled();
    });

    it("should pass to create a new user if the email doesn't exist", async () => {
      getOneBySpy.mockResolvedValue(null);

      // Mock UserRepository.create to return a user
      const createdUser = createMock<IUser>({ _id: 'someUserId' });
      createUserSpy.mockResolvedValue(createdUser);

      // Mock authHelper.generateUserBearerToken to return a token
      const mockToken = 'someToken';
      (authHelper.generateUserBearerToken as jest.Mock).mockResolvedValueOnce(
        mockToken,
      );

      // Mock authHelper.pickUserDetails to return user details
      const userDetails = createMock<IUser>(createPayload);
      pickUserDetailsSpy.mockReturnValue(userDetails);
      const req = createMock<ExpressRequest>();
      req.body = createPayload;

      await signUp(req, resMock, nextFn);

      expect(getOneBySpy).toHaveBeenCalled();
      expect(createUserSpy).toHaveBeenCalled();
      expect(authHelper.generateUserBearerToken).toHaveBeenCalledWith({
        userID: 'someUserId',
      });
      expect(pickUserDetailsSpy).toHaveBeenCalledWith(req.body);
    });

    it('should successfully log in a user', async () => {
      const user = createMock<IUser>({ _id: 'someUserId' });
      getOneBySpy.mockResolvedValue(user);

      comparePasswordSpy.mockResolvedValue(true);

      const mockToken = 'someToken';
      (authHelper.generateUserBearerToken as jest.Mock).mockResolvedValueOnce(
        mockToken,
      );
      const userDetails = createMock<IUser>(loginPayload);
      pickUserDetailsSpy.mockReturnValue(userDetails);

      const req = createMock<ExpressRequest>();
      req.body = { email: 'test@example.com', password: 'somePassword' };

      await login(req, resMock, nextFn);

      expect(getOneBySpy).toHaveBeenCalledWith(
        { email: req.body.email },
        false,
      );
      expect(resMock.status).not.toHaveBeenCalled();
      expect(nextFn).not.toHaveBeenCalled();
    });

    it('should handle invalid email/password', async () => {
      getOneBySpy.mockResolvedValue(null);

      const req = createMock<ExpressRequest>();
      req.body = { email: 'wowowow@tessks.com', password: 'somePassword' };

      await login(req, resMock, nextFn);

      // Assertions
      expect(getOneBySpy).toHaveBeenCalled();
      expect(resMock.status).not.toHaveBeenCalled();
      expect(nextFn).not.toHaveBeenCalled();
    });
  });
});
