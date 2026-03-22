# CRM Portal

## 1. Project Overview

This repository contains a **decoupled CRM self-service portal** built with two independent layers: a **Frappe backend app** (`backend/custom_crm_api`) that exposes authenticated REST endpoints via `@frappe.whitelist()`, and a **React + Vite frontend** (`frontend/`) that communicates with those endpoints through Axios. The frontend uses Zustand for auth state, TanStack Query for server state, and React Router v6 for client-side routing. All UI components are built with Tailwind CSS and contain inline comments pointing to [Untitled UI React](https://www.untitledui.com/react) replacements, making a design-system upgrade a straightforward swap.

---

## 2. Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 20 + |
| Python | 3.11 + |
| Frappe Bench | Latest stable |
| npm | 10 + |

You must have a **running Frappe bench** with at least one site before proceeding.

---

## 3. Backend Setup

```bash
# 1. Copy the app into your bench's apps directory
cp -r backend/custom_crm_api /path/to/bench/apps/

# 2. Install the app onto your site
cd /path/to/bench
bench --site your-site.localhost install-app custom_crm_api

# 3. Run migrations (creates any required DocType records)
bench --site your-site.localhost migrate

# 4. Restart the bench
bench restart
```

> **Tip:** If you want the role "Customer Portal User" to exist, create it in
> Frappe's Role Manager (Setup → Roles) before registering portal users.

---

## 4. CORS Configuration

Because the React dev server runs on a different origin (`localhost:5173`) from
Frappe (`localhost:8000`), you must enable CORS in Frappe's
`common_site_config.json` (found at `frappe-bench/sites/common_site_config.json`):

```json
{
  "allow_cors": "http://localhost:5173",
  "cors_headers": "Authorization,Content-Type,X-Frappe-CSRF-Token"
}
```

> **This project's Frappe instance:** `medic-demo.thedaystar.co.za`
> Add your local dev server origin (e.g. `http://localhost:5173`) to `allow_cors` on that server.

Restart gunicorn after editing:

```bash
bench restart
```

> In production the React build is served from the same domain via nginx, so
> CORS headers are not required. Remove or restrict `allow_cors` in production.

---

## 5. Frontend Setup

```bash
cd frontend

# Copy the development environment file
cp .env.development .env.local   # or just use .env.development directly

# Install dependencies
npm install

# Start the Vite dev server (proxies /api → localhost:8000)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## 6. Production Deployment

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   # Output is in frontend/dist/
   ```

2. Serve `dist/` with nginx and proxy `/api` to Frappe:
   ```nginx
   server {
     listen 80;
     server_name your-frappe-site.com;

     root /path/to/frontend/dist;
     index index.html;

     # SPA fallback
     location / {
       try_files $uri $uri/ /index.html;
     }

     # Frappe API proxy
     location /api {
       proxy_pass http://127.0.0.1:8000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Frappe-CSRF-Token $http_x_frappe_csrf_token;
     }
   }
   ```

3. Update `frontend/.env.production` with your production URL, then rebuild.

---

## 7. Replacing Placeholder UI with Untitled UI React

Every placeholder component contains a comment in the format:

```js
// UNTITLED UI: Replace with <ComponentName> —
//   see untitledui.com/react/components/<slug>
```

To upgrade:

1. **Install Untitled UI React** via their CLI:
   ```bash
   npx @untitled-ui/react init
   ```

2. **Follow the token setup** documented at
   [untitledui.com/react/docs](https://www.untitledui.com/react/docs) and add
   the token overrides to `frontend/src/assets/global.css` inside the
   `@theme {}` block.

3. **Swap each component** by searching for `UNTITLED UI:` in `frontend/src/`
   and replacing the placeholder implementation with the imported Untitled UI
   component according to the linked documentation.

4. Remove the placeholder component files once all usages are migrated.
