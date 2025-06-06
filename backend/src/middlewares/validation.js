// Middleware para validação de dados
const validateCourtData = (req, res, next) => {
  const { name, location } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Nome é obrigatório e deve ser uma string não vazia' });
  }
  
  if (!location || typeof location !== 'string' || location.trim() === '') {
    return res.status(400).json({ error: 'Localização é obrigatória e deve ser uma string não vazia' });
  }
  
  next();
};

// Middleware para validação de disponibilidade
const validateAvailability = (req, res, next) => {
  const { available } = req.body;
  
  if (available === undefined || typeof available !== 'boolean') {
    return res.status(400).json({ error: 'Disponibilidade é obrigatória e deve ser um booleano' });
  }
  
  next();
};

// Middleware para tratamento de erros
const errorHandler = (err, req, res, next) => {
  console.error('Erro na aplicação:', err);
  
  // Verifica se é um erro do Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: err.message });
  }
  
  // Verifica se é um erro de ID não encontrado
  if (err.name === 'NotFoundError') {
    return res.status(404).json({ error: err.message });
  }
  
  // Erro genérico
  return res.status(500).json({ error: 'Erro interno do servidor' });
};

module.exports = {
  validateCourtData,
  validateAvailability,
  errorHandler
};

