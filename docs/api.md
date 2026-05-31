# GreenQuote API Reference

Base URL: `http://localhost:3000`

All quote endpoints require an authenticated session cookie (sign in via `/login` first).

## GET /api/health

Liveness check. No auth required.

**Response 200**
```json
{ "status": "ok", "timestamp": "2026-05-31T12:00:00.000Z" }
```

## POST /api/auth/register

Register a new user. No auth required.

**Body**
```json
{ "fullName": "Jane Doe", "email": "jane@example.com", "password": "secret123" }
```

**Response 201** — user object (no password)

## POST /api/quotes

Create a pre-qualification quote. Auth required.

**Body**
```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "address": "Berlin, DE",
  "monthlyConsumptionKwh": 420,
  "systemSizeKw": 5,
  "downPayment": 1000
}
```

**Response 201**
```json
{
  "id": "clx...",
  "inputs": { "...": "..." },
  "derived": {
    "systemPrice": 6000,
    "principal": 5000,
    "riskBand": "A",
    "apr": 0.069
  },
  "offers": [
    { "termYears": 5, "apr": 0.069, "principalUsed": 5000, "monthlyPayment": 98.46 }
  ],
  "createdAt": "2026-05-31T12:00:00.000Z"
}
```

## GET /api/quotes

List quotes. Auth required.

- **User:** returns own quotes only
- **Admin:** returns all quotes; optional `?search=nameOrEmail`

## GET /api/quotes/:id

Fetch one quote. Auth required. Owner or admin only.

## GET /api/quotes/:id/pdf

Download quote as PDF. Auth required. Owner or admin only.

## GET /api/openapi.json

OpenAPI 3.1 specification (no auth).

Interactive docs: `/api-docs`
