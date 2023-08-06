import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import AuthReducer from "../reducer/AuthSlice/authSlice";
import SessionReducer from "../reducer/SessionSlice/sessionSlice";

import { AuthApi } from "@/api/AuthApi";

const rootReducer = combineReducers({
  [AuthApi.reducerPath]: AuthApi.reducer,
  AuthReducer,
  SessionReducer,
});

export const setupStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(AuthApi.middleware),
    devTools: true,
  });

const store = setupStore();

setupListeners(store.dispatch);

export type AppStore = ReturnType<typeof setupStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];

export default store;
