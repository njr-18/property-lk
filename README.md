# Property LK

Agent-friendly monorepo scaffold for a Sri Lankan property marketplace.

## Workspace layout

- `apps/web` contains the public marketplace experience.
- `apps/admin` contains moderation and operational tooling.
- `packages/*` contains shared database, types, validation, search, SEO, AI, UI, and config modules.
- `docs/*` contains product, architecture, and acceptance criteria for coordinated agent work.

## Getting started

1. Install dependencies with `pnpm install`.
2. Copy `.env.example` to `.env`.
3. Start the apps with `pnpm dev`.
4. Run quality gates with `pnpm lint`, `pnpm typecheck`, and `pnpm test`.

## Agent workflow

- Architect owns docs, shared contracts, Prisma proposals, and acceptance criteria.
- Feature agents own app-specific trees.
- Reviewer signs off after lint, typecheck, tests, and acceptance criteria match.
