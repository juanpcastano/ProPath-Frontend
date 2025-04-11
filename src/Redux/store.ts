import { configureStore } from "@reduxjs/toolkit";
import { UserInfo } from "../models/user.model";
import userSliceReducer from "./States/user";
import { Path } from "../models/path.model";
import pathSliceReducer from "./States/path";

export interface AppStore {
  user: UserInfo;
  path: Path;
}

export default configureStore<AppStore>({
  reducer: {
    user: userSliceReducer,
    path: pathSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["your/action/type"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["meta.arg", "payload.timestamp"],
        // Ignore these paths in the state
        ignoredPaths: ["items.dates"],
      },
    }),
});
