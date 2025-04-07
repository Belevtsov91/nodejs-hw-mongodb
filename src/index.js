import dotenv from 'dotenv';
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

dotenv.config();


console.log('ACCESS_SECRET:', process.env.JWT_ACCESS_SECRET);
console.log('REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET);

const startApp = async () => {
  await initMongoConnection();  
  setupServer();                
};

startApp();
