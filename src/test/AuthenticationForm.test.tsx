import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../Pages/Login/Login';
import { Provider } from 'react-redux';
import store from '../Redux/store';
import userEvent from '@testing-library/user-event';

describe('Authentication Form Tests', () => {
    beforeEach(() => {
        render(
            <Provider store={store}>
                <Login />
            </Provider>
        );
    });

    test('should render login form with required fields', () => {
        expect(screen.getByPlaceholderText('Usuario')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    });

    test('should show error message with invalid credentials', async () => {
        const usernameInput = screen.getByPlaceholderText('Usuario');
        const passwordInput = screen.getByPlaceholderText('Contraseña');
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

        await userEvent.type(usernameInput, 'invalid@test.com');
        await userEvent.type(passwordInput, 'wrongpass');
        await userEvent.click(submitButton);

        expect(await screen.findByText(/credenciales inválidas/i)).toBeInTheDocument();
    });

    test('should redirect after successful login', async () => {
        const usernameInput = screen.getByPlaceholderText('Usuario');
        const passwordInput = screen.getByPlaceholderText('Contraseña');
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

        await userEvent.type(usernameInput, 'valid@test.com');
        await userEvent.type(passwordInput, 'correctpass');
        await userEvent.click(submitButton);

        // Mock de navegación
        expect(window.location.pathname).toBe('/dashboard');
    });

    test('should validate empty fields', async () => {
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
        await userEvent.click(submitButton);

        expect(screen.getByText(/usuario requerido/i)).toBeInTheDocument();
        expect(screen.getByText(/contraseña requerida/i)).toBeInTheDocument();
    });

    test('should validate email format', async () => {
        const usernameInput = screen.getByPlaceholderText('Usuario');
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

        await userEvent.type(usernameInput, 'invalidEmail');
        await userEvent.click(submitButton);

        expect(screen.getByText(/formato de email inválido/i)).toBeInTheDocument();
    });

    test('should store JWT token after successful login', async () => {
        const usernameInput = screen.getByPlaceholderText('Usuario');
        const passwordInput = screen.getByPlaceholderText('Contraseña');
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

        await userEvent.type(usernameInput, 'valid@test.com');
        await userEvent.type(passwordInput, 'correctpass');
        await userEvent.click(submitButton);

        expect(localStorage.getItem('jwt-token')).not.toBeNull();
    });

    test('should disable form during submission', async () => {
        const usernameInput = screen.getByPlaceholderText('Usuario');
        const passwordInput = screen.getByPlaceholderText('Contraseña');
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

        await userEvent.type(usernameInput, 'valid@test.com');
        await userEvent.type(passwordInput, 'correctpass');
        await userEvent.click(submitButton);

        expect(submitButton).toBeDisabled();
        expect(usernameInput).toBeDisabled();
        expect(passwordInput).toBeDisabled();
    });
});