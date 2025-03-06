import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Pages/Login/Login.tsx';

test('muestra error en campos vacíos', () => {
  render(<Login />);
  fireEvent.click(screen.getByRole('button', { name: /login/i }));
  expect(screen.getByText(/campos requeridos/i)).toBeInTheDocument();
});
