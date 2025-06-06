const { Sequelize } = require('sequelize');

// Configuração da conexão com o banco de dados PostgreSQL
const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/tennis_courts', {
  dialect: 'postgres',
  logging: false, // Desativa logs de SQL no console
  define: {
    timestamps: false, // Desativa timestamps automáticos (vamos gerenciar manualmente)
    underscored: true, // Usa snake_case para nomes de colunas
  },
});

// Função para testar a conexão
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    return true;
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection,
};

