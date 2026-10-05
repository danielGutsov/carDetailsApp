# Vehicle Reminder

Tracks insurance, inspection, fire extinguisher validity, and tyre counts per vehicle, with a red warning when something expires within 10 days.

## Structure
- `server/` — Express + TypeScript + SQLite API (auth, vehicles CRUD)
- `client/` — React + TypeScript + Vite frontend (Normal card view / Excel table view)

## Running locally

Requires Node.js 22 LTS (Node 24 has a known crash with `better-sqlite3`'s native addon — stick to 22 for now).

```bash
cd server && npm install && npm run dev   # http://localhost:4000
```

```bash
cd client && npm install && npm run dev   # http://localhost:5173
```

Open http://localhost:5173 — the Vite dev server proxies `/api` requests to the backend.

## Deploying later

- `server/.env.example` shows the env vars to set (`JWT_SECRET` especially — generate a long random value for production).
- `npm run build` in both `server/` and `client/` produces `server/dist` and `client/dist`.
- In production (`NODE_ENV=production`), the Express server also serves the built client from `client/dist`, so a single Node process + the SQLite file is all you need on a VPS behind your domain.

### Deploying to Render (free tier, for trying it out)

`render.yaml` at the repo root is a Render Blueprint — it defines the whole service, so Render mostly configures itself.

1. Push this repo to GitHub (create an empty repo on github.com, then `git remote add origin <url> && git push -u origin main`).
2. On render.com: sign up / log in → **New** → **Blueprint** → connect the GitHub repo. Render reads `render.yaml` and proposes the service — click **Apply**.
3. First deploy takes a few minutes (`npm install` + build for both client and server).
4. Once live, your URL is `https://<service-name>.onrender.com`. If Render appended a random suffix because `vehicle-reminder` was taken, update the `CLIENT_ORIGIN` env var in the Render dashboard to match (Settings → Environment) — not critical for the app to work, just cleanliness.

**Important limitation on the free tier**: Render's free web services have no persistent disk — the SQLite file (and everything in it) is wiped on every redeploy, and also when the service spins down from inactivity and back up. That's fine for trying the app out, but don't treat it as your real data store yet. When you're ready to rely on it, either upgrade to a paid Render plan with a persistent disk, or move to the Hetzner VPS path instead.
