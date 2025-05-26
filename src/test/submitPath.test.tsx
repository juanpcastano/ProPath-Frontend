// src/test/submitPath.test.tsx
import { ApiCallLogout } from "../services/authService";
import "@testing-library/jest-dom";

// Mock completo del módulo para evitar ejecutar código con top-level await
jest.mock("../api/Api", () => ({
  __esModule: true,
  default: {
    post: jest.fn()
  }
}));

// Importamos el mock después de hacer el mock manual
import Api from "../api/Api";

// Cast para acceder al mock de forma tipada
const mockedApi = Api as jest.Mocked<typeof Api>;

describe("Envío de propuesta de path", () => {
  it("debe enviar la propuesta correctamente", async () => {
    mockedApi.post.mockResolvedValue({ status: 200, data: { state: "pending" } });

    const result = await ApiCallLogout();

    expect(result.state).toBe("pending");
    expect(mockedApi.post).toHaveBeenCalledWith("/auth/logout", expect.any(Object));
  });
});