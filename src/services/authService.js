import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

import { User } from '../models/userModel.js';
import { Session } from '../models/sessionModel.js';

const getAccessSecret = () => process.env.JWT_ACCESS_SECRET;
const getRefreshSecret = () => process.env.JWT_REFRESH_SECRET;

export const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return newUser;
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createHttpError(401, 'Invalid email or password');
  }

  await Session.deleteOne({ userId: user._id });

 const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes 
  

  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  const accessToken = jwt.sign({ userId: user._id }, getAccessSecret(), {
     expiresIn: '15m', 
    
  });

  const refreshToken = jwt.sign({ userId: user._id }, getRefreshSecret(), {
    expiresIn: '30d',
  });

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken };
};

export const refreshSession = async (token) => {
  if (!token) {
    throw createHttpError(401, 'Refresh token missing');
  }

  let payload;
  try {
    payload = jwt.verify(token, getRefreshSecret());
  } catch (error) {
    console.error('JWT verify failed:', error.message);
    throw createHttpError(401, 'Invalid refresh token');
  }

  const session = await Session.findOne({ refreshToken: token });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  await Session.deleteOne({ _id: session._id });

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes  
  

  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  const newAccessToken = jwt.sign(
    { userId: payload.userId },
    getAccessSecret(),
    {
      expiresIn: '15m',
     
    }
  );

  const newRefreshToken = jwt.sign(
    { userId: payload.userId },
    getRefreshSecret(),
    {
      expiresIn: '30d',
    }
  );

  await Session.create({
    userId: payload.userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return {
    accessToken: newAccessToken,
    newRefreshToken,
  };
};

export const logout = async (refreshToken) => {
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token missing');
  }

  const session = await Session.findOne({ refreshToken });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  await Session.deleteOne({ _id: session._id });
};
