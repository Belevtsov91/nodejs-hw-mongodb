import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';
import { sendEmail } from './sendEmail.js';

const getResetSecret = () => process.env.JWT_SECRET;
const APP_DOMAIN = process.env.APP_DOMAIN;

export const sendResetEmail = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const token = jwt.sign({ email }, getResetSecret(), { expiresIn: '5m' });
  const resetUrl = `${APP_DOMAIN}/reset-password?token=${token}`;

  const html = `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`;

  try {
    await sendEmail({
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    console.error('Email send error:', error.message);
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};
