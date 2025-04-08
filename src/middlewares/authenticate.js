import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { Session } from '../models/sessionModel.js';
import { User } from '../models/userModel.js';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw createHttpError(401, 'Access token is missing');
    }

    let payload;
    try {
      payload = jwt.verify(token, ACCESS_SECRET);
    } catch {
      
      throw createHttpError(401, 'Access token expired');
    }

    const session = await Session.findOne({ accessToken: token });

    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    const user = await User.findById(payload.userId);

    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
