import { configureStore } from "@reduxjs/toolkit";
import { UserInfo } from "../models/user.model";
import userSliceReducer from "./States/user";
import { Path } from "../models/path.model";
import pathSliceReducer from "./States/path";

export interface AppStore{
    user: UserInfo;
    path: Path;
}

export default configureStore<AppStore>({
    reducer:{
        user: userSliceReducer,
        path: pathSliceReducer,
    }
})