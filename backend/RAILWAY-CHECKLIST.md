# Railway deploy checklist — read if npm build fails

## Required Railway settings

| Setting | Value |
|---------|--------|
| **Root Directory** | `backend` |
| **Start Command** | leave EMPTY (uses railway.toml → `node server.js`) |
| **Build Command** | leave EMPTY (auto `npm install`) |

Do NOT set start to `npm start --prefix backend` when root is already `backend`.

---

## Required variables

```
NODE_ENV=production
MONGO_URI=mongodb+srv://USER:PASS@cluster0.fvuezta.mongodb.net/luxora?retryWrites=true&w=majority
JWT_SECRET=your_secret_here
JWT_EXPIRE=7d
CLIENT_URL=https://ecom-one-pink.vercel.app
```

---

## If you see "Missing script: start" or "Did you mean npm star?"

Railway is building from the **wrong folder** (repo root instead of `backend`).

Fix: Settings → Root Directory → `backend` → Redeploy.

---

## After deploy, test

https://luxora-api-production.up.railway.app/api/health
