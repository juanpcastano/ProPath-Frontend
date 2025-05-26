import { credentials } from "../models/credentials.model";
import { registerInfo } from "../models/registerInfo";
import Api from "../api/Api";

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
    console.log(err);
    throw err;
  }
};
export const ApiCallRegister = async (registerInfo: registerInfo) => {
  try {
    const result = await Api.post("/auth/register", registerInfo, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = result.data;
    return data;
  } catch (err) {
    console.log(err);
    return err;
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
    console.log(err);
    return err;
  }
};

export const ApiCallSendCode = async (email: string) => {
  try {
    const result = await Api.post(
      "/auth/request-password-reset",
      { email: email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = result.data;
    return data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const ApiCallUpdatePassword = async ({
  email,
  code,
  newPassword,
}: {
  email: string;
  code: number;
  newPassword: string;
}) => {
  try {
    const result = await Api.post(
      "/auth/reset-password",
      {
        email: email,
        code: code,
        newPassword: newPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = result.data;
    return data;
  } catch (err) {
    console.log(err);
    return err;
  }
};
