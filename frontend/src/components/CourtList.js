import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import courtService from '../services/courtService';
import { Table, Button, Form } from 'react-bootstrap';

const CourtList = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterAvailable, setFilterAvailable] = useState(false);
  
  // Função para carregar as quadras
  const loadCourts = async (filterByAvailable = false) => {
    try {
      setLoading(true);
      const data = await courtService.getAllCourts(filterByAvailable ? true : null);
      setCourts(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar as quadras. Por favor, tente novamente.');
      console.error('Erro ao carregar quadras:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Carrega as quadras ao montar o componente
  useEffect(() => {
    loadCourts(filterAvailable);
  }, [filterAvailable]);
  
  // Função para alternar a disponibilidade de uma quadra
  const handleToggleAvailability = async (id, currentAvailability) => {
    try {
      await courtService.updateCourtAvailability(id, !currentAvailability);
      // Recarrega a lista após a atualização
      loadCourts(filterAvailable);
    } catch (err) {
      setError('Erro ao atualizar a disponibilidade da quadra.');
      console.error('Erro ao atualizar disponibilidade:', err);
    }
  };
  
  // Função para excluir uma quadra
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta quadra?')) {
      try {
        await courtService.deleteCourt(id);
        // Recarrega a lista após a exclusão
        loadCourts(filterAvailable);
      } catch (err) {
        setError('Erro ao excluir a quadra.');
        console.error('Erro ao excluir quadra:', err);
      }
    }
  };
  
  // Função para alternar o filtro de disponibilidade
  const handleFilterChange = (e) => {
    setFilterAvailable(e.target.checked);
  };
  
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quadras de Tênis</h2>
        <Link to="/add" className="btn btn-primary">
          Adicionar Nova Quadra
        </Link>
      </div>
      
      <Form.Check 
        type="checkbox"
        id="filter-available"
        label="Mostrar apenas quadras disponíveis"
        checked={filterAvailable}
        onChange={handleFilterChange}
        className="mb-3"
      />
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {loading ? (
        <p>Carregando...</p>
      ) : courts.length === 0 ? (
        <p>Nenhuma quadra encontrada.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Localização</th>
              <th>Disponibilidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {courts.map((court) => (
              <tr key={court.id}>
                <td>{court.id}</td>
                <td>{court.name}</td>
                <td>{court.location}</td>
                <td>
                  <span className={`badge ${court.available ? 'bg-success' : 'bg-danger'}`}>
                    {court.available ? 'Disponível' : 'Indisponível'}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <Button
                      variant={court.available ? 'warning' : 'success'}
                      size="sm"
                      onClick={() => handleToggleAvailability(court.id, court.available)}
                    >
                      {court.available ? 'Marcar como Indisponível' : 'Marcar como Disponível'}
                    </Button>
                    <Link to={`/edit/${court.id}`} className="btn btn-info btn-sm">
                      Editar
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(court.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default CourtList;

