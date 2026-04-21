import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

// SPA Vite plana — output a dist/ para GitHub Pages.
// El base se calcula automáticamente:
// 1) En GitHub Actions: usa el nombre del repo (GITHUB_REPOSITORY="owner/repo" → "/repo/").
// 2) En local/preview de Lovable: "/" para que cargue sin prefijo.
// 3) Override manual: define VITE_BASE si quieres forzar un valor.
function resolveBase() {
  if (process.env.VITE_BASE) return process.env.VITE_BASE;
  const repo = process.env.GITHUB_REPOSITORY; // "owner/repo"
  if (repo && repo.includes("/")) {
    const name = repo.split("/")[1];
    // user/organization site (owner.github.io) se sirve en raíz.
    if (name.endsWith(".github.io")) return "/";
    return `/${name}/`;
  }
  return "/";
}
const base = resolveBase();

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
