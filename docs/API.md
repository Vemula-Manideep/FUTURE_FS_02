# API Route Structure

Base URL: `/api`

## Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `POST /auth/forgot-password`
- `GET /auth/me`

## Leads

- `GET /leads?q=&status=&source=&priority=&assignedTo=&page=&limit=&sort=`
- `POST /leads`
- `GET /leads/:id`
- `PATCH /leads/:id`
- `DELETE /leads/:id`
- `PATCH /leads/bulk`

## Follow-ups

- `POST /follow-ups/lead/:leadId`
- `PATCH /follow-ups/:id`
- `DELETE /follow-ups/:id`

## Dashboard

- `GET /dashboard/analytics`

## Notifications

- `GET /notifications`
- `PATCH /notifications/:id/read`

All successful responses use:

```json
{
  "success": true,
  "message": "Human readable message",
  "data": {},
  "meta": {}
}
```

All error responses use:

```json
{
  "success": false,
  "message": "Error message",
  "details": {}
}
```
