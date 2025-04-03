//ejemplo pa hacer llamadas a la api

import Api from "../api/Api";
import { UserInfo } from "../models/user.model";

export const ApiCallAddUser = async (body: UserInfo) => {
  if (import.meta.env.VITE_ENVIROMENT == "mockup") {
    // implemtación de lógicas de modo mockup, retornar las cosas como se espera en la llamada, ejemplo, para el login {user: mockupuser}
  }

  try {
    const result = await Api.post("/users", {
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });
    return result.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
