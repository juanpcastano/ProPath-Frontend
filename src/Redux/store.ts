import { configureStore } from "@reduxjs/toolkit";
import { UserInfo } from "../models/user.model";
import userSliceReducer from "./States/user";

export interface AppStore{
    user: UserInfo;
}

export default configureStore<AppStore>({
    reducer:{
        user: userSliceReducer
    }
})