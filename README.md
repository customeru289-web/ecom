# Luxora - Premium E-Commerce Platform

A full-stack luxury e-commerce web application with a customer storefront and professional admin dashboard.

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Framer Motion, React Router, Axios, Recharts  
**Backend:** Node.js, Express, JWT, Bcrypt, Multer  
**Database:** MongoDB, Mongoose

## Features

### Customer Store
- Premium responsive UI with dark/light mode
- Home page with hero, featured products, categories, testimonials
- Shop with search, filters, sorting, pagination
- Product details with image zoom, reviews, wishlist
- Cart, coupons, checkout (COD + Stripe structure)
- User dashboard (profile, orders, addresses, wishlist)

### Admin Panel
- Dashboard with sales analytics and revenue charts
- Product, category, order, customer management
- Review moderation, coupon management
- CMS for banners and testimonials
- Store settings and payment configuration

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally or MongoDB Atlas

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
npm install
npm run seed    # Seed demo data
npm run dev     # Starts on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev     # Starts on http://localhost:5173
```

### Demo Accounts

| Role     | Email                 | Password    |
|----------|-----------------------|-------------|
| Admin    | admin@luxora.com      | admin123    |
| Customer | customer@luxora.com   | customer123 |

Demo coupon: `LUXORA20`

## Project Structure

```
ecom/
├── backend/
│   ├── config/          # Database config
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth, upload, validation
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── utils/           # Helpers, seed script
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Auth, cart, theme
│   │   ├── hooks/       # Custom hooks
│   │   ├── layouts/     # Page layouts
│   │   ├── pages/       # Route pages
│   │   └── services/    # API client
│   └── vite.config.js
└── README.md
```

## API Endpoints

| Method | Endpoint                    | Description          |
|--------|-----------------------------|----------------------|
| POST   | /api/auth/register          | Register user        |
| POST   | /api/auth/login             | Login                |
| GET    | /api/products               | List products        |
| GET    | /api/cart                   | Get cart (auth)      |
| POST   | /api/orders                 | Create order (auth)  |
| GET    | /api/admin/dashboard        | Admin stats          |

Full API available at `http://localhost:5000/api/health`

## Production Deployment (Client Handoff)

For selling this site to a paying customer, use **MongoDB Atlas** (not local MongoDB). Recommended production tier: **M10 dedicated cluster** or higher.

### Why MongoDB Atlas for clients

- Managed backups, monitoring, and security patches
- No database server for the client to maintain
- Works with this app via `MONGO_URI` only — no code changes
- Professional setup you can document and hand off

| Use case | Recommended Atlas tier |
|----------|------------------------|
| Demo / portfolio | M0 (Free) — dev only |
| Small shop going live | M2/M5 or M10 |
| **Paying customer ($1000+)** | **M10 dedicated (minimum)** |
| High traffic | M20+ |

---

### Step 1: Create MongoDB Atlas cluster

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create an account (use the **client’s** account so they own the data).
2. Create a **new project** (e.g. `Luxora Production`).
3. Click **Build a Database** → choose **M10** (or M0 for demos).
4. Select a **cloud provider & region** close to your API host (e.g. AWS `us-east-1` if backend is on Render US).
5. Name the cluster (e.g. `luxora-prod`).

---

### Step 2: Database access

1. In Atlas: **Database Access** → **Add New Database User**
2. Authentication: **Password**
3. Username: e.g. `luxora_api`
4. Generate a strong password and store it securely (password manager — never in git).
5. Privileges: **Read and write to any database** (or restrict to `luxora` database only).

---

### Step 3: Network access

1. In Atlas: **Network Access** → **Add IP Address**
2. For production API on Render/Railway/VPS: add the host’s outbound IP(s), or use the provider’s documented IP ranges.
3. For initial setup from your machine: add your current IP temporarily, then remove after deployment.
4. Avoid `0.0.0.0/0` (allow from anywhere) in production unless required and understood by the client.

---

### Step 4: Get connection string

1. In Atlas: **Database** → **Connect** → **Drivers**
2. Copy the connection string, e.g.:

```
mongodb+srv://luxora_api:<password>@luxora-prod.xxxxx.mongodb.net/luxora?retryWrites=true&w=majority
```

3. Replace `<password>` with the database user password (URL-encode special characters if needed).
4. Database name in the URI: use `luxora` for production, `luxora-dev` for staging.

---

### Step 5: Backend environment variables

Set these on your host (Render, Railway, VPS, etc.). Copy from `backend/.env.example`:

| Variable | Production value |
|----------|------------------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` (or host default) |
| `MONGO_URI` | Atlas connection string from Step 4 |
| `JWT_SECRET` | Long random string (32+ chars) — **new for each client** |
| `JWT_EXPIRE` | `7d` |
| `CLIENT_URL` | `https://yourstore.com` (frontend URL) |
| `STRIPE_SECRET_KEY` | Client’s live Stripe key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `EMAIL_HOST` / `EMAIL_USER` / `EMAIL_PASS` | Client SMTP (password reset emails) |

**Never commit `.env` or share secrets in email/chat as plain text.**

---

### Step 6: Seed production (optional)

Run once after Atlas is connected:

```bash
cd backend
# Set MONGO_URI to production Atlas URI locally, or run seed from host console
npm run seed
```

Then **change default passwords** immediately:

- `admin@luxora.com` → new strong admin password
- `customer@luxora.com` → delete or disable demo customer in production

For real launches, prefer creating a fresh admin via register + manual role update, or a one-off admin script — not demo credentials.

---

### Step 7: Deploy backend

**Render / Railway**

1. Connect repo, set root directory to `backend`
2. Build: `npm install`
3. Start: `npm start`
4. Add all env vars from Step 5
5. Enable persistent disk or cloud storage for `uploads/` if product images are uploaded locally (or use S3/Cloudinary for scale)

**Docker**

```bash
cd backend && docker build -t luxora-api .
docker run -p 5000:5000 --env-file .env luxora-api
```

Verify: `https://your-api.com/api/health`

---

### Step 8: Deploy frontend

**Vercel / Netlify**

1. Root directory: `frontend`
2. Build: `npm run build`
3. Output: `dist`
4. Environment variable:

```
VITE_API_URL=https://your-api.com/api
```

5. Configure SPA fallback so all routes serve `index.html`.

Update `frontend/vercel.json` rewrite destination to your real API URL before deploy.

---

### Step 9: Client handoff checklist

Deliver to the client:

- [ ] MongoDB Atlas login (their account)
- [ ] Admin panel URL: `https://yourstore.com/admin`
- [ ] Admin credentials (not demo defaults)
- [ ] Stripe dashboard access (if payments enabled)
- [ ] List of all env vars (names only; secrets via secure channel)
- [ ] Backup policy: Atlas M10 → enable **Cloud Backup**
- [ ] Domain + SSL on frontend and API
- [ ] Short doc: how to add products, manage orders, change banners

---

### Recommended production stack

| Layer | Service |
|-------|---------|
| Database | MongoDB Atlas **M10+** |
| API | Render, Railway, or VPS |
| Frontend | Vercel or Netlify |
| Payments | Stripe (live keys) |
| Email | Gmail SMTP, SendGrid, or Resend |

Local MongoDB (`mongodb://127.0.0.1:27017`) is for **development only**, not for customer delivery.

---

## Deployment (Quick Reference)

### Backend (Render/Railway)

1. Set environment variables from `.env.example`
2. Start command: `npm start`
3. Set `MONGO_URI` to MongoDB Atlas connection string

### Frontend (Vercel/Netlify)

1. Build command: `npm run build`
2. Output directory: `dist`
3. Set `VITE_API_URL` to your production API URL

### Docker (Optional)

```bash
cd backend && docker build -t luxora-api .
docker run -p 5000:5000 --env-file .env luxora-api
```

## Security

- JWT authentication with bcrypt password hashing
- Role-based access control (user/admin)
- Rate limiting, Helmet, input validation
- Protected admin routes

## License

MIT
