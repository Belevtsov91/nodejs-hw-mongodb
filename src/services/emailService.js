import createHttpError from 'http-errors';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';


const getSmtpHost = () => process.env.SMTP_HOST;
const getSmtpPort = () => process.env.SMTP_PORT;
const getSmtpUser = () => process.env.SMTP_USER;
const getSmtpPass = () => process.env.SMTP_PASSWORD;
const getSmtpFrom = () => process.env.SMTP_FROM;
const getAppDomain = () => process.env.APP_DOMAIN;
const getResetSecret = () => process.env.JWT_SECRET;


const transporter = nodemailer.createTransport({
  host: getSmtpHost(),
  port: getSmtpPort(),
  secure: false,
  auth: {
    user: getSmtpUser(),
    pass: getSmtpPass(),
  },
});


export const sendResetEmail = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const token = jwt.sign({ email }, getResetSecret(), { expiresIn: '5m' });

  const resetUrl = `${getAppDomain()}/reset-password?token=${token}`;

  const mailOptions = {
    from: getSmtpFrom(),
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email send error:', error.message);
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};
