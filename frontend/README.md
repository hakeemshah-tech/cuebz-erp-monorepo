# Enterprise ERP - Frontend Monorepo

Turborepo workspace containing the two user-facing applications.

| Workspace | Package | Port | Purpose |
| --- | --- | --- | --- |
| `apps/admin-dashboard` | `admin-dashboard` | 3002 | Authenticated multi-tenant dashboard |
| `apps/landing-page` | `landing` | 3005 | Public marketing site and signup |
| `packages/ui-core` | `ui-core` | - | Shared UI primitives, table and form abstractions |
| `packages/config-tailwind` | - | - | Shared Tailwind preset |
| `packages/config-typescript` | - | - | Shared tsconfig bases |

## Requirements

- Node.js ≥ 18 (20.16+ recommended)
- pnpm 9.x

## Getting started

```bash
pnpm install

cp apps/admin-dashboard/.env.example apps/admin-dashboard/.env.development

pnpm run dashboard:dev     # dashboard on http://localhost:3002
pnpm run landing:dev       # marketing site on http://localhost:3005
pnpm run dev               # both, via Turborepo
```

## Production build

```bash
pnpm run dashboard:build:prod
pnpm run dashboard:start:prod
```

## Shared UI (`packages/ui-core`)

Components are imported through the `@core/*` path alias, which resolves to
`packages/ui-core/src/*`:

```ts
import Table from "@core/components/table";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import cn from "@core/utils/class-names";
```

The package builds on [RizzUI](https://rizzui.com) primitives and TanStack
Table. It is compiled by Next.js via `transpilePackages`, so there is no
separate build step: edit a file and the dev server picks it up.
