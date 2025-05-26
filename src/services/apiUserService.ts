//ejemplo pa hacer llamadas a la api

import Api from "../api/Api";
import { registerInfo } from "../models/registerInfo";
import { UserInfo } from "../models/user.model";
// import { UserInfo } from "../models/user.model";

export const ApiCallUser = async (
  id: string | undefined
): Promise<UserInfo> => {
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
