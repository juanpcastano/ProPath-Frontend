import { createSlice } from "@reduxjs/toolkit";
import { UserInfo } from "../../models/user.model";

export const EmptyUserState: UserInfo = {
  id: 0,
  idType: "",
  name: "",
  profilePictureUrl: "",
  email: "",
  role: "",
  country: "",
  city: "",
  birthDate: "",
  pathId: 0
};



export const MockupProUserState: UserInfo = {
  id: 1111111111,
  idType: "CC",
  name: "Juan",
  profilePictureUrl: "https://pbs.twimg.com/media/FWmxrxvWQAQsU1c.jpg",
  email: "juan@gmail.com",
  role: "pro",
  country: "Colombia",
  city: "Cali",
  birthDate: "2023-05-15T10:30:00",
  pathId: 0
};

export const MockupCoachUserState: UserInfo = {
  id: 2222222222,
  idType: "CC",
  name: "Carlos",
  profilePictureUrl: "https://images7.memedroid.com/images/UPLOADED693/5f47dfb3ee96f.jpeg",
  email: "carlos@gmail.com",
  role: "coach",
  country: "Colombia",
  city: "Cali",
  birthDate: "2023-05-15T10:30:00",
  pathId: 0
};

export const MockupAdminUserState: UserInfo = {
  id: 3333333333,
  idType: "CC",
  name: "Pablo",
  profilePictureUrl: "https://i.imgflip.com/4/5khfdn.jpg",
  email: "carlos@gmail.com",
  role: "admin",
  country: "Colombia",
  city: "Cali",
  birthDate: "2023-05-15T10:30:00",
  pathId: 0
};

export const persistLocalStoregeUser = (userInfo: UserInfo ) => {
    localStorage.setItem("user", JSON.stringify({ ...userInfo }))
};

export const userSlice = createSlice({
  name: "user",
  initialState: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : EmptyUserState,
  reducers: {
    createUser: (_state, action) => {
      persistLocalStoregeUser(action.payload)
      return action.payload;
    },
    updateUser: (state, action) => {
      const result = { ...state, ...action.payload }
      persistLocalStoregeUser(result)
      return result;
    },
    resetUser: () => {
      localStorage.removeItem("user")
      return EmptyUserState;
    },
  },
});

export const { createUser, updateUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
