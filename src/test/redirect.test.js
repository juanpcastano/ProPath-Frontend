import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import ProtectedRoute from '../routes/ProtectedRoute';
import Login from '../Pages/Login/Login';

test('redirecciona a login si no está autenticado', () => {
  render(
    <MemoryRouter initialEntries={['/ruta-protegida']}>
      <ProtectedRoute component={Login} />
    </MemoryRouter>
  );
  expect(screen.getByText(/login/i)).toBeInTheDocument();
});