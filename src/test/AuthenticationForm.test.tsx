import { render, screen} from "@testing-library/react";
import { describe, test, expect, beforeEach, vi } from "vitest";
import Login from "../Pages/Login/Login";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "../Redux/store";
import userEvent from "@testing-library/user-event";

// Mock del servicio de autenticación
const mockApiCallLogin = vi.fn();
vi.mock("../../services/authService", () => ({
  ApiCallLogin: mockApiCallLogin,
}));

// Mock de react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Wrapper con todos los providers necesarios
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe("Authentication Form Tests", () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada test
    vi.clearAllMocks();
    mockApiCallLogin.mockReset();
    renderWithProviders(<Login />);
  });

  test("should render login form with required fields", () => {
    // Ajustado a los elementos reales del componente
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /iniciar sesión/i })
    ).toBeInTheDocument();
  });


  test("should validate required fields with HTML5 validation", async () => {
    const user = userEvent.setup();
    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });

    // El componente usa validación HTML5 nativa con required
    await user.click(submitButton);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);

    // Verificar que los campos tienen el atributo required
    expect(emailInput).toHaveAttribute("required");
    expect(passwordInput).toHaveAttribute("required");
  });

  test("should validate email format with HTML5 validation", async () => {
    const user = userEvent.setup();
    const emailInput = screen.getByLabelText(/email/i);

    // El input tiene type="email" que valida automáticamente
    expect(emailInput).toHaveAttribute("type", "email");

    await user.type(emailInput, "invalidEmail");

    // HTML5 validation will prevent form submission with invalid email
    expect(emailInput).toBeInvalid();
  });

  test("should validate minimum password length", () => {
    const passwordInput = screen.getByLabelText(/contraseña/i);

    // El componente tiene minLength={6}
    expect(passwordInput).toHaveAttribute("minLength", "6");
  });

  

  /* test('should handle unexpected errors', async () => {
    const user = userEvent.setup();
    
    // Mock de error no-axios
    mockApiCallLogin.mockRejectedValue(new Error('Unexpected error'));

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/ocurrió un error inesperado/i)).toBeInTheDocument();
    });
  }); */

  test("should render password reset link", () => {
    const resetLink = screen.getByRole("link", {
      name: /restablecer contraseña/i,
    });
    expect(resetLink).toBeInTheDocument();
    expect(resetLink).toHaveAttribute("href", "/Restablish");
  });

  test("should update form state on input change", async () => {
    const user = userEvent.setup();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "testpassword");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("testpassword");
  });
});
