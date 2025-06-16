import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  plugins: [vue(), mkcert()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    https: {}, // ✅ lets mkcert inject the certs
  },
});
