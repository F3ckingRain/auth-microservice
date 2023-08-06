import federation from "@originjs/vite-plugin-federation";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteSvgr from "vite-plugin-svgr";
import viteTsConfig from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "bca-auth-service",
      filename: "authEntry.js",
      exposes: {
        "./AuthWindow": "./src/components/AuthWindow/AuthWindow",
        "./AuthModal": "./src/components/AuthModal/AuthModal",
      },
      shared: ["react", "react-dom", "react-router-dom"],
    }),
    viteSvgr(),
    viteTsConfig(),
  ],
  server: {
    strictPort: true,
    port: 9092,
    host: true,
  },
  preview: {
    strictPort: true,
    port: 9092,
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
