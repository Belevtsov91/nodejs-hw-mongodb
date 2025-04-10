import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';

import {
  registerUserSchema,
  loginUserSchema,
  sendResetEmailSchema,
  resetPasswordSchema,
} from '../validationSchemas/userSchemas.js';

import {
  handleRegister,
  handleLogin,
  handleRefresh,
  handleSendResetEmail,
  handleResetPassword,
  handleLogout,
} from '../controllers/authController.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(handleRegister)
);

authRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(handleLogin)
);

authRouter.post('/refresh', ctrlWrapper(handleRefresh));

authRouter.post('/logout', ctrlWrapper(handleLogout));

authRouter.post(
  '/send-reset-email',
  validateBody(sendResetEmailSchema),
  ctrlWrapper(handleSendResetEmail)
);

authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(handleResetPassword)
);

export default authRouter;
