import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courtService from '../services/courtService';
import { Form, Button, Card } from 'react-bootstrap';

const CourtForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    available: true
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Carrega os dados da quadra se estiver no modo de edição
  useEffect(() => {
    const loadCourt = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const court = await courtService.getCourtById(id);
          setFormData({
            name: court.name,
            location: court.location,
            available: court.available
          });
          setError(null);
        } catch (err) {
          setError('Erro ao carregar os dados da quadra.');
          console.error('Erro ao carregar quadra:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadCourt();
  }, [id, isEditMode]);
  
  // Atualiza o estado do formulário quando os campos são alterados
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Envia o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.name.trim() || !formData.location.trim()) {
      setError('Nome e localização são obrigatórios.');
      return;
    }
    
    try {
      setLoading(true);
      
      if (isEditMode) {
        // Atualiza uma quadra existente
        await courtService.updateCourt(id, formData);
      } else {
        // Cria uma nova quadra
        await courtService.createCourt(formData);
      }
      
      // Redireciona para a lista após o sucesso
      navigate('/');
    } catch (err) {
      setError(`Erro ao ${isEditMode ? 'atualizar' : 'criar'} a quadra.`);
      console.error(`Erro ao ${isEditMode ? 'atualizar' : 'criar'} quadra:`, err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>
          <h2>{isEditMode ? 'Editar Quadra' : 'Adicionar Nova Quadra'}</h2>
        </Card.Header>
        <Card.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Digite o nome da quadra"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Localização</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Digite a localização da quadra"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="available"
                label="Disponível para uso"
                checked={formData.available}
                onChange={handleChange}
              />
            </Form.Group>
            
            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button variant="secondary" onClick={() => navigate('/')}>
                Cancelar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CourtForm;

