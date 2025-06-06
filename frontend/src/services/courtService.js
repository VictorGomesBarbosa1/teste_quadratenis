import axios from 'axios';

// Configuração base do axios
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Serviços para operações CRUD de quadras
const courtService = {
  // Buscar todas as quadras (com filtro opcional de disponibilidade)
  async getAllCourts(available = null) {
    const params = available !== null ? { available } : {};
    const response = await api.get('/courts', { params });
    return response.data;
  },
  
  // Buscar uma quadra por ID
  async getCourtById(id) {
    const response = await api.get(`/courts/${id}`);
    return response.data;
  },
  
  // Criar uma nova quadra
  async createCourt(courtData) {
    const response = await api.post('/courts', courtData);
    return response.data;
  },
  
  // Atualizar uma quadra existente
  async updateCourt(id, courtData) {
    const response = await api.put(`/courts/${id}`, courtData);
    return response.data;
  },
  
  // Atualizar apenas a disponibilidade de uma quadra
  async updateCourtAvailability(id, available) {
    const response = await api.patch(`/courts/${id}/availability`, { available });
    return response.data;
  },
  
  // Excluir uma quadra
  async deleteCourt(id) {
    await api.delete(`/courts/${id}`);
    return true;
  }
};

export default courtService;

