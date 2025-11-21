import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pet Adoption API',
      version: '1.0.0',
      description: 'API documentation for the Pet Adoption backend',
    },
    servers: [
      {
        url: process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`,
      },
    ],
  },
  // Use absolute paths so swagger-jsdoc reliably finds files regardless of CWD
  apis: [
    path.join(__dirname, '..', 'routes', '**', '*.js'),
    path.join(__dirname, '..', 'models', '**', '*.js'),
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
