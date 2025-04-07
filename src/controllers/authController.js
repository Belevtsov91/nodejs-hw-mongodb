

import { register } from '../services/authService.js';
import { login } from '../services/authService.js';
import { refreshSession } from '../services/authService.js';
import { logout } from '../services/authService.js';

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
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
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
    res.status(204).send(); // без тіла
  } catch (err) {
    next(err);
  }
};