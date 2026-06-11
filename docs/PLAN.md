# GreenQuote — Implementation Plan

Living plan for the Cloover coding challenge. Updated as requirements are completed.

## Requirements checklist

### A) Frontend

- [x] Quote form with validation (`src/components/QuoteForm.tsx`)
- [x] Quote results with price, band, 3 offers (`src/components/QuoteResults.tsx`)
- [x] My quotes table (`src/app/quotes/page.tsx`)
- [x] Admin quotes with filter (`src/app/admin/quotes/page.tsx`)

### B) Backend API

- [x] `POST /api/quotes`
- [x] `GET /api/quotes/:id`
- [x] `GET /api/quotes` (list + admin search)
- [x] `GET /api/health`

### C) Authentication

- [x] Register + login (email/password)
- [x] Cookie session via Auth.js
- [x] Server-side route protection

### D) Database

- [x] User + Quote schema (`prisma/schema.prisma`)
- [x] Migration + seed (`admin@test.com`, `user@test.com`)

### E) Infra & ops

- [x] `docker-compose.yml`, `Dockerfile`, `.env.example`
- [x] Structured logging (`src/lib/logger.ts`)

### F) Quality

- [x] Unit tests (Vitest)
- [x] Frontend E2E tests (Playwright UI) — auth, quotes, admin, navigation, validation
- [x] ESLint + Prettier
- [x] README + API reference

### Bonuses

- [x] OpenAPI + Swagger UI (`/api-docs`)
- [x] PDF export (`GET /api/quotes/:id/pdf`)
- [x] Playwright E2E UI (`npm run test:e2e:ui`)

## Stack

| Layer    | Choice                        |
| -------- | ----------------------------- |
| Frontend | Next.js 16 + React + Tailwind |
| API      | Next.js Route Handlers        |
| DB       | PostgreSQL 16 (Docker)        |
| ORM      | Prisma 7                      |
| Auth     | Auth.js v5 (Credentials)      |
| Currency | EUR                           |

## GitHub issues

| Issue | Phase         | Branch                     |
| ----- | ------------- | -------------------------- |
| #2    | Scaffold      | `feat/scaffold`            |
| #3    | Auth          | `feat/auth`                |
| #4    | Pricing       | `feat/pricing`             |
| #5    | Quotes API    | `feat/quotes-api`          |
| #6    | UI            | `feat/quotes-ui`           |
| #7    | Admin         | `feat/admin-ui`            |
| #8    | Tests/logging | `test/integration-logging` |
| #9    | Docs          | `docs/readme-api`          |
| #10   | OpenAPI       | `feat/openapi-docs`        |
| #11   | PDF           | `feat/pdf-export`          |
| #12   | E2E           | `test/e2e-playwright`      |

## Pricing model

- `systemPrice = systemSizeKw × 1200` (EUR)
- Risk A: kWh ≥ 400 and kW ≤ 6 → 6.9% APR
- Risk B: kWh ≥ 250 → 8.9% APR
- Risk C: otherwise → 11.9% APR
- Offers: 5, 10, 15 years via standard amortization

## Auth rules

| Resource                | Rule                                 |
| ----------------------- | ------------------------------------ |
| POST /api/quotes        | Authenticated user                   |
| GET /api/quotes/:id     | Owner or ADMIN                       |
| GET /api/quotes?search= | ADMIN only                           |
| /admin/quotes           | ADMIN only (middleware + page check) |

## Open items

- [ ] CI pipeline (GitHub Actions)
- [ ] Email verification
- [ ] Rate limiting on auth endpoints
