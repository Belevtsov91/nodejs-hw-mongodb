import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

export const setupServer = () => {
  const app = express();

  
  app.use(cors());
  app.use(pino());
  app.use(express.json());

  
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};
