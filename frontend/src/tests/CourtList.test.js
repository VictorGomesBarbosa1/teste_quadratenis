import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CourtList from '../components/CourtList';
import courtService from '../services/courtService';

// Mock do serviço de quadras
jest.mock('../services/courtService');

const mockCourts = [
  { id: 1, name: 'Quadra 1', location: 'Local 1', available: true },
  { id: 2, name: 'Quadra 2', location: 'Local 2', available: false },
];

describe('CourtList Component', () => {
  beforeEach(() => {
    courtService.getAllCourts.mockResolvedValue(mockCourts);
    courtService.updateCourtAvailability.mockResolvedValue({});
    courtService.deleteCourt.mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('deve renderizar a lista de quadras', async () => {
    render(
      <BrowserRouter>
        <CourtList />
      </BrowserRouter>
    );

    // Verifica se o título está presente
    expect(screen.getByText('Quadras de Tênis')).toBeInTheDocument();

    // Aguarda a lista de quadras ser carregada
    await waitFor(() => {
      expect(screen.getByText('Quadra 1')).toBeInTheDocument();
      expect(screen.getByText('Quadra 2')).toBeInTheDocument();
    });

    // Verifica se o serviço foi chamado corretamente
    expect(courtService.getAllCourts).toHaveBeenCalledTimes(1);
  });

  test('deve filtrar quadras disponíveis quando o checkbox for marcado', async () => {
    render(
      <BrowserRouter>
        <CourtList />
      </BrowserRouter>
    );

    // Aguarda a lista de quadras ser carregada
    await waitFor(() => {
      expect(screen.getByText('Quadra 1')).toBeInTheDocument();
    });

    // Simula a marcação do checkbox de filtro
    const filterCheckbox = screen.getByLabelText('Mostrar apenas quadras disponíveis');
    fireEvent.click(filterCheckbox);

    // Verifica se o serviço foi chamado com o filtro correto
    expect(courtService.getAllCourts).toHaveBeenCalledWith(true);
  });

  test('deve alternar a disponibilidade de uma quadra', async () => {
    render(
      <BrowserRouter>
        <CourtList />
      </BrowserRouter>
    );

    // Aguarda a lista de quadras ser carregada
    await waitFor(() => {
      expect(screen.getByText('Quadra 1')).toBeInTheDocument();
    });

    // Encontra o botão de alternar disponibilidade da primeira quadra
    const toggleButton = screen.getByText('Marcar como Indisponível');
    fireEvent.click(toggleButton);

    // Verifica se o serviço foi chamado corretamente
    expect(courtService.updateCourtAvailability).toHaveBeenCalledWith(1, false);
  });

  test('deve excluir uma quadra após confirmação', async () => {
    // Mock da função confirm do window
    window.confirm = jest.fn(() => true);

    render(
      <BrowserRouter>
        <CourtList />
      </BrowserRouter>
    );

    // Aguarda a lista de quadras ser carregada
    await waitFor(() => {
      expect(screen.getByText('Quadra 1')).toBeInTheDocument();
    });

    // Encontra o botão de excluir da primeira quadra
    const deleteButtons = screen.getAllByText('Excluir');
    fireEvent.click(deleteButtons[0]);

    // Verifica se a confirmação foi solicitada
    expect(window.confirm).toHaveBeenCalledWith('Tem certeza que deseja excluir esta quadra?');

    // Verifica se o serviço foi chamado corretamente
    expect(courtService.deleteCourt).toHaveBeenCalledWith(1);
  });
});

