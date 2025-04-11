import Api from "../api/Api";

export const ApiCallAISuggestions = async (path: any) => {
  if (import.meta.env.VITE_ENVIROMENT == "mockup") {
    // implemtación de lógicas de modo mockup, retornar las cosas como se espera en la llamada, ejemplo, para el login {user: mockupuser}
    return {
        activities: [
            {
                budget: 250000,
                description: "Curso online sobre AWS Certified DevOps Engineer - Professional.",
                finalDate: "2025-07-01",
                hours: 8,
                initialDate: "2025-06-01",
                name: "Curso AWS DevOps Engineer"
            },
            {
                budget: 0,
                description: "Implementación de pipeline de CI/CD con Jenkins y despliegue en AWS.",
                finalDate: "2025-08-01",
                hours: 12,
                initialDate: "2025-07-01",
                name: "Implementación de CI/CD en AWS"
            },
        ],
        description: "Este path se enfoca en profundizar en la infraestructura como código, la automatización del despliegue continuo y la orquestación de contenedores en la nube.",
        name: "Infraestructura como Código y Despliegue Continuo Avanzado",
        valid: true,
        validexplain: "El path proporcionado es válido y coherente con un camino de aprendizaje enfocado en la computación en la nube, específicamente en infraestructura y despliegue continuo."
    };
  }

  try {
    const result = await Api.post("/genai/recommend-path", path, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
}

