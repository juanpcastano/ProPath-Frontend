import { createSlice } from "@reduxjs/toolkit";
import { Path } from "../../models/path.model";

export const emptyPathState: Path = {
  id: "0",
  name: "",
  description: "",
  state: "",
  totalBudget: 0,
  totalHours: 0,
  activities: [],
};

export const persistLocalStoregePath = (path: Path ) => {
    localStorage.setItem("path", JSON.stringify({ ...path }))
};

export const pathSlice = createSlice({
  name: "path",
  initialState: localStorage.getItem("path")
    ? JSON.parse(localStorage.getItem("path") as string)
    : emptyPathState,
  reducers: {
    createPath: (_state, action) => {
      persistLocalStoregePath(action.payload)
      return action.payload;
    },
    updatePath: (state, action) => {
      const result = { ...state, ...action.payload }
      persistLocalStoregePath(result)
      return result;
    },
    resetPath: () => {
      localStorage.removeItem("path")
      return emptyPathState;
    },
  },
});

export const { createPath, updatePath, resetPath } = pathSlice.actions;

export default pathSlice.reducer;
