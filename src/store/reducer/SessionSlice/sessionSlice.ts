import { createSlice } from "@reduxjs/toolkit";

import initialState from "@/store/reducer/SessionSlice/data";

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {},
});

export const {} = sessionSlice.actions;

export default sessionSlice.reducer;
