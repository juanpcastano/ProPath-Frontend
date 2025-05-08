//ejemplo pa hacer llamadas a la api

import Api from "../api/Api";
import { registerInfo } from "../models/registerInfo";
import { UserInfo } from "../models/user.model";
// import { UserInfo } from "../models/user.model";

export const ApiCallUser = async (id: string|undefined): Promise<UserInfo> => {
  if (import.meta.env.VITE_ENVIROMENT == "mockup") {
    // implemtación de lógicas de modo mockup, retornar las cosas como se espera en la llamada, ejemplo, para el login {user: mockupuser}
  }

  try {
    const result = await Api.get(`/users-management/users/${id}`, {
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

export const ApiCallAddUser = async (body: registerInfo) => {
  if (import.meta.env.VITE_ENVIROMENT == "mockup") {
    // implemtación de lógicas de modo mockup, retornar las cosas como se espera en la llamada, ejemplo, para el login {user: mockupuser}
    return {
      ...body,
      pasword: "Contraseña provisional generada en el backend",
    };
  }

  try {
    const result = await Api.post("/auth/register", body, {
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
