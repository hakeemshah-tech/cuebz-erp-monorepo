# Enterprise ERP - Multi-Tenant Business Operations Platform

A production-grade, multi-tenant SaaS platform that gives each tenant organization a single
workspace for its day-to-day operations: CRM and lead pipeline, quotations and invoicing,
vendor and asset registers, document management, petty cash, task tracking, and staff
administration, all behind per-module role-based access control and Stripe-backed
subscription billing.

The system is built as two deployable units: a **Turborepo monorepo** containing the admin
dashboard and public marketing site, and a **Node/Express REST API** that owns all business
logic, persistence, and background processing.

> **Note on this repository:** this is a sanitized public snapshot. See
> [Provenance & Sanitization](#-provenance--sanitization) at the bottom for what was removed
> and why.

---

## Table of Contents

- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Core Features](#core-features)
- [Repository Layout](#repository-layout)
- [Local Setup](#local-setup)
- [Provenance & Sanitization](#-provenance--sanitization)

---

## System Architecture

The platform separates the **request path** (synchronous, user-facing) from the **work path**
(asynchronous, scheduled), so that slow or failure-prone operations (email delivery,
reminder fan-out, subscription expiry sweeps) never block an HTTP response.

```
┌──────────────────────┐   ┌──────────────────────┐
│  Admin Dashboard     │   │  Marketing / Signup  │
│  Next.js 14 · :3002  │   │  Next.js 15 · :3005  │
└──────────┬───────────┘   └──────────┬───────────┘
           │        JSON over HTTPS   │
           │  Bearer access token + refresh rotation
           └────────────┬─────────────┘
                        ▼
        ┌───────────────────────────────────┐
        │   Express REST API  ·  :5000      │
        │                                   │
        │   helmet · CORS allow-list        │
        │   rate limiting · mongo-sanitize  │
        │   ─────────────────────────────   │
        │   authN → tenant scope → RBAC     │
        │   → module access → validation    │
        │   ─────────────────────────────   │
        │   controllers / services          │
        └───┬────────────┬──────────────┬───┘
            ▼            ▼              ▼
     ┌────────────┐ ┌─────────┐ ┌──────────────┐
     │  MongoDB   │ │  Redis  │ │  S3 /        │
     │  Mongoose  │ │  BullMQ │ │  Cloudinary  │
     └────────────┘ └────┬────┘ └──────────────┘
                         │ queue
                         ▼
              ┌─────────────────────┐
              │  Worker process     │
              │  reminders · email  │
              └─────────────────────┘
                         ▲
              ┌──────────┴──────────┐
              │  Cron schedulers    │
              │  scan · expiry      │
              └─────────────────────┘
```

### Request pipeline

Every protected route composes a chain of small, single-purpose middlewares rather than
embedding authorization logic in controllers:

| Stage | Middleware | Responsibility |
| --- | --- | --- |
| 1 | `ensureAuthenticated` | Verifies the JWT access token and hydrates `req.user`. |
| 2 | `authorizeTenant` / `ensureTenantAccess` | Pins the request to a tenant and rejects cross-tenant reads. |
| 3 | `checkTenantVerified` | Blocks unverified tenants from privileged operations. |
| 4 | `validateSubscription` | Rejects requests from tenants with a lapsed plan. |
| 5 | `ensureRole` / `ensureModuleAccess` | Role check, then per-module entitlement check. |
| 6 | `validateRequest` | `express-validator` schema enforcement before the controller runs. |

Because each layer is independent, a new resource gets tenant isolation, billing enforcement,
and RBAC by composition, with no new authorization code.

### Asynchronous work path

`node-cron` schedulers scan for due reminders across call logs, cheque tracking, visitor
records, and tasks, then enqueue one BullMQ job per document using a deterministic
`jobId` of `collection:documentId`. That job ID is the de-duplication key: a scan that
overlaps a previous run cannot double-send. The worker re-reads each document before acting,
so a reminder cancelled after enqueue is never delivered.

The worker runs as its own process (`pnpm run start-worker`) and can be scaled independently
of the API.

---

## Tech Stack

### Frontend: `frontend/`

| Concern | Choice |
| --- | --- |
| Dashboard framework | Next.js 14 (App Router), React 18 |
| Marketing site | Next.js 15, React 19, Tailwind 4 |
| Language | TypeScript |
| Monorepo | Turborepo 2 + pnpm workspaces |
| Styling | Tailwind CSS, RizzUI component primitives |
| Shared UI | `packages/ui-core`: in-house table, form, filter and chart components |
| Client state | Jotai (atomic state) |
| Server/table state | TanStack Table |
| Forms & validation | React Hook Form + Zod |
| Charts | Recharts |
| Session | NextAuth v4 |
| HTTP | Axios with a shared interceptor client |

> The two apps deliberately sit on different Next.js majors: the dashboard is pinned to 14.2
> while the much smaller marketing site tracks 15. `node-linker=hoisted` flattens the
> workspace, so the root pins `@types/react` to 18.x to match the hoisted React runtime.

### Backend: `backend/`

| Concern | Choice |
| --- | --- |
| Runtime | Node.js ≥ 18, Express 4 |
| Database | MongoDB via Mongoose 8 |
| Cache / queue | Redis (ioredis) + BullMQ |
| Scheduling | node-cron, node-schedule |
| Auth | JWT access + refresh rotation, Passport local, bcrypt |
| Payments | Stripe (subscriptions + webhooks) |
| Storage | AWS S3 (pre-signed uploads), Cloudinary |
| Documents | PDFKit |
| Email | Nodemailer |
| Hardening | helmet, express-rate-limit, express-mongo-sanitize, express-validator |
| Logging | Winston |

---

## Core Features

**Multi-tenancy with hard isolation.** Every domain model carries a `tenant_id`, and tenant
scoping is enforced in middleware rather than left to individual queries. Tenants move through
a lifecycle (created → verified → subscribed → expired), and each state gates a different
slice of the API.

**Two-dimensional access control.** Authorization is a role *and* an entitlement check.
`ensureRole` resolves the coarse role (`super-admin`, `tenant-admin`, `tenant-user`), while
`accessible_modules` on the user record drives fine-grained per-module permissions, so a
tenant administrator can grant a staff member access to Invoicing without exposing Payroll or
Credentials. `super-admin` short-circuits the chain for platform operations.

**Subscription billing as an authorization concern.** Stripe subscriptions are reconciled via
a raw-body webhook endpoint mounted ahead of the JSON body parser (required for signature
verification). Plan state is not merely displayed: `validateSubscription` enforces it on every
protected route, and dedicated schedulers notify tenants ahead of expiry and downgrade them
after it.

**Decoupled background processing.** Reminder scanning, email delivery, and expiry sweeps run
outside the request path through Redis-backed BullMQ queues with idempotent, de-duplicated
jobs, as described in the architecture section above.

**Encrypted credential vault.** Tenants store third-party credentials against their
organization record. These are encrypted at the application layer with a dedicated key
(separate from the general-purpose encryption key), so a database dump alone does not expose
them, and access is gated behind a short-lived re-authentication session
(`checkCredientialSession`).

**Operational surface.** Leads and customers, quotations and invoices with PDF generation,
vendors, fixed-asset register, petty cash, cheque tracking, visitor and call logs, document
management on S3/Cloudinary, task management, event calendar, brand kit, and a tenant-scoped
analytics dashboard.

---

## Repository Layout

```
.
├── backend/                    # Express REST API
│   ├── config/                 # db, redis, stripe, passport, cloudinary, logger
│   ├── controllers/            # Route handlers per domain
│   ├── middlewares/            # authN, tenant scoping, RBAC, rate limits, uploads
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express routers
│   ├── validations/            # express-validator schemas
│   ├── lib/                    # BullMQ queue + connection
│   ├── jobs/ schedulers/       # Cron producers
│   ├── workers/                # Queue consumers (separate process)
│   ├── utils/                  # encryption, jwt, email, errors
│   └── env/.env.example        # Environment template
│
└── frontend/                   # Turborepo monorepo
    ├── apps/
    │   ├── admin-dashboard/    # Authenticated dashboard (:3002)
    │   └── landing-page/       # Marketing site (:3005)
    └── packages/
        ├── ui-core/            # Shared UI primitives, table + form abstractions
        ├── config-tailwind/    # Shared Tailwind preset
        └── config-typescript/  # Shared tsconfig
```

---

## Local Setup

### Prerequisites

| Requirement | Version |
| --- | --- |
| Node.js | ≥ 18 (20.16+ recommended) |
| pnpm | 9.x |
| MongoDB | 6.x, local or Atlas |
| Redis | 6.x+, required for queues and sessions |

A Stripe **test-mode** account is needed for billing flows; S3 and Cloudinary credentials are
needed for file upload flows. Everything else runs without third-party services.

### 1. Backend

```bash
cd backend
pnpm install

# Create your environment file. The server loads ./env/.env.<NODE_ENV>
cp env/.env.example env/.env.development
```

Open `env/.env.development` and fill in, at minimum, `MONGO_DB_URI`, the four auth secrets,
and your Redis connection. Generate each secret with:

```bash
openssl rand -hex 32
```

Then start the API:

```bash
pnpm run start:dev        # API on http://localhost:5000
```

Optionally run the async pipeline in separate terminals:

```bash
pnpm run start-scan       # cron producer
pnpm run start-worker     # queue consumer
```

Or all three together:

```bash
pnpm run start-all
```

### 2. Frontend

```bash
cd frontend
pnpm install

cp apps/admin-dashboard/.env.example apps/admin-dashboard/.env.development
```

Set `NEXT_PUBLIC_BASE_URL=http://localhost:5000/api` and generate `NEXTAUTH_SECRET` with
`openssl rand -base64 32`.

```bash
pnpm run dashboard:dev    # dashboard on http://localhost:3002
pnpm run landing:dev      # marketing site on http://localhost:3005
pnpm run dev              # or: both, via Turborepo
```

### 3. First login

The API seeds a super-admin on first run from the `SEED_ADMIN_*` values in your environment
file. Sign in at `http://localhost:3002/signin` with those credentials, then create a tenant
organization to explore the tenant-scoped modules.

### Production builds

```bash
# Frontend
pnpm run dashboard:build:prod && pnpm run dashboard:start:prod

# Backend
pnpm start
```

### Troubleshooting

| Symptom | Cause |
| --- | --- |
| `Loaded environment: undefined` | No `env/.env.<NODE_ENV>` file. Copy the example. |
| CORS error in the browser | Add your frontend origin to `CORS_ORIGIN` or the allow-list in `app.js`. |
| Reminders never fire | Redis is unreachable, or the worker process is not running. |
| Stripe webhook signature failure | The webhook route must receive the raw body, so do not move it below `express.json()`. |

---

## 🔐 Provenance & Sanitization

This repository is a **sanitized public snapshot** of a production-deployed application built
under a client engagement. It is published for portfolio review only, and the original client
relationship is covered by a Non-Disclosure Agreement, so everything that could identify the
client, their customers, or their infrastructure has been removed. Specifically:

- **All environment files and credentials.** Database connection strings, JWT and session
  secrets, Stripe keys, AWS IAM credentials, Cloudinary secrets, Redis passwords, and SMTP
  credentials have been deleted and replaced with `.env.example` templates containing dummy
  values. No live secret is present in this tree or in its history.
- **Client and product identifiers.** Company names, product branding, proprietary domains,
  and deployment hostnames have been replaced with generic placeholders such as
  `Enterprise ERP`, `api.example.com`, and `localhost:5000`.
- **Deployment configuration.** Environment-specific hosting, DNS, and CI configuration are
  not part of this snapshot.

The development history is not reproduced here. It lives in the client's private repository
and is not mine to publish, so this snapshot is released as a single commit. The code
demonstrates architectural decisions, authorization design, state management, background-job
patterns, and API structure. It is a reference for engineering review, not a turnkey
deployment.

### Third-party licensing

The dashboard originally sat on a commercially licensed admin template whose source cannot be
redistributed. That vendored package has been removed from this repository and replaced with
`packages/ui-core`, an original implementation of the ~50 shared primitives the application
needs (table and pagination, filter drawer, form wrapper, date picker, upload field, cards,
chart helpers and icons), built on the open-source [RizzUI](https://rizzui.com) and
[TanStack Table](https://tanstack.com/table) libraries.

All remaining dependencies are open-source packages resolved from npm at install time and are
not redistributed here.

This snapshot carries no open-source licence. It is published for portfolio review only, and
no permission is granted to use, copy, modify, or redistribute the code. All rights are
reserved by the original stakeholders.
