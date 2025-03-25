import { credentials } from "../models/credentials.model";
import { registerInfo } from "../models/registerInfo";
import Api from "../api/Api";
import { MockupProUserState, MockupCoachUserState, MockupAdminUserState } from "../Redux/States/user";

export const ApiCallLogin = async (credentials: credentials) => {


  //lógica para mockup
  if ((import.meta.env.VITE_ENVIROMENT == "mockup")) {
    console.log(`Logeándose como ${import.meta.env.VITE_MOCKUP_ROLE}`);
    
    if (import.meta.env.VITE_MOCKUP_ROLE == "pro"){
      return {user: MockupProUserState}
      
    } else if (import.meta.env.VITE_MOCKUP_ROLE == "coach"){
      return {user: MockupCoachUserState}

    } else if (import.meta.env.VITE_MOCKUP_ROLE == "admin"){
      return {user: MockupAdminUserState}
    }
  }

  //llamado a api real
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