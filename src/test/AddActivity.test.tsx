import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Path from "../Pages/Path/Path";
import userReducer from "../Redux/States/user";
import { vi } from "vitest";

vi.mock("../services/uuidGenerator", () => ({
  generateUUID: () => "test-uuid",
}));
import * as apiPathService from "../services/apiPathService";
import * as apiUserService from "../services/apiUserService";
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

describe("MiPath - Añadir Actividad", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (
      apiPathService.ApiCallGetUserPaths as ReturnType<typeof vi.fn>
    ).mockResolvedValue([
      {
        id: "021d9427-2564-4f74-8745-aadb227d7a71",
        name: "Path de habilidades para recursos humanos",
        description:
          "En este path quiero aprender los fundamentos a la hora de tratar con gente, esto para llevarlo a la práctica en mi labor como gerente de recursos humanos",
        state: "R",
        activities: [
          {
            id: "98d4bee4-fb14-4dbc-829b-64eb2d5747f8",
            name: "Comunicación Efectiva y Resolución de Conflictos",
            description:
              "Desarrollar habilidades de comunicación efectiva, incluyendo escucha activa, retroalimentación constructiva y resolución de conflictos.",
            hours: 8,
            initialDate: "2025-06-07T00:00:00.000Z",
            finalDate: "2025-06-20T00:00:00.000Z",
            budget: 180000,
            state: "E",
            pathId: "021d9427-2564-4f74-8745-aadb227d7a71",
            comments: [],
          },
          {
            id: "7fa243af-0b4d-4222-b6ef-a97c78940fee",
            name: "Legislación Laboral Colombiana",
            description:
              "Adquirir conocimientos sobre las leyes laborales y regulaciones relevantes para la gestión de recursos humanos en Colombia.",
            hours: 8,
            initialDate: "2025-06-21T00:00:00.000Z",
            finalDate: "2025-07-04T00:00:00.000Z",
            budget: 300000,
            state: "E",
            pathId: "021d9427-2564-4f74-8745-aadb227d7a71",
            comments: [],
          },
          {
            id: "e01ace0a-8a7a-4f2e-b88f-210758176cb2",
            name: "Fundamentos de la Gestión del Talento Humano",
            description:
              "Aprender los fundamentos de la gestión del talento humano, incluyendo reclutamiento, selección, onboarding y capacitación.",
            hours: 8,
            initialDate: "2025-05-23T00:00:00.000Z",
            finalDate: "2025-06-06T00:00:00.000Z",
            budget: 250000,
            state: "E",
            pathId: "021d9427-2564-4f74-8745-aadb227d7a71",
            comments: [],
          },
        ],
        comments: [],
        quartile: {
          year: 2025,
          quartile: "Q2",
        },
        userId: "f5393004-a71d-45d7-a974-6146bf867501",
        coachId: null,
      },
      {
        id: "f90386c8-f145-4926-a4f8-77c40036e244",
        name: "Path de golang",
        description:
          "Path para aprender el tercer mejor lenguaje de programación hasta la fecha",
        state: "R",
        activities: [
          {
            id: "b034f54b-2cfc-4b68-a7f8-e6a3f9447348",
            name: "Testing en Go",
            description:
              "Aprender a escribir pruebas unitarias y de integración en Go.",
            hours: 8,
            initialDate: "2025-06-01T00:00:00.000Z",
            finalDate: "2025-06-15T00:00:00.000Z",
            budget: 150000,
            state: "E",
            pathId: "f90386c8-f145-4926-a4f8-77c40036e244",
            comments: [],
          },
          {
            id: "daa78132-ddbb-4573-bcda-10242085e39e",
            name: "Funciones, Paquetes y Manejo de Errores en Go",
            description:
              "Explorar las funciones, paquetes y el manejo de errores en Go.",
            hours: 8,
            initialDate: "2025-05-16T00:00:00.000Z",
            finalDate: "2025-05-30T00:00:00.000Z",
            budget: 300000,
            state: "E",
            pathId: "f90386c8-f145-4926-a4f8-77c40036e244",
            comments: [],
          },
          {
            id: "b6806a46-8c72-477c-9bce-665552f2a179",
            name: "Concurrencia en Go",
            description:
              "Aprender sobre concurrencia en Go utilizando goroutines y channels.",
            hours: 8,
            initialDate: "2025-06-01T00:00:00.000Z",
            finalDate: "2025-06-15T00:00:00.000Z",
            budget: 200000,
            state: "E",
            pathId: "f90386c8-f145-4926-a4f8-77c40036e244",
            comments: [],
          },
          {
            id: "1562094f-d487-4e5a-b668-0416bd0b58ae",
            name: "Fundamentos de Go",
            description:
              "Aprender los fundamentos de Go, incluyendo sintaxis, tipos de datos y estructuras de control.asdf",
            hours: 8,
            initialDate: "2025-05-01T00:00:00.000Z",
            finalDate: "2025-05-15T00:00:00.000Z",
            budget: 250000,
            state: "E",
            pathId: "f90386c8-f145-4926-a4f8-77c40036e244",
            comments: [],
          },
        ],
        comments: [],
        quartile: null,
        userId: "f5393004-a71d-45d7-a974-6146bf867501",
        coachId: null,
      },
    ]);
    (apiPathService.ApiCallAddActivity as ReturnType<typeof vi.fn>)
      .mockResolvedValue({
        id: "021d9427-2564-4f74-8745-aadb227d7a71",
        name: "Path de habilidades para recursos humanos",
        description:
          "En este path quiero aprender los fundamentos a la hora de tratar con gente, esto para llevarlo a la práctica en mi labor como gerente de recursos humanos",
        state: "R",
        activities: [
          {
            id: "98d4bee4-fb14-4dbc-829b-64eb2d5747f8",
            name: "Comunicación Efectiva y Resolución de Conflictos",
            description:
              "Desarrollar habilidades de comunicación efectiva, incluyendo escucha activa, retroalimentación constructiva y resolución de conflictos.",
            hours: 8,
            initialDate: "2025-06-07T00:00:00.000Z",
            finalDate: "2025-06-20T00:00:00.000Z",
            budget: 180000,
            state: "E",
            pathId: "021d9427-2564-4f74-8745-aadb227d7a71",
            comments: [],
          },
        ],
        comments: [],//xd
        quartile: {
          year: 2025,
          quartile: "Q2",
        },
        userId: "f5393004-a71d-45d7-a974-6146bf867501",
        coachId: null,
      });

      (apiUserService.ApiCallUser as ReturnType<typeof vi.fn>)
      .mockResolvedValue({
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

  test("debería agregar una actividad al enviar el formulario de añadir actividad", async () => {
    renderWithProviders(<Path />);

    // Usa findByRole para esperar que el encabezado aparezca después de la carga de datos
    const addActivityHeading = await screen.findByRole("heading", {
      name: /Añadir Actividad/i,
    });
    expect(addActivityHeading).toBeInTheDocument();

    // Completar los campos del formulario.
    const nameInput = screen.getByRole("textbox", { name: /Nombre:/i });
    const descriptionInput = screen.getByRole("textbox", {
      name: /Descripción:/i,
    });
    const initialDateInput = screen.getByLabelText(/Fecha Inicial:/i);
    const finalDateInput = screen.getByLabelText(/Fecha Final:/i);
    const hoursInput = screen.getByRole("spinbutton", { name: /Horas:/i });
    const budgetInput = screen.getByRole("spinbutton", {
      name: /Presupuesto:/i,
    });
    const submitButton = screen.getByRole("button", {
      name: /Añadir Actividad/i,
    });

    // Valores de prueba
    const activityName = "Nueva Actividad";
    const activityDescription = "Descripción de prueba";
    const today = "2025-03-19";
    const tomorrow = "2025-03-20";
    const hoursValue = "8";
    const budgetValue = "100";

    // Simular entrada de datos
    fireEvent.change(nameInput, { target: { value: activityName } });
    fireEvent.change(descriptionInput, {
      target: { value: activityDescription },
    });
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

    expect(screen.getByText(activityDescription)).toBeInTheDocument();

  });
});
