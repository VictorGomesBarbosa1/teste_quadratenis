const swaggerJsdoc = require('swagger-jsdoc');

// Opções para a documentação Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gerenciamento de Quadras de Tênis',
      version: '1.0.0',
      description: 'API RESTful para gerenciamento de quadras de tênis',
      contact: {
        name: 'Desenvolvedor',
        email: 'dev@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Servidor de desenvolvimento',
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/models/*.js'], // Arquivos a serem analisados
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

