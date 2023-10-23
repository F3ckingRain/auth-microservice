import React from "react";

import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";

import App from "./App";

import "./main.scss";

const isProd = import.meta.env.PROD;

ReactDOM.createRoot(document.getElementById("root")!).render(
  isProd ? (
    <React.StrictMode>
      <BrowserRouter>
        <RecoilRoot>
          <App />
        </RecoilRoot>
      </BrowserRouter>
    </React.StrictMode>
  ) : (
    <BrowserRouter>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </BrowserRouter>
  ),
);
