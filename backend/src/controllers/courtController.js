const Court = require('../models/Court');

// Controller para operações CRUD de quadras
const courtController = {
  // Criar uma nova quadra
  async create(req, res) {
    try {
      const { name, location } = req.body;
      
      // Validação básica
      if (!name || !location) {
        return res.status(400).json({ error: 'Nome e localização são obrigatórios' });
      }
      
      const court = await Court.create({
        name,
        location,
        available: true,
        created_at: new Date(),
        updated_at: new Date()
      });
      
      return res.status(201).json(court);
    } catch (error) {
      console.error('Erro ao criar quadra:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },
  
  // Listar todas as quadras (com filtro opcional de disponibilidade)
  async findAll(req, res) {
    try {
      const { available } = req.query;
      let where = {};
      
      // Se o parâmetro available estiver presente, filtra por disponibilidade
      if (available !== undefined) {
        where.available = available === 'true';
      }
      
      const courts = await Court.findAll({ where });
      return res.json(courts);
    } catch (error) {
      console.error('Erro ao listar quadras:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },
  
  // Buscar uma quadra por ID
  async findById(req, res) {
    try {
      const { id } = req.params;
      const court = await Court.findByPk(id);
      
      if (!court) {
        return res.status(404).json({ error: 'Quadra não encontrada' });
      }
      
      return res.json(court);
    } catch (error) {
      console.error('Erro ao buscar quadra:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },
  
  // Atualizar uma quadra
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, location, available } = req.body;
      
      const court = await Court.findByPk(id);
      
      if (!court) {
        return res.status(404).json({ error: 'Quadra não encontrada' });
      }
      
      // Validação básica
      if (!name || !location) {
        return res.status(400).json({ error: 'Nome e localização são obrigatórios' });
      }
      
      await court.update({
        name,
        location,
        available: available !== undefined ? available : court.available,
        updated_at: new Date()
      });
      
      return res.json(court);
    } catch (error) {
      console.error('Erro ao atualizar quadra:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },
  
  // Atualizar apenas a disponibilidade de uma quadra
  async updateAvailability(req, res) {
    try {
      const { id } = req.params;
      const { available } = req.body;
      
      const court = await Court.findByPk(id);
      
      if (!court) {
        return res.status(404).json({ error: 'Quadra não encontrada' });
      }
      
      // Validação básica
      if (available === undefined) {
        return res.status(400).json({ error: 'Disponibilidade é obrigatória' });
      }
      
      await court.update({
        available,
        updated_at: new Date()
      });
      
      return res.json(court);
    } catch (error) {
      console.error('Erro ao atualizar disponibilidade da quadra:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },
  
  // Excluir uma quadra
  async delete(req, res) {
    try {
      const { id } = req.params;
      const court = await Court.findByPk(id);
      
      if (!court) {
        return res.status(404).json({ error: 'Quadra não encontrada' });
      }
      
      await court.destroy();
      
      return res.status(204).end();
    } catch (error) {
      console.error('Erro ao excluir quadra:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};

module.exports = courtController;

