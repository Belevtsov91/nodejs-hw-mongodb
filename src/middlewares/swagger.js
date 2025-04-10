import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES-модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Шлях до згенерованого JSON (через redocly)
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../docs/swagger.json'), 'utf-8')
);

export const swaggerServe = swaggerUi.serve;
export const swaggerSetup = swaggerUi.setup(swaggerDocument);
