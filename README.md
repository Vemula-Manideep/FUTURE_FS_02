# ClientFlow Mini CRM

Production-grade MERN SaaS-style Client Lead Management System for agencies and sales teams.

## What is included

- JWT auth with access/refresh tokens and HTTP-only cookies
- Role-based access control for Admin, Manager, and Sales Executive
- Lead CRUD, search, filtering, pagination-ready API, bulk update, CSV export
- Follow-up notes, reminders, activity logs, notifications
- Dashboard analytics with Recharts
- Responsive React admin dashboard with dark/light mode
- Secure Express API with Helmet, CORS, rate limiting, Zod validation, Mongo sanitization
- Docker, GitHub Actions CI, deployment-ready env templates

## Architecture

Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the system design, auth flow, schema decisions, API architecture, deployment plan, and security reasoning.

Phase documentation:

- [Phase 1 Foundation](docs/PHASE-1-FOUNDATION.md)

## Local setup

1. Install dependencies:

```bash
npm --prefix server install
npm --prefix client install
```

2. Create environment files:

```bash
copy server\.env.example server\.env
copy client\.env.example client\.env
```

3. Start MongoDB locally or update `server/.env` with MongoDB Atlas.

4. Seed demo data:

```bash
npm run seed
```

5. Run the app:

```bash
npm run dev:server
npm run dev:client
```

Demo account after seeding:

- Email: `admin@minicrm.test`
- Password: `Password123!`

## Folder structure

```txt
client/
  src/components       Reusable UI and layout components
  src/features         Feature modules: auth, dashboard, leads
  src/lib              API client and utilities
  src/routes           Route guards
server/
  src/config           Env and database setup
  src/controllers      Request orchestration
  src/middleware       Auth, RBAC, validation, security, errors
  src/models           Mongoose schemas and indexes
  src/routes           REST route definitions
  src/schemas          Zod API validation contracts
  src/services         Business services such as activity logging
docs/                  Architecture and API notes
```

## Deployment

- Frontend: deploy `client` to Vercel. Set `VITE_API_URL=https://your-api.onrender.com/api`.
- Backend: deploy `server` to Render or Railway. Set all variables from `server/.env.example`.
- Database: create MongoDB Atlas cluster, allow your backend IP/provider, and use the Atlas connection string as `MONGO_URI`.

## Resume description

Built a production-style MERN SaaS CRM with secure JWT cookie authentication, RBAC, MongoDB schema design with indexes, lead pipeline management, follow-up reminders, analytics dashboards, reusable React components, Docker support, and CI pipeline.
