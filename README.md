# GreenQuote

Solar financing pre-qualification app for the Cloover coding challenge. Lets authenticated users request a residential solar quote and view installment offers in **EUR**.

## Prerequisites

- Node.js 22+
- Docker Desktop (for PostgreSQL)
- npm

## Quick start

```bash
# 1. Clone and install
git clone https://github.com/NonStopMan/cloover-coding-challenge.git
cd cloover-coding-challenge
npm install

# 2. Environment
cp .env.example .env
# Generate AUTH_SECRET: openssl rand -base64 32

# 3. Database
docker compose up -d
npx prisma migrate dev
npm run db:seed

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Seed accounts

| Email          | Password   | Role  |
| -------------- | ---------- | ----- |
| admin@test.com | Admin123!  | ADMIN |
| user@test.com  | User12345! | USER  |

## Scripts

| Command               | Description                                              |
| --------------------- | -------------------------------------------------------- |
| `npm run dev`         | Start dev server                                         |
| `npm run build`       | Production build                                         |
| `npm test`            | Unit tests (Vitest)                                      |
| `npm run test:e2e`    | E2E tests (Playwright) — requires `docker compose up -d` |
| `npm run test:e2e:ui` | E2E tests with Playwright UI (Playwright UI mode)        |
| `npm run lint`        | ESLint                                                   |
| `npm run format`      | Prettier                                                 |
| `npm run db:seed`     | Seed admin + demo user                                   |

## Features

- **Quote form** — client-side validation, email pre-filled from session
- **Results** — system price, risk band (A/B/C), 3 installment offers (5/10/15 years)
- **My quotes** — table of user's quotes
- **Admin view** — all quotes with name/email filter (server-enforced)
- **PDF export** — download quote as PDF
- **OpenAPI docs** — `/api-docs` (Swagger UI)
- **Health check** — `GET /api/health`

## API

See [docs/api.md](docs/api.md) for endpoint reference.

## Architecture

- **Next.js 16** App Router (monolith — UI + API in one repo)
- **PostgreSQL 16** via Docker Compose
- **Prisma 7** ORM with `@prisma/adapter-pg`
- **Auth.js v5** credentials provider (cookie sessions)
- **Zod** validation shared between client and API
- **pino** structured logging

Planning and implementation logs: [docs/PLAN.md](docs/PLAN.md), [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md)

## Trade-offs

| Decision               | Why                                                         |
| ---------------------- | ----------------------------------------------------------- |
| Next.js monolith       | Fastest path for ~4h scope; shared types between UI and API |
| Auth.js Credentials    | Meets required baseline; OAuth deferred                     |
| JSON column for offers | Three fixed offers per quote; avoids extra join table       |
| Prisma 7 + pg adapter  | Latest Prisma; requires explicit PostgreSQL adapter         |

## What I'd do next

1. **CI/CD** — GitHub Actions: lint, unit tests, E2E against dockerized Postgres, build Docker image
2. **Deploy on GCP Cloud Run** — containerized Next.js + Cloud SQL Postgres; secrets via Secret Manager
3. **Production hardening** — rate limiting, email verification, CSRF review, audit logging
4. **Amortization schedule** — monthly breakdown view per selected offer

## Docker production build

```bash
docker compose up -d db
docker build -t greenquote .
# Run with DATABASE_URL, AUTH_SECRET, AUTH_URL env vars
```

## GitHub tracking

Issues #2–#12 on the [milestone](https://github.com/NonStopMan/cloover-coding-challenge/milestone/1) map to implementation phases.
