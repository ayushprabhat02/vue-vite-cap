// import { defineConfig } from "vite";
// import vue from "@vitejs/plugin-vue";

// // https://vite.dev/config/
// // export default defineConfig({
// //   plugins: [vue()],
// // })

// export default defineConfig({
//   plugins: [vue()],
//   server: {
//     host: "0.0.0.0", // 👈 exposes server to LAN
//     port: 5173, // 👈 optional (default is 5173)
//   },
// });

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
