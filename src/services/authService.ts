import { credentials } from "../models/credentials.model";
import { registerInfo } from "../models/registerInfo";
import Api from "../api/Api";

Api.post("/auth/login", {});
export const ApiCallLogin = async (credentials: credentials) => {
  try {
    const result = await Api.post("/auth/login", credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = result.data;
    return data;
  } catch (err) {
    console.log(err)
    return err
  }
};
export const ApiCallRegister = async (registerInfo: registerInfo) => {
  try {
   
    registerInfo.id = Number(registerInfo.id)    
    const result = await Api.post("/auth/register", registerInfo, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = result.data;
    return data;
  } catch (err) {
    console.log(err)
    return err
  }
};
export const ApiCallLogout = async () => {
  try {
    const result = await Api.post("/auth/logout", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = result.data;
    return data;
  } catch (err) {
    console.log(err)
    return err
  }
};