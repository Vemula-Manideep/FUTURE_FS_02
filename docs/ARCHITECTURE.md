# ClientFlow Mini CRM Architecture

## 1. High-level system

ClientFlow is a SaaS-style MERN application split into two deployable services:

- **React/Vite frontend**: protected dashboard, lead tables, pipeline board, analytics, theme, client-side routing, React Query cache.
- **Express API**: authentication, RBAC, validation, lead workflows, follow-ups, notifications, dashboard aggregation, security middleware.
- **MongoDB Atlas/local MongoDB**: document database with indexed collections for users, leads, follow-ups, activity logs, and notifications.

This split keeps the frontend independently deployable on Vercel and the backend independently deployable on Render/Railway.

## 2. Frontend/backend communication

The frontend calls the API through `axios` in `client/src/lib/api.js`.

- `withCredentials: true` sends HTTP-only auth cookies.
- React Query owns server state, caching, refetching, loading states, and retry behavior.
- The API responds with a reusable envelope: `{ success, message, data, meta }`.

## 3. Authentication flow

1. User submits email/password.
2. Server verifies bcrypt password hash.
3. Server creates a short-lived access token and longer-lived refresh token.
4. Tokens are stored in HTTP-only cookies to reduce token theft through XSS.
5. Protected routes call `/auth/me`.
6. Axios refreshes the session through `/auth/refresh` after a `401`.
7. Logout clears cookies and invalidates the stored refresh token hash.

Access tokens carry only minimal claims: user id, role, and permissions. Refresh tokens are hashed in MongoDB so a database leak does not expose live refresh tokens directly.

## 4. Database design

Collections:

- **Users**: identity, role, permissions, password hash, refresh token hash, account status.
- **Leads**: client details, source, status, owner, priority, tags, estimated value, embedded communication history.
- **FollowUps**: notes, reminders, due dates, completion state, author.
- **ActivityLogs**: immutable audit events for user actions.
- **Notifications**: reminders, assignments, read/unread state.

Indexes are placed on email, role/status/source/priority, assigned owner, text search fields, due dates, and recent activity timestamps. This supports common CRM queries without scanning the full database.

## 5. API architecture

Routes are version-ready under `/api`:

- `/api/auth`: register, login, logout, refresh, forgot password, me.
- `/api/leads`: create, list, detail, update, delete, bulk update.
- `/api/follow-ups`: add/update/delete notes and reminders.
- `/api/dashboard`: aggregated charts and stats.
- `/api/notifications`: alerts and read state.

Each route follows the same pipeline: security middleware, auth middleware, RBAC where needed, Zod validation, controller, centralized error handler.

## 6. Deployment architecture

Recommended production layout:

- **Vercel** hosts `client`.
- **Render/Railway** hosts `server`.
- **MongoDB Atlas** hosts the database.
- CI runs tests/builds on pull requests.
- Environment variables are injected by each platform.

The frontend needs `VITE_API_URL`. The backend needs `MONGO_URI`, JWT secrets, `CLIENT_URL`, and cookie/security settings.

## 7. Security considerations

- **Helmet** sets safer HTTP headers.
- **CORS** restricts browser access to the known frontend origin.
- **HTTP-only cookies** protect JWTs from direct JavaScript access.
- **Refresh token hashing** reduces damage from database leaks.
- **Rate limiting** slows brute-force login attempts and API abuse.
- **Zod validation** rejects malformed input before business logic.
- **Mongo sanitization** reduces NoSQL operator injection risk.
- **bcrypt** protects passwords with slow salted hashes.
- **Centralized errors** avoid leaking implementation details in production.

## 8. Scalability considerations

- Controllers remain thin; business logic can move into services as workflows grow.
- Mongo indexes match the highest-frequency CRM queries.
- Aggregation powers dashboard metrics without loading every lead into Node.
- React Query prevents repeated network calls and gives consistent loading/error states.
- Docker and environment-driven config make staging/production parity easier.
- Future scale paths: Redis caching for dashboard aggregates, queues for email/reminders, Socket.io for real-time notifications, tenant scoping for multi-company SaaS.

## Phase notes

- [Phase 1 Foundation](PHASE-1-FOUNDATION.md): service/repository architecture, Redis cache abstraction, Socket.io events, lead scoring, Zustand UI state, command palette, lazy loading.
