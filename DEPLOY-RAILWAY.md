# Deploy Luxora Backend to Railway

## Prerequisites

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster running
- [Railway](https://railway.com) account
- GitHub account (recommended) or Railway CLI

---

## Step 1 — Prepare MongoDB Atlas

1. **Network Access** → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`)
2. **Database Access** → ensure DB user exists
3. Copy connection string (Drivers → Node.js):

```
mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/luxora?retryWrites=true&w=majority
```

---

## Step 2 — Deploy via Railway Dashboard (easiest)

1. Go to [railway.com/new](https://railway.com/new)
2. **Deploy from GitHub repo**
   - Push this project to GitHub first (see Step 4 below)
   - Select the repo
3. **Settings → Root Directory** → set to: `backend`
4. Railway auto-detects Node.js and runs `npm start`

---

## Step 3 — Set environment variables

Railway → your service → **Variables** → add from `backend/railway.env.example`:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `MONGO_URI` | your Atlas connection string |
| `JWT_SECRET` | long random secret |
| `CLIENT_URL` | your frontend URL (e.g. Vercel) |

Click **Deploy** after saving variables.

---

## Step 4 — Push code to GitHub

```bash
cd d:\ecom
git init
git add .
git commit -m "Luxora e-commerce initial release"
git branch -M main
git remote add origin https://github.com/YOUR_USER/luxora.git
git push -u origin main
```

---

## Step 5 — Generate public URL

1. Railway → service → **Settings** → **Networking**
2. Click **Generate Domain**
3. Your API URL: `https://your-app.up.railway.app`
4. Test: `https://your-app.up.railway.app/api/health`

---

## Step 6 — Seed production database (once)

From your PC (with `MONGO_URI` pointing to Atlas):

```bash
cd backend
npm run seed
```

Then **change the admin password** immediately.

---

## Step 7 — Connect frontend

Set on Vercel/Netlify:

```
VITE_API_URL=https://your-app.up.railway.app/api
```

Update Railway `CLIENT_URL` to your frontend URL.

---

## Deploy via Railway CLI (alternative)

```bash
npm install -g @railway/cli
railway login
cd backend
railway init
railway variables set NODE_ENV=production
railway variables set MONGO_URI="mongodb+srv://..."
railway variables set JWT_SECRET="your-secret"
railway variables set CLIENT_URL="https://your-frontend.vercel.app"
railway up
railway domain
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails | Root directory must be `backend` |
| MongoDB timeout | Atlas Network Access → allow `0.0.0.0/0` |
| CORS error | Set `CLIENT_URL` to exact frontend URL (no trailing `/`) |
| 502 on health | Check deploy logs; verify `MONGO_URI` |
| Images disappear | Railway disk is ephemeral — use Cloudinary/S3 for production uploads |

---

## Notes

- Do **not** commit `.env` — use Railway Variables only
- `uploads/` folder resets on redeploy — plan cloud storage for product images
- Health check path: `/api/health`
