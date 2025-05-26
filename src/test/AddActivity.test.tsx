// AddActivity.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import "@testing-library/jest-dom/extend-expect";
import MiPath from "../Pages/Mi Path/MiPath"; // ajusta la ruta según tu estructura
import userReducer, { EmptyUserState } from "../Redux/States/user";
import pathReducer from "../Redux/States/path";

// Mock de la función generateUUID para que retorne un id fijo.
jest.mock("../services/uuidGenerator", () => ({
  generateUUID: () => "test-uuid",
}));

// Definimos un estado inicial para el store que permita visualizar la sección de actividades.
const preloadedState = {
  user: {
    ...EmptyUserState,
    // Para evitar que se muestre el formulario de creación de path,
    // asignamos un pathId distinto de 0 (o el valor que tu lógica considere vacío)
    pathId: "1",
  },
  path: {
    id: "1",
    name: "Test Path",
    description: "Path de prueba",
    state: "propuesta",
    totalBudget: 0,
    totalHours: 0,
    activities: []  // Inicialmente sin actividades
  },
};

function renderWithProviders(ui: React.ReactElement, state = preloadedState) {
  const store = configureStore({
    reducer: {
      user: userReducer,
      path: pathReducer,
    },
    preloadedState: state,
  });

  return render(<Provider store={store}>{ui}</Provider>);
}

describe("MiPath - Añadir Actividad", () => {
  test("debería agregar una actividad al enviar el formulario de añadir actividad", async () => {
    renderWithProviders(<MiPath />);

    // Se asume que el formulario de "Añadir Actividad" tiene un heading con ese texto.
    expect(screen.getByRole("heading", { name: /Añadir Actividad/i })).toBeInTheDocument();

    // Completar los campos del formulario.
    const nameInput = screen.getByRole("textbox", { name: /Nombre:/i });
    const descriptionInput = screen.getByRole("textbox", { name: /Descripción:/i });
    const initialDateInput = screen.getByLabelText(/Fecha Inicial:/i);
    const finalDateInput = screen.getByLabelText(/Fecha Final:/i);
    const hoursInput = screen.getByRole("spinbutton", { name: /Horas:/i });
    const budgetInput = screen.getByRole("spinbutton", { name: /Presupuesto:/i });
    const submitButton = screen.getByRole("button", { name: /Añadir Actividad/i });

    // Valores de prueba
    const activityName = "Nueva Actividad";
    const activityDescription = "Descripción de prueba";
    const today = "2025-03-19";
    const tomorrow = "2025-03-20";
    const hoursValue = "5";
    const budgetValue = "100";

    // Simular entrada de datos
    fireEvent.change(nameInput, { target: { value: activityName } });
    fireEvent.change(descriptionInput, { target: { value: activityDescription } });
    fireEvent.change(initialDateInput, { target: { value: today } });
    fireEvent.change(finalDateInput, { target: { value: tomorrow } });
    fireEvent.change(hoursInput, { target: { value: hoursValue } });
    fireEvent.change(budgetInput, { target: { value: budgetValue } });

    // Enviar el formulario
    fireEvent.submit(submitButton);

    // Esperar a que se actualice la lista de actividades en el DOM.
    await waitFor(() => {
      expect(screen.getByText(activityName)).toBeInTheDocument();
    });

    // Se valida que se muestre la actividad con la descripción y otros datos.
    expect(screen.getByText(activityDescription)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`Horas Necesarias: ${hoursValue}`))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`Presupuesto: \\$${budgetValue}`))).toBeInTheDocument();

    expect(screen.getByText(new RegExp(`Fecha Inicial: ${today}`))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`Fecha Final: ${tomorrow}`))).toBeInTheDocument();
  });
});