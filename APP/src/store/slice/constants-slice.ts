import { createSlice } from "@reduxjs/toolkit";

export interface Constant {
  api: string;
}

const initialState: Constant = {
  api: "http://localhost:3001/api",
};

export const constantSlice = createSlice({
  name: "locale",
  initialState,
  reducers: {},
});
export default constantSlice.reducer;
