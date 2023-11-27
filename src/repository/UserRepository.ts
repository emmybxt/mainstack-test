import bcrypt from 'bcrypt';

import { SALT_ROUNDS } from '../config/env';
import { IUser, User } from '../models/user';

class UserRepository {
  public async create({
    firstname,
    lastname,
    email,
    password,
    phoneNumber,
  }: {
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    password?: string;
  }): Promise<IUser> {
    const data: any = {
      firstname,
      lastname,
      email,
      phoneNumber,
    };

    if (password) {
      const salt = await bcrypt.genSalt(parseInt(`${SALT_ROUNDS}`));

      const hashedPassword = await bcrypt.hash(password, salt);

      data.password = hashedPassword;
    }
    const createUser = new User(data);

    return createUser.save();
  }

  public async update({
    user,
    firstname,
    lastname,
    email,
    password,
    phoneNumber,
    deleted,
  }: {
    user: IUser;
    firstname?: string;
    lastname?: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
    deleted?: true;
  }): Promise<IUser> {
    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (email) user.email = email;
    if (deleted === true) {
      user.deleted = deleted;

      user.deletedAt = new Date();
    }
    if (password) {
      const salt = await bcrypt.genSalt(parseInt(`${SALT_ROUNDS}`));
      user.password = await bcrypt.hash(password, salt);
    }

    return user.save();
  }

  public async getOneBy(
    query: object,
    leanVersion?: boolean,
  ): Promise<IUser | null> {
    return await User.findOne(query).lean(leanVersion);
  }
}

export default new UserRepository();
