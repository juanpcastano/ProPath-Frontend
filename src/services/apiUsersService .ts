//ejemplo pa hacer llamadas a la api

import Api from "../api/Api";
import { UserInfo } from "../models/user.model";

export const ApiCallUsers = async (): Promise<UserInfo[]> => {
  try {
    const result = await Api.get("/users-management/users", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    result.data = result.data.map((user: UserInfo) => {
      return {
        ...user,
        role:
          user.role == "A"
            ? "Administrador"
            : user.role == "P" && "Profesional",
      };
    });
    return result.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
