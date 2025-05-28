import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Path from "../Pages/Path/Path";
import userReducer from "../Redux/States/user";
import { vi, describe, beforeEach, test } from "vitest";

import * as apiPathService from "../services/apiPathService";
import * as apiUserService from "../services/apiUserService";

// ¡Correcto! Esto mockea el módulo completo, y sus exportaciones serán mocks.
vi.mock("../services/apiPathService");
vi.mock("../services/apiUserService");

const preloadedState = {
  user: {
    id: "MOCKED_ID",
    documentId: "123456789",
    idType: "CC",
    name: "Jhon Doe",
    profilePictureUrl: "",
    email: "jhon@doe.com",
    role: "P",
    country: "Colombia",
    city: "Cali",
    birthDate: "2004-02-28",
  },
};

function renderWithProviders(ui: React.ReactElement, state = preloadedState) {
  const store = configureStore({
    reducer: {
      user: userReducer,
    },
    preloadedState: state,
  });

  return render(<Provider store={store}>{ui}</Provider>);
}

describe("Initial Form", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // **CAMBIO AQUÍ: Usa vi.mocked() para informar a TypeScript**
    vi.mocked(apiPathService.ApiCallGetUserPaths).mockResolvedValue([]);
    vi.mocked(apiUserService.ApiCallUser).mockResolvedValue({
      id: "MOCKED_ID",
      documentId: "123456789",
      idType: "CC",
      name: "Jhon Doe",
      profilePictureUrl: "",
      email: "jhon@doe.com",
      role: "P",
      country: "Colombia",
      city: "Cali",
      birthDate: "2004-02-28",
    });
  });

  test("validar que aparezca el initialForm cuando no hay path", async () => {
    renderWithProviders(<Path />);
    const crearPathButton = await screen.findByText(/Crear Path/i);
    expect(crearPathButton).toBeDefined();
  });
});