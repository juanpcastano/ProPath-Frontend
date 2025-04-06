//ejemplo pa hacer llamadas a la api

import Api from "../api/Api";
import { registerInfo } from "../models/registerInfo";
import { UserInfo } from "../models/user.model";

export const ApiCallUser = async (id: string) => {
  if (import.meta.env.VITE_ENVIROMENT == "mockup") {
    // implemtación de lógicas de modo mockup, retornar las cosas como se espera en la llamada, ejemplo, para el login {user: mockupuser}
    return {
      id: 8,
      name: "Daniel Serrano Ortiz",
      email: "daniel.serrano@empresa.com",
      role: "Visualizador",
      group: "Finanzas",
      city: "Cali",
      country: "Colombia",
      groups: [
        { name: "Chambeadores", id: "1" },
        { name: "Los increibles", id: "2" },
        { name: "Admins", id: "3"},
      ],
    };
  }

  try {
    const result = await Api.post("/users", {
      headers: {
        "Content-Type": "application/json",
      },
      body: { id: id },
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
    const result = await Api.post("/auth/register", body ,{
      headers: {
        "Content-Type": "application/json",
      }
    });
    return result.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
