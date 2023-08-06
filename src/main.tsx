import React from "react";

import { ApiProvider } from "@reduxjs/toolkit/dist/query/react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./main.scss";

import { AuthApi } from "@/api/AuthApi";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApiProvider api={AuthApi}>
      <App />
    </ApiProvider>
  </React.StrictMode>,
);
