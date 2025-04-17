import createHttpError from 'http-errors';
import userCollection from '../db/models/user.js';

export const registerUser = async (payload) => {
  const { email } = payload;

  const user = await userCollection.find({ email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  return await userCollection.create(payload);
};
