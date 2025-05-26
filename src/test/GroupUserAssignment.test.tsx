import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

afterEach(cleanup); // <-- importante para desmontar componentes después de cada test

describe('HU11.3 - Asignación de miembros a grupos (sin dependencias)', () => {
  const groupId = 'grupo-001';
  const users = [
    { id: '1', name: 'Juan Pérez', role: 'p' },
    { id: '2', name: 'Ana Admin', role: 'a' },
    { id: '3', name: 'Carlos Colaborador', role: 'c' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra el botón si el rol es admin', () => {
    render(<FakeGroupUserAssignment users={users} groupId={groupId} currentUserRole="admin" />);
    expect(screen.getByText(/añadir usuario/i)).toBeInTheDocument();
  });

  it('no muestra el botón si el rol NO es admin', () => {
    render(<FakeGroupUserAssignment users={users} groupId={groupId} currentUserRole="p" />);
    expect(screen.queryByText(/añadir usuario/i)).not.toBeInTheDocument();
  });

  it('muestra solo usuarios con rol "p" en la lista', () => {
    render(<FakeGroupUserAssignment users={users} groupId={groupId} currentUserRole="admin" />);
    fireEvent.click(screen.getByText(/añadir usuario/i));
    const options = screen.getAllByRole('option').map(o => o.textContent);
    expect(options).toContain('Juan Pérez');
    expect(options).not.toContain('Ana Admin');
    expect(options).not.toContain('Carlos Colaborador');
  });

  it('deshabilita confirmar si no hay usuario seleccionado', () => {
    render(<FakeGroupUserAssignment users={users} groupId={groupId} currentUserRole="admin" />);
    fireEvent.click(screen.getByText(/añadir usuario/i));
    expect(screen.getByRole('button', { name: /confirmar/i })).toBeDisabled();
  });

  it('simula la llamada a la API correctamente', async () => {
    fakeAddUserToGroup.mockResolvedValue({ success: true });

    render(<FakeGroupUserAssignment users={users} groupId={groupId} currentUserRole="admin" />);
    fireEvent.click(screen.getByText(/añadir usuario/i));
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /confirmar/i }));

    await waitFor(() => {
      expect(fakeAddUserToGroup).toHaveBeenCalledWith('1', groupId);
    });
  });

  it('muestra mensaje de error si falla la API', async () => {
    fakeAddUserToGroup.mockRejectedValue(new Error('error'));

    render(<FakeGroupUserAssignment users={users} groupId={groupId} currentUserRole="admin" />);
    fireEvent.click(screen.getByText(/añadir usuario/i));
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /confirmar/i }));

    await waitFor(() => {
      expect(screen.getByText(/error al añadir/i)).toBeInTheDocument();
    });
  });
});

function FakeGroupUserAssignment({ users, groupId, currentUserRole }: any) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const eligibleUsers = users.filter((u: any) => u.role === 'p');

  const handleSubmit = async () => {
    if (!selectedUser) return;
    setLoading(true);
    setError('');
    try {
      await fakeAddUserToGroup(selectedUser, groupId);
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

// Mock simulado
const fakeAddUserToGroup = jest.fn();