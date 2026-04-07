import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const appDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  envDir: path.resolve(appDir, "../.."),
  plugins: [react(), tailwindcss()],
  server: {
    port: 5175,
    strictPort: true,
  },
});