import Api from "../api/Api";
import { Path } from "../models/path.model";

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

// pablo, esto usa la cookie, no tienes que mandarle un body
export const ApiCallGetUserPaths = async () => {
  if (import.meta.env.VITE_ENVIROMENT == "mockup") {
    return;
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
    return {};
  }

  try {
    const result = await Api.put("/path-management/paths/" + path.id, path, {
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

export const ApiCallAddActivity = async (activity: {
  name: string;
  description: string;
  hours: number;
  initialDate: Date;
  finalDate: Date;
  budget: number;
}) => {
  if (import.meta.env.VITE_ENVIROMENT == "mockup") {
    // implemtación de lógicas de modo mockup, retornar las cosas como se espera en la llamada, ejemplo, para el login {user: mockupuser}
    return {};
  }

  try {
    const result = await Api.post("/path-management/activity/", activity, {
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

export const ApiCallDeleteActivity = async (id: string) => {
  if (import.meta.env.VITE_ENVIROMENT == "mockup") {
    // implemtación de lógicas de modo mockup, retornar las cosas como se espera en la llamada, ejemplo, para el login {user: mockupuser}
    return {};
  }

  try {
    const result = await Api.delete("/path-management/activity/" + id, {
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

export const ApiCallEditActivity = async (
  id: string,
  body: {
    name?: string;
    description?: string;
    hours?: number;
    initialDate?: Date;
    finalDate?: Date;
    budget?: number;
  }
) => {
  if (import.meta.env.VITE_ENVIROMENT == "mockup") {
    // implemtación de lógicas de modo mockup, retornar las cosas como se espera en la llamada, ejemplo, para el login {user: mockupuser}
    return {};
  }

  try {
    const result = await Api.put("/path-management/activity/" + id, body, {
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

export const ApiCallGetSendedPaths = async (coachId: string) => {
  if (import.meta.env.VITE_ENVIROMENT == "mockup"|| true) {
    const paths: Path[] = [
      {id: 'c5b6c8ed-4dc7-48e1-89d1-b72fa9b24b34',
        name: 'Path de aprendizaje de liderazgo',
        description: 'En este path quiero aprender habilidades de liderazgo',
        totalHours: 32,
        totalBudget: 50000,
        state: 'R',
        activities: [
          {
            id: '0729cee4-3853-43a7-a202-3f0cff08f512',
            name: 'Lectura y Aplicación de \'Los 7 hábitos de la gente altamente efectiva\'',
            description: 'Leer el libro \'Los 7 hábitos de la gente altamente efectiva\' de Stephen Covey y aplicar sus principios en el entorno laboral.',
            hours: 8,
            initialDate: new Date("2024-03-10"),
            finalDate: new Date("2024-03-10"),
            budget: 0,
            state: 'E',
            pathId: 'c5b6c8ed-4dc7-48e1-89d1-b72fa9b24b34',
            comments: []
          },
          {
            id: '60535384-f9c5-480f-84ca-705a8edcb927',
            name: 'Taller de Liderazgo Transformacional',
            description: 'Participar en un taller de liderazgo transformacional para desarrollar habilidades de inspiración y motivación de equipos.',
            hours: 8,
            initialDate: new Date("2024-03-10"),
            finalDate: new Date("2024-03-10"),
            budget: 50000,
            state: 'E',
            pathId: 'c5b6c8ed-4dc7-48e1-89d1-b72fa9b24b34',
            comments: []
          },
          {
            id: '6c1c762b-92b1-42b6-89bc-036e68c7c3f6',
            name: 'Curso Online de Comunicación Efectiva',
            description: 'Realizar un curso online sobre comunicación efectiva y persuasión para mejorar las habilidades de comunicación interpersonal.',
            hours: 8,
            initialDate: new Date("2024-03-10"),
            finalDate: new Date("2024-03-10"),
            budget: 25000,
            state: 'E',
            pathId: 'c5b6c8ed-4dc7-48e1-89d1-b72fa9b24b34',
            comments: []
          },
          {
            id: '995bf708-4231-4e73-8112-b5d0c5e6c0ac',
            name: 'Práctica de Delegación de Tareas',
            description: 'Practicar la delegación de tareas y responsabilidades en el equipo de trabajo, brindando autonomía y apoyo a los miembros.',
            hours: 8,
            initialDate: new Date("2024-03-10"),
            finalDate: new Date("2024-03-10"),
            budget: 0,
            state: 'E',
            pathId: 'c5b6c8ed-4dc7-48e1-89d1-b72fa9b24b34',
            comments: []
          }
        ],
      },
      {
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
    ];
    return paths;
  }

  try {
    const result = await Api.get(`/path-management/paths/${coachId}/paths-in-review`, {
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

export const ApiCallSendPath = async (id: string, action: string) => {
  if (import.meta.env.VITE_ENVIROMENT == "mockup") {
    // implemtación de lógicas de modo mockup, retornar las cosas como se espera en la llamada, ejemplo, para el login {user: mockupuser}
    return {};
  }

  try {
    const result = await Api.put("/path-management/paths/"+ id +"/" + action , {
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