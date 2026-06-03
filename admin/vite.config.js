import path from "path";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  cacheDir: "node_modules/.vite-admin",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
