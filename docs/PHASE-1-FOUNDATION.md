# Phase 1: SaaS CRM Foundation

## Concept

Phase 1 turns the project from a working MERN app into a scalable SaaS foundation. The goal is not more screens; the goal is stronger product architecture:

- HTTP controllers stay thin.
- Services own CRM business rules.
- Repositories own database queries.
- Redis caches read-heavy CRM views.
- Socket.io broadcasts workflow events.
- Zustand owns client workspace UI state.
- Feature routes are lazy-loaded for better production bundles.

## Architecture decisions

### API versioning

Routes now live under `/api/v1`. Versioning protects future clients when the API contract changes. The older `/api/*` aliases remain temporarily for backward compatibility.

### Repository pattern

Lead queries moved to `server/src/repositories/lead.repository.js`. This prevents controllers from knowing query details, population strategy, pagination math, or index behavior.

### Service layer

Lead workflows moved to `server/src/services/lead.service.js`. This is where business actions happen:

- calculate lead score
- create notifications
- write audit logs
- invalidate Redis cache
- emit websocket events

That keeps behavior consistent whether a lead is updated by REST, a future background job, or an admin automation.

### Redis abstraction

`cache.service.js` hides Redis behind `getJSON`, `setJSON`, and `deleteByPattern`. Redis is optional through `ENABLE_REDIS=false`, so local development and CI work without an external cache.

### Realtime layer

Socket.io is initialized in `server.js`, while services emit domain events through `emitWorkspaceEvent`. This avoids coupling controllers to websocket infrastructure.

### Frontend state

Zustand stores workspace UI state such as command palette visibility, filters, and sidebar preferences. React Query remains responsible for server state. This separation is important:

- Zustand: local UI state
- React Query: API data, cache, retries, loading state

## Folder structure added

```txt
server/src/repositories/
  lead.repository.js        Mongo query boundary

server/src/services/
  cache.service.js          Redis wrapper
  lead.service.js           Lead workflow business logic
  lead-scoring.service.js   Scoring algorithm

server/src/realtime/
  socket.js                 Socket.io setup and event emitter

client/src/store/
  workspaceStore.js         Global UI state

client/src/hooks/
  useDebouncedValue.js      Reusable search debounce hook

client/src/components/layout/
  CommandPalette.jsx        SaaS command center pattern
```

## Workflow

Lead update flow:

1. Client calls `PATCH /api/v1/leads/:id`.
2. Auth middleware verifies the user.
3. Zod validates request shape.
4. Controller passes data to `lead.service`.
5. Service loads the lead through repository.
6. Service recalculates score.
7. MongoDB saves the mutation.
8. Redis lead-list cache is invalidated.
9. Activity log is written.
10. Socket event broadcasts the update.
11. Controller returns standard API response.

## Scalability

This phase prepares the app for:

- multi-tenant workspaces through `Team`
- permission expansion through `Permission`
- real-time notifications through Socket.io rooms
- cached dashboard and lead-list reads
- background jobs for reminders and email workflows
- richer lead scoring without changing controllers

## Security best practices

- Helmet hardens HTTP headers.
- CORS only permits the configured frontend origin.
- HTTP-only cookies reduce token exposure to frontend JavaScript.
- Zod rejects malformed payloads.
- Sanitization removes risky Mongo operator keys from request bodies.
- Rate limiting slows brute-force and scraping behavior.
- Refresh tokens are hashed before storage.
- Centralized error handling avoids inconsistent leak-prone responses.

## Interview relevance

Strong interview talking points:

- Why controllers should not contain business logic.
- How repository pattern improves testability.
- Difference between server state and client UI state.
- How Redis cache invalidation works after mutations.
- Why websocket events should be emitted from services, not controllers.
- How lead scoring creates business value beyond CRUD.
- How API versioning protects deployed clients.

## Alternatives and tradeoffs

- **Pino vs Winston**: Pino is faster; Winston has mature transport flexibility. This project now uses Winston because it is widely recognized in enterprise Node stacks.
- **Redis required vs optional**: Required Redis catches config errors earlier, but optional Redis makes onboarding easier. We chose optional for internship/demo friendliness.
- **Embedded communication history vs separate collection**: Embedded history is fast for lead detail pages. At very high volume, communication events should move to a separate collection.
- **REST vs GraphQL**: REST is simpler for deployment, testing, and interviews. GraphQL can be useful later for complex dashboard composition.
