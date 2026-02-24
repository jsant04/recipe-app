# Recipes PWA

A Progressive Web App for browsing recipes from TheMealDB with offline-capable favorites, built with React + Vite, Tailwind, shadcn-style UI, and a Node/Express proxy.

## Features

- Search meals, browse by category, and view detailed recipes
- Favorites stored in IndexedDB and available offline
- Installable PWA with precached app shell and offline fallback page
- Node/Express backend proxy for TheMealDB (API key never exposed to client)
- TanStack Query for data fetching & caching
- Accessible, keyboard-friendly UI with skeletons and error states

## Tech Stack

- Client: React 18, Vite, TypeScript, Tailwind CSS, shadcn-style components, TanStack Query, React Router, sonner
- Server: Node.js, Express, TypeScript, Axios, Helmet, CORS, Compression

## Setup

### Server

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

The API will be available at `http://localhost:5174` by default.

### Client

```bash
cd client
npm install
npm run dev
```

The UI will be served at `http://localhost:5173` and proxies `/api/*` to the server.

## Environment Variables (Server)

Configured via `server/.env`:

- `MEALDB_API_BASE` (default `https://www.themealdb.com/api/json/v1`)
- `MEALDB_API_KEY` (default `1` for local dev)
- `PORT` (default `5174`)

## shadcn-style UI

This project includes a minimal subset of shadcn/ui-style primitives (Button, Card, Input, Badge, Dialog, Skeleton) wired to Tailwind. To expand with real shadcn/ui components:

1. Install the CLI in the client:
   ```bash
   cd client
   npx shadcn-ui@latest init
   ```
2. Generate components as needed (e.g. dialog, toast) and adjust imports in `src/components/ui`.

## PWA Details

- Manifest: `client/public/manifest.webmanifest`
- Service worker entry: `client/public/sw.js` (delegates to `src/sw.js`)
- Offline fallback page: `client/public/offline.html`

### Caching Strategies

Implemented in `client/src/sw.js`:

- App shell (`/`, `/index.html`, icons, manifest, offline page): **pre-cached** on install
- API routes (`/api/*`): **Network-first** with cache fallback for offline usage
- Images & category-related requests: **Stale-While-Revalidate** to keep UI snappy while refreshing in the background
- All other same-origin requests: **Cache-first** as a safe default

You can adjust strategies in the `fetch` handler of the service worker.

### Testing Offline

1. Run both server and client in dev.
2. Open `http://localhost:5173` in Chrome.
3. Open DevTools → Application → Service Workers and ensure `sw.js` is installed.
4. Use DevTools → Network → Offline to simulate offline mode.
5. You should still be able to:
   - Load the app shell
   - Open the Favorites page and view previously saved meals
   - See the offline toast when the network is lost

## Post-generation Checklist

- [ ] Run `npm install` in both `server` and `client`.
- [ ] Replace placeholder icons in `client/public/icons` with your own.
- [ ] Optionally run `npx shadcn-ui@latest init` and generate additional components.
- [ ] Configure production builds: `npm run build` in both `server` and `client`.
- [ ] Deploy server (e.g., Render, Railway) and client (e.g., Netlify, Vercel), updating `CLIENT_ORIGIN` and CORS as needed.
