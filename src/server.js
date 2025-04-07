import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import authRouter from './routers/authRouter.js';
import cookieParser from 'cookie-parser';

import contactsRouter from './routers/contactsRouter.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());

  
  app.use(cookieParser());

  
  app.use('/auth', authRouter);

  
  app.use('/contacts', contactsRouter);

  
  app.use(notFoundHandler);

  
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};
