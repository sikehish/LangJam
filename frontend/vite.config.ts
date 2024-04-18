import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
  // strictPort: true,
    proxy: {
      "/api": {
        target: "http://backend:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
