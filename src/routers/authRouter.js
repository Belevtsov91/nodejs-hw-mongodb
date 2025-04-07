

import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerUserSchema } from '../validationSchemas/userSchemas.js';
import { handleRegister } from '../controllers/authController.js';
import { handleLogin } from '../controllers/authController.js';
import { loginUserSchema } from '../validationSchemas/userSchemas.js';
import { handleRefresh } from '../controllers/authController.js';

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

export default authRouter;
