#!/usr/bin/env bash
set -euo pipefail

export PATH="/opt/homebrew/bin:$PATH"
REPO="${1:-NonStopMan/cloover-coding-challenge}"
M="GreenQuote v1 — Coding Challenge"

gh label create "phase:core" --repo "$REPO" --color "0E8A16" --description "Core challenge requirement" 2>/dev/null || true
gh label create "phase:bonus" --repo "$REPO" --color "1D76DB" --description "Bonus feature" 2>/dev/null || true
gh label create "type:docs" --repo "$REPO" --color "FBCA04" --description "Documentation" 2>/dev/null || true

gh api "repos/$REPO/milestones" -f title="$M" -f state=open -f description="Core requirements + OpenAPI, PDF, E2E bonuses" 2>/dev/null || true

create_issue() {
  gh issue create --repo "$REPO" --title "$1" --label "$2" --milestone "$M" --body "$3"
}

create_issue "Scaffold — Next.js, Docker, Prisma, living docs" "phase:core,type:docs" "Bootstrap GreenQuote monorepo."
create_issue "Auth — register, login, session, middleware" "phase:core" "Email/password auth with Auth.js."
create_issue "Pricing model + unit tests" "phase:core" "Pure pricing functions + Vitest."
create_issue "Quotes API + health + authorization" "phase:core" "POST/GET quotes + health endpoint."
create_issue "UI — quote form, results, my quotes" "phase:core" "Frontend quote flow."
create_issue "Admin quotes view + server-side filter" "phase:core" "Admin-only quotes table."
create_issue "Integration tests + structured logging" "phase:core" "API tests + pino logging."
create_issue "README + API reference + doc finalization" "phase:core,type:docs" "Project documentation."
create_issue "Bonus — OpenAPI docs page" "phase:bonus" "Swagger UI at /api-docs."
create_issue "Bonus — PDF quote export" "phase:bonus" "PDF download endpoint."
create_issue "Bonus — Playwright E2E" "phase:bonus" "End-to-end user journey test."

echo "Issues created for $REPO"
