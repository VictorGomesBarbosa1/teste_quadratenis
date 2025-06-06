const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { sequelize, testConnection } = require('./config/database');
const courtRoutes = require('./routes/courtRoutes');
const { errorHandler } = require('./middlewares/validation');

// Inicializa o app Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.use('/api', courtRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API de Gerenciamento de Quadras de Tênis' });
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Sincroniza o modelo com o banco de dados e inicia o servidor
const startServer = async () => {
  try {
    // Testa a conexão com o banco de dados
    const connected = await testConnection();
    
    if (connected) {
      // Sincroniza os modelos com o banco de dados (não força recriação das tabelas)
      await sequelize.sync({ force: false });
      console.log('Modelos sincronizados com o banco de dados.');
      
      // Inicia o servidor
      app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
        console.log(`Documentação Swagger disponível em: http://localhost:${PORT}/api-docs`);
      });
    } else {
      console.error('Não foi possível iniciar o servidor devido a problemas na conexão com o banco de dados.');
    }
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
  }
};

// Exporta o app para testes
module.exports = { app, startServer };

