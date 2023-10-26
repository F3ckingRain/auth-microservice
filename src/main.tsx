import React from "react";

import { CookiesProvider } from "react-cookie";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";

import App from "./App";

import "./main.scss";

const isProd = import.meta.env.PROD;

ReactDOM.createRoot(document.getElementById("root")!).render(
  isProd ? (
    <React.StrictMode>
      <CookiesProvider>
        <BrowserRouter>
          <RecoilRoot>
            <App />
          </RecoilRoot>
        </BrowserRouter>
      </CookiesProvider>
    </React.StrictMode>
  ) : (
    <CookiesProvider>
      <BrowserRouter>
        <RecoilRoot>
          <App />
        </RecoilRoot>
      </BrowserRouter>
    </CookiesProvider>
  ),
);
