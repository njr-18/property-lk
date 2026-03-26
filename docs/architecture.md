# Architecture

## Monorepo shape

- `apps/web`: Next.js App Router public marketplace
- `apps/admin`: Next.js App Router operations console
- `packages/*`: shared database, types, validation, search, SEO, AI, UI, and config modules

## Collaboration contract

- Shared changes route through the architect lane first.
- App agents own only their file trees.
- Reviewer agent validates quality gates and change risk before merge.
