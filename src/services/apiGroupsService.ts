//ejemplo pa hacer llamadas a la api

import Api from "../api/Api";

export const ApiCallGroups = async () => {
  if (import.meta.env.VITE_ENVIROMENT == "mockup") {
    // implemtación de lógicas de modo mockup, retornar las cosas como se espera en la llamada, ejemplo, para el login {user: mockupuser}

    return [{ id: "1", name: "chambeadores" }];
  }

  try {
    const result = await Api.get("/users-management/groups", {
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

export interface groupMember {
  id: string;
  groupRole: string;
}

export interface group {
  name: string;
  members: groupMember[];
}

export const ApiCallAddGroup = async (group: group) => {
  if (import.meta.env.VITE_ENVIROMENT == "mockup") {
    // implemtación de lógicas de modo mockup, retornar las cosas como se espera en la llamada, ejemplo, para el login {user: mockupuser}

    return [{ id: "1", name: "chambeadores" }];
  }

  try {
    const result = await Api.post("/users-management/groups", group, {
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
