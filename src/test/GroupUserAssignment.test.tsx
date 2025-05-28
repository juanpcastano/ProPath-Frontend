import { useState } from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'; // Importa vi de vitest


function GroupUserAssignment({ users, groupId, currentUserRole }: any) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [_success, setSuccess] = useState(false);

  const eligibleUsers = users.filter((u: any) => u.role === 'p');

  const handleSubmit = async () => {
    if (!selectedUser) return;
    setLoading(true);
    setError('');
    try {
      await AddUserToGroup(selectedUser, groupId);
      setSuccess(true);
      setModalOpen(false);
    } catch (e) {
      setError('Error al añadir');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {currentUserRole === 'admin' && (
        <button onClick={() => setModalOpen(true)}>Añadir usuario</button>
      )}

      {modalOpen && (
        <div>
          <select
            role="combobox"
            onChange={(e) => setSelectedUser(e.target.value)}
            value={selectedUser}
          >
            <option value="">Seleccione usuario</option>
            {eligibleUsers.map((user: any) => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
          <button onClick={handleSubmit} disabled={!selectedUser}>
            {loading ? 'Añadiendo usuario...' : 'Confirmar'}
          </button>
          <button onClick={() => setModalOpen(false)}>Cancelar</button>
          {error && <p>{error}</p>}
        </div>
      )}
    </div>
  );
}

const AddUserToGroup = vi.fn();

describe('HU11.3 - Asignación de miembros a grupos (sin dependencias)', () => {
  const groupId = 'grupo-001';
  const users = [
    { id: '1', name: 'Juan Pérez', role: 'p' },
    { id: '2', name: 'Ana Admin', role: 'a' },
    { id: '3', name: 'Carlos Colaborador', role: 'p' }
  ];

  // Limpiamos los mocks antes de cada test
  beforeEach(() => {
    vi.clearAllMocks(); // CAMBIO: vi.clearAllMocks() en lugar de jest.clearAllMocks()
  });

  // Limpiamos el DOM después de cada test (ya estaba bien)
  afterEach(cleanup);

  it('muestra el botón si el rol es admin', () => {
    render(<GroupUserAssignment users={users} groupId={groupId} currentUserRole="admin" />);
    // Testing Library busca por texto visible, 'Añadir usuario' es más robusto que /edit/i si 'edit' es un icono o parte de una fuente de iconos.
    // Si 'edit' es el texto real de un botón, entonces la expresión regular es correcta.
    // Asumiendo que el botón es "Añadir usuario"
    expect(screen.getByText(/Añadir usuario/i)).toBeInTheDocument();
  });

  it('no muestra el botón si el rol NO es admin', () => {
    render(<GroupUserAssignment users={users} groupId={groupId} currentUserRole="p" />);
    // Asumiendo que el botón es "Añadir usuario"
    expect(screen.queryByText(/Añadir usuario/i)).not.toBeInTheDocument();
  });

  it('muestra solo usuarios con rol "p" en la lista', async () => { // Añadido async
    render(<GroupUserAssignment users={users} groupId={groupId} currentUserRole="admin" />);
    fireEvent.click(screen.getByText(/añadir usuario/i));

    // Es buena práctica esperar a que el modal aparezca si su renderizado es condicional
    await waitFor(() => {
      const options = screen.getAllByRole('option').map(o => o.textContent);
      expect(options).toContain('Juan Pérez');
      expect(options).toContain('Carlos Colaborador');
      expect(options).not.toContain('Ana Admin');
    });
  });

  it('simula la llamada a la API correctamente', async () => {
    // CAMBIO: vi.fn() en lugar de jest.fn()
    AddUserToGroup.mockResolvedValue({ success: true });

    render(<GroupUserAssignment users={users} groupId={groupId} currentUserRole="admin" />);
    fireEvent.click(screen.getByText(/añadir usuario/i));
    
    // Esperar a que el combobox esté en el DOM antes de interactuar
    const combobox = await screen.findByRole('combobox');
    fireEvent.change(combobox, { target: { value: '1' } });
    
    // Esperar a que el botón de confirmar esté en el DOM
    const confirmButton = await screen.findByRole('button', { name: /confirmar/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(AddUserToGroup).toHaveBeenCalledWith('1', groupId);
    });
  });

  it('muestra mensaje de error si falla la API', async () => {
    // CAMBIO: vi.fn() en lugar de jest.fn()
    AddUserToGroup.mockRejectedValue(new Error('error'));

    render(<GroupUserAssignment users={users} groupId={groupId} currentUserRole="admin" />);
    fireEvent.click(screen.getByText(/añadir usuario/i));

    // Esperar a que el combobox esté en el DOM antes de interactuar
    const combobox = await screen.findByRole('combobox');
    fireEvent.change(combobox, { target: { value: '1' } });

    // Esperar a que el botón de confirmar esté en el DOM
    const confirmButton = await screen.findByRole('button', { name: /confirmar/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText(/error al añadir/i)).toBeInTheDocument();
    });
  });
});