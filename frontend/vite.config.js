// ─────────────────────────────────────────────────────────────────────────────
// DEVELOPMENT PROXY — IMPORTANT NOTE
// ─────────────────────────────────────────────────────────────────────────────
// The proxy below forwards all /api/* requests from the Vite dev server to your
// local Frappe bench (http://localhost:8000). This is DEVELOPMENT ONLY.
//
// In PRODUCTION you must set up an nginx reverse proxy. Example location block:
//
//   location /api {
//     proxy_pass http://127.0.0.1:8000;
//     proxy_set_header Host $host;
//     proxy_set_header X-Real-IP $remote_addr;
//     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
//     proxy_set_header X-Frappe-CSRF-Token $http_x_frappe_csrf_token;
//   }
//
// See README.md § Production Deployment for the full nginx config.
// ─────────────────────────────────────────────────────────────────────────────

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
