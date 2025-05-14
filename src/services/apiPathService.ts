import Api from "../api/Api";
import { Path } from "../models/path.model";

export const ApiCallGetPath = async (id: string): Promise<Path> => {
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
export const ApiCallGetUserPaths = async (): Promise<Path[]> => {
  try {
    const result = await Api.get(`/path-management/user/paths`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return Object.values(result.data);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const ApiCallAddPath = async (path: {
  name: string;
  description: string;
}): Promise<Path> => {
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

export const ApiCallGetSendedPaths = async (role: string): Promise<Path[]> => {
  try {
    const result = await Api.get(
      `/path-management/paths/paths-in-review/${role}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const ApiCallGetApprovedPaths = async (): Promise<Path[]> => {
  try {
    const result = await Api.get(
      `/path-management/paths/paths-in-review/admin`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(result.data);

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
    const result = await Api.put(
      "/path-management/paths/" + id + "/" + action,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(result.data);
    return result.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
