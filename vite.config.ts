import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

// SPA Vite plana — output a dist/ para GitHub Pages.
// Si renombras el repo, ajusta VITE_BASE (ej: "/care-pathways-app/").
const base = process.env.VITE_BASE ?? "/care-pathways-app/";

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
