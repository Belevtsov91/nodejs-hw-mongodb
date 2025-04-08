import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { register } from '../services/authService.js';
import { login } from '../services/authService.js';
import { refreshSession } from '../services/authService.js';
import { logout } from '../services/authService.js';
import { sendResetEmail } from '../services/emailService.js';
import { User } from '../models/userModel.js';
import { Session } from '../models/sessionModel.js';

const getResetSecret = () => process.env.JWT_SECRET;

export const handleRegister = async (req, res) => {
  const newUser = await register(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    },
  });
};

export const handleLogin = async (req, res) => {
  const { accessToken, refreshToken } = await login(req.body);

  res
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: { accessToken },
    });
};

export const handleRefresh = async (req, res) => {
  const { refreshToken } = req.cookies;

  const { accessToken, newRefreshToken } = await refreshSession(refreshToken);

  res
    .cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
};

export const handleLogout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    await logout(refreshToken);
    res.clearCookie('refreshToken');
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const handleSendResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    await sendResetEmail(email);
    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

export const handleResetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    let payload;
    try {
      payload = jwt.verify(token, getResetSecret());
    } catch {
      throw createHttpError(401, 'Token is expired or invalid.');
    }

    const user = await User.findOne({ email: payload.email });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    await Session.deleteOne({ userId: user._id });

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
