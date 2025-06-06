const request = require('supertest');
const { app } = require('../src/app');
const Court = require('../src/models/Court');

// Mock do modelo Court
jest.mock('../src/models/Court', () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

describe('Court API', () => {
  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    jest.clearAllMocks();
  });

  describe('GET /api/courts', () => {
    it('deve retornar todas as quadras', async () => {
      const mockCourts = [
        { id: 1, name: 'Quadra 1', location: 'Local 1', available: true },
        { id: 2, name: 'Quadra 2', location: 'Local 2', available: false },
      ];
      
      Court.findAll.mockResolvedValue(mockCourts);
      
      const response = await request(app).get('/api/courts');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCourts);
      expect(Court.findAll).toHaveBeenCalledWith({ where: {} });
    });
    
    it('deve filtrar quadras por disponibilidade', async () => {
      const mockCourts = [
        { id: 1, name: 'Quadra 1', location: 'Local 1', available: true },
      ];
      
      Court.findAll.mockResolvedValue(mockCourts);
      
      const response = await request(app).get('/api/courts?available=true');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCourts);
      expect(Court.findAll).toHaveBeenCalledWith({ where: { available: true } });
    });
  });
  
  describe('GET /api/courts/:id', () => {
    it('deve retornar uma quadra específica', async () => {
      const mockCourt = { id: 1, name: 'Quadra 1', location: 'Local 1', available: true };
      
      Court.findByPk.mockResolvedValue(mockCourt);
      
      const response = await request(app).get('/api/courts/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCourt);
      expect(Court.findByPk).toHaveBeenCalledWith('1');
    });
    
    it('deve retornar 404 se a quadra não existir', async () => {
      Court.findByPk.mockResolvedValue(null);
      
      const response = await request(app).get('/api/courts/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
  
  describe('POST /api/courts', () => {
    it('deve criar uma nova quadra', async () => {
      const courtData = { name: 'Nova Quadra', location: 'Novo Local' };
      const mockCreatedCourt = { id: 3, ...courtData, available: true };
      
      Court.create.mockResolvedValue(mockCreatedCourt);
      
      const response = await request(app)
        .post('/api/courts')
        .send(courtData);
      
      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCreatedCourt);
      expect(Court.create).toHaveBeenCalled();
    });
    
    it('deve retornar 400 se os dados forem inválidos', async () => {
      const response = await request(app)
        .post('/api/courts')
        .send({ name: '' });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
  
  describe('PUT /api/courts/:id', () => {
    it('deve atualizar uma quadra existente', async () => {
      const courtData = { name: 'Quadra Atualizada', location: 'Local Atualizado', available: false };
      const mockCourt = { 
        id: 1, 
        ...courtData,
        update: jest.fn().mockResolvedValue({ id: 1, ...courtData })
      };
      
      Court.findByPk.mockResolvedValue(mockCourt);
      
      const response = await request(app)
        .put('/api/courts/1')
        .send(courtData);
      
      expect(response.status).toBe(200);
      expect(Court.findByPk).toHaveBeenCalledWith('1');
      expect(mockCourt.update).toHaveBeenCalled();
    });
    
    it('deve retornar 404 se a quadra não existir', async () => {
      Court.findByPk.mockResolvedValue(null);
      
      const response = await request(app)
        .put('/api/courts/999')
        .send({ name: 'Quadra Atualizada', location: 'Local Atualizado' });
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
  
  describe('PATCH /api/courts/:id/availability', () => {
    it('deve atualizar a disponibilidade de uma quadra', async () => {
      const mockCourt = { 
        id: 1, 
        name: 'Quadra 1', 
        location: 'Local 1', 
        available: true,
        update: jest.fn().mockResolvedValue({ id: 1, name: 'Quadra 1', location: 'Local 1', available: false })
      };
      
      Court.findByPk.mockResolvedValue(mockCourt);
      
      const response = await request(app)
        .patch('/api/courts/1/availability')
        .send({ available: false });
      
      expect(response.status).toBe(200);
      expect(Court.findByPk).toHaveBeenCalledWith('1');
      expect(mockCourt.update).toHaveBeenCalled();
    });
  });
  
  describe('DELETE /api/courts/:id', () => {
    it('deve excluir uma quadra', async () => {
      const mockCourt = { 
        id: 1, 
        destroy: jest.fn().mockResolvedValue(undefined)
      };
      
      Court.findByPk.mockResolvedValue(mockCourt);
      
      const response = await request(app).delete('/api/courts/1');
      
      expect(response.status).toBe(204);
      expect(Court.findByPk).toHaveBeenCalledWith('1');
      expect(mockCourt.destroy).toHaveBeenCalled();
    });
    
    it('deve retornar 404 se a quadra não existir', async () => {
      Court.findByPk.mockResolvedValue(null);
      
      const response = await request(app).delete('/api/courts/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
});

