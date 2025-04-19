import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import userCollection from '../db/models/user.js';
import sessionCollection from '../db/models/session.js';
import { randomBytes } from 'node:crypto';
import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/auth.js';
// console.log(randomBytes(30).toString("base64"));

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  const accessTokenValidUntil = Date.now() + accessTokenLifeTime;
  const refreshTokenValidUntil = Date.now() + refreshTokenLifeTime;

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const findSession = (query) => sessionCollection.findOne(query);

export const findUser = (query) => userCollection.findOne(query);

export const registerUser = async (payload) => {
  const { email, password } = payload;

  const user = await findUser({ email });

  // console.log(user);

  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  return await userCollection.create({ ...payload, password: hashPassword });
};

export const loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await findUser({ email });

  if (!user) {
    throw createHttpError(401, 'email or password invalid');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'email or password invalid');
  }

  await sessionCollection.findOneAndDelete({ userId: user._id });

  const session = createSession();

  // const accessToken = randomBytes(30).toString('base64');
  // const refreshToken = randomBytes(30).toString('base64');

  return sessionCollection.create({
    userId: user._id,
    ...session,
    // accessToken,
    // refreshToken,
    // accessTokenValidUntil: Date.now() + accessTokenLifeTime,
    // refreshTokenValidUntil: Date.now() + refreshTokenLifeTime,
  });
};

export const refreshUser = async ({ refreshToken, sessionId }) => {
  const session = await findSession({ refreshToken, _id: sessionId });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (session.refreshTokenValidUntil < Date.now()) {
    await sessionCollection.findOneAndDelete({ _id: session._id });
    throw createHttpError(401, 'Session token expired');
  }

  await sessionCollection.findOneAndDelete({ _id: session._id });

  const newSession = createSession();

  // const accessToken = randomBytes(30).toString('base64');
  // const refreshToken = randomBytes(30).toString('base64');

  return sessionCollection.create({
    userId: session.userId,
    ...newSession,
    // accessToken,
    // refreshToken,
    // accessTokenValidUntil: Date.now() + accessTokenLifeTime,
    // refreshTokenValidUntil: Date.now() + refreshTokenLifeTime,
  });
};

export const logoutUser = (sessionId) =>
  sessionCollection.deleteOne({ _id: sessionId });
