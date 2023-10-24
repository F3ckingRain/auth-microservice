import dns from "dns";

import federation from "@originjs/vite-plugin-federation";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteSvgr from "vite-plugin-svgr";
import viteTsConfig from "vite-tsconfig-paths";

dns.setDefaultResultOrder("verbatim");

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "authService",
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
    viteTsConfig(),
  ],
  server: {
    strictPort: true,
    port: 9090,
    host: true,
  },
  preview: {
    strictPort: true,
    port: 4174,
    host: true,
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
