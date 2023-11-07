import dns from "dns";
import { resolve } from "path";

import federation from "@originjs/vite-plugin-federation";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteSvgr from "vite-plugin-svgr";

dns.setDefaultResultOrder("verbatim");

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "auth-service",
      filename: "authService.js",
      exposes: {
        "./AuthWindow":
          "./src/containers/AuthWindowContainer/AuthWindowContainer",
        "./ModalModel": "./src/models/ModalModel/ModalModel",
      },
      shared: [
        "react",
        "react-dom",
        "react-router-dom",
        "recoil",
        "@ca-actual-projects/sobankui",
      ],
    }),
    viteSvgr(),
  ],
  server: {
    strictPort: true,
    port: 9090,
    host: true,

    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      Accept: "application/json, text/plain, */*",
    },

    cors: {
      origin: ["https://dev-front.onbank.online"],
    },
  },
  preview: {
    strictPort: true,
    port: 4174,
    host: true,

    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      Accept: "application/json, text/plain, */*",
    },

    cors: {
      origin: ["https://dev-front.onbank.online"],
    },
  },

  resolve: {
    alias: {
      "@": resolve(__dirname, "../src"),
      $fonts: resolve(__dirname, "../src/assets/fonts"),
    },
  },

  root: "src",
  publicDir: "../public",
  envDir: "../../.",
  base: "",
  build: {
    outDir: "../build",
    emptyOutDir: true,
    modulePreload: false,
    minify: false,
    target: "esnext",
    cssCodeSplit: false,
  },
});
