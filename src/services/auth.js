import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import userCollection from '../db/models/user.js';
import sessionCollection from '../db/models/session.js';
import { randomBytes } from 'node:crypto';
import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/auth.js';
import jwt from 'jsonwebtoken';
import { SMTP } from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendMail.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { TEMPLATES_DIR } from '../constants/index.js';
// import { log } from 'node:console';
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

export const requestResetToken = async (email) => {
  const user = await userCollection.findOne({ email });
  // console.log(user);

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: getEnvVar(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });
};

export const resetPassword = async (payload) => {
  let entries;

  // console.log(payload);
  // console.log(payload.token);

  const timeToken = jwt.decode(payload.token);

  // console.log(timeToken);
  // console.log(typeof timeToken.exp);
  // console.log(timeToken.exp * 1000);
  // console.log(Date.now());
  // console.log(typeof Date.now());
  // console.log(timeToken.exp * 1000 < Date.now());

  if (timeToken.exp * 1000 < Date.now()) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);

    throw err;
  }

  const user = await userCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });
  // console.log(user);

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }
  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await userCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
  sessionCollection.deleteOne({ _id: user._id });
};
