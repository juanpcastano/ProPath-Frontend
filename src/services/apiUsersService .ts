//ejemplo pa hacer llamadas a la api

import Api from "../api/Api";

export const ApiCallUsers = async () => {

  
  if (import.meta.env.VITE_ENVIROMENT == "mockup") {
    // implemtación de lógicas de modo mockup, retornar las cosas como se espera en la llamada, ejemplo, para el login {user: mockupuser}
    return [{name: "hola"}]
  }

  try {
    const result = await Api.get("/users", {
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
