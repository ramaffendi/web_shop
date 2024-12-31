import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Membuka akses untuk semua IP di jaringan lokal
    port: 5173, // Port yang akan digunakan (default adalah 5173)
  },
});
