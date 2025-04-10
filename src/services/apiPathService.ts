import Api from "../api/Api";

export const ApiCallGetPath = async (id: string) => {
  if (import.meta.env.VITE_ENVIROMENT == "mockup") {
    if (id == "1") {
      return {
        path: {
          id: "1",
          name: "Path 1",
          description: "Soy el path del sebas",
          state: "M",
          totalBudget: 0,
          totalHours: 0,
          activities: [
            {
              id: "1",
              name: "Diseño de Interfaz de Usuario",
              description:
                "Crear mockups y wireframes para la nueva aplicación web",
              hours: 20,
              initialDate: new Date("2024-03-15"),
              finalDate: new Date("2024-03-25"),
              budget: 500,
              state: "Pendiente",
              pathId: "1",
            },
            {
              id: "2",
              name: "Implementación de Backend",
              description:
                "Desarrollar los servicios REST para la gestión de usuarios",
              hours: 40,
              initialDate: new Date("2024-03-20"),
              finalDate: new Date("2024-04-10"),
              budget: 1200,
              state: "En Progreso",
              pathId: "1",
            },
            {
              id: "3",
              name: "Pruebas de Integración",
              description:
                "Realizar pruebas exhaustivas de los componentes del sistema",
              hours: 15,
              initialDate: new Date("2024-04-01"),
              finalDate: new Date("2024-04-07"),
              budget: 300,
              state: "Pendiente",
              pathId: "1",
            },
            {
              id: "4",
              name: "Documentación del Proyecto",
              description:
                "Crear manuales técnicos y de usuario para el nuevo sistema",
              hours: 10,
              initialDate: new Date("2024-04-05"),
              finalDate: new Date("2024-04-15"),
              budget: 250,
              state: "Completada",
              pathId: "1",
            },
            {
              id: "5",
              name: "Capacitación de Equipo",
              description:
                "Sesiones de entrenamiento para el equipo de desarrollo",
              hours: 8,
              initialDate: new Date("2024-04-10"),
              finalDate: new Date("2024-04-12"),
              budget: 400,
              state: "En Progreso",
              pathId: "1",
            },
          ],
        },
      };
    }
    if (id == "2") {
      return {
        path: {
          id: "2",
          name: "Path 2",
          description: "Este es otro path diferente",
          state: "A",
          totalBudget: 5000,
          totalHours: 100,
          activities: [
            {
              id: "1",
              name: "Desarrollo del Backend",
              description: "Implementar la API y base de datos",
              hours: 50,
              initialDate: new Date("2024-03-10"),
              finalDate: new Date("2024-04-05"),
              budget: 2000,
              state: "En progreso",
              pathId: "1",
            },
          ],
        },
      };
    }

    if (id == "3") {
      return {
        path: {
          id: "3",
          name: "Path 3",
          description: "Un tercer path completamente diferente",
          state: "C",
          totalBudget: 8000,
          totalHours: 150,
          activities: [
            {
              id: "1",
              name: "Pruebas de Calidad",
              description: "Ejecutar pruebas unitarias y de integración",
              hours: 30,
              initialDate: new Date("2024-04-01"),
              finalDate: new Date("2024-04-15"),
              budget: 1500,
              state: "Pendiente",
              pathId: "1",
            },
          ],
        },
      };
    }
  }

  try {
    const result = await Api.get("/path-management/paths/" + id, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const ApiCallGetUserPaths = async () => {
  if (import.meta.env.VITE_ENVIROMENT == "mockup") {
    return 
  }

  try {
    const result = await Api.get(`/path-management/user/paths`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const ApiCallAddPath = async (path: {
  name: string;
  description: string;
}) => {
  if (import.meta.env.VITE_ENVIROMENT == "mockup") {
    // implemtación de lógicas de modo mockup, retornar las cosas como se espera en la llamada, ejemplo, para el login {user: mockupuser}
  }

  try {
    const result = await Api.post("/path-management/paths", path, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(result.data);
    return result.data;
    
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const ApiCallUpdatePath = async (path: {
  id: string;
  name: string;
  description: string;
}) => {
  if (import.meta.env.VITE_ENVIROMENT == "mockup") {
    // implemtación de lógicas de modo mockup, retornar las cosas como se espera en la llamada, ejemplo, para el login {user: mockupuser}
  }

  try {
    const result = await Api.put("/path-management/paths/"+path.id, path, {
      headers: {
        "Content-Type": "application/json",
      },

    });
    console.log(result.data);
    return result.data;
    
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
}
