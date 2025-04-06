//ejemplo pa hacer llamadas a la api

import Api from "../api/Api";
import { UserInfo } from "../models/user.model";

export const ApiCallUsers = async () => {

  
  if (import.meta.env.VITE_ENVIROMENT == "mockup") {
    const users = [
      {
        id: 1,
        name: "Ana García Rodríguez",
        email: "ana.garcia@empresa.com",
        role: "Administrador"
      },
      {
        id: 2,
        name: "Carlos Martínez López",
        email: "carlos.martinez@empresa.com",
        role: "Editor"

      },
      {
        id: 3,
        name: "Laura Sánchez Fernández",
        email: "laura.sanchez@empresa.com",
        role: "Visualizador"
  
      },
      {
        id: 4,
        name: "Miguel Ramírez Torres",
        email: "miguel.ramirez@empresa.com",
        role: "Editor"

      },
      {
        id: 5,
        name: "Sofía Pérez González",
        email: "sofia.perez@empresa.com",
        role: "Administrador"

      },
      {
        id: 6,
        name: "Javier Moreno Díaz",
        email: "javier.moreno@empresa.com",
        role: "Visualizador"

      },
      {
        id: 7,
        name: "Lucía Romero Navarro",
        email: "lucia.romero@empresa.com",
        role: "Editor"

      },
      {
        id: 8,
        name: "Daniel Serrano Ortiz",
        email: "daniel.serrano@empresa.com",
        role: "Visualizador"

      },
      {
        id: 9,
        name: "Elena Castro Molina",
        email: "elena.castro@empresa.com",
        role: "Administrador"

      },
      {
        id: 10,
        name: "Pablo Jiménez Ruiz",
        email: "pablo.jimenez@empresa.com",
        role: "Editor"

      }
    ];
    return users
  }

  try {
    const result = await Api.get("/users-management/users", {
      headers: {
        "Content-Type": "application/json"
      },
    });
    result.data = result.data.map((user:UserInfo)=>{
      return {
        ...user,
        role: user.role == "A" ? "Administrador" : user.role == "P" 
      }
    })
    return result.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
