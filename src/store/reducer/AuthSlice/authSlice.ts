import { createSlice } from "@reduxjs/toolkit";

import initialState from "@/store/reducer/AuthSlice/data";

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {},
});

export const {} = authSlice.actions;
export default authSlice.reducer;
