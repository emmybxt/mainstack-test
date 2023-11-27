import jwt from 'jsonwebtoken';
import { pick } from 'lodash';

import { TOKEN_SECRET } from '../config/env';
import { getRedisConnection } from '../config/redis';

function setSessionRedisKey(token: string) {
  return `SESSION~${token}`;
}
export const THIRTY_MINUTES = 30 * 60;

export async function isTokenValid(token: string): Promise<boolean> {
  const key = setSessionRedisKey(token);

  const value = await getRedisConnection().get(key);
  if (!value) return false;

  return true;
}

export const invalidateToken = async (token: string) => {
  const key = setSessionRedisKey(token);
  await getRedisConnection().del(key);
};

export async function generateUserBearerToken({
  userID,
}: {
  userID: string;
}): Promise<string> {
  const sessionExpiry = 86400;
  const sessionDuration = 24;

  const token = jwt.sign({ id: userID }, TOKEN_SECRET as string, {
    expiresIn: `${sessionDuration}h`,
  });

  const key = setSessionRedisKey(token);

  await getRedisConnection().set(key, token, 'EX', sessionExpiry);

  return token;
}
export function pickUserDetails(user: any, fields?: any[]) {
  const selectFields =
    fields === undefined
      ? [
          '_id',
          'firstname',
          'lastname',
          'email',
          'createdAt',
          'updatedAt',
          'phoneNumber',
        ]
      : fields;
  return pick(user, selectFields);
}
