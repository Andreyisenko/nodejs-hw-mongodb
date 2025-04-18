import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import userCollection from '../db/models/user.js';

export const registerUser = async (payload) => {
  const { email, password } = payload;

  const user = await userCollection.findOne({ email });
  // console.log(user);

  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  return await userCollection.create({ ...payload, password: hashPassword });
};

export const loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await userCollection.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'email or password invalid');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'email or password invalid');
  }


  
};
