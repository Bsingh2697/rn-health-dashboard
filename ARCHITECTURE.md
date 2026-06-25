# RN Health Dashboard — Architecture

---

## Tech Stack

| Layer | Tool | Why |
|---|---|---|
| Frontend | Next.js 14 + Tailwind + shadcn/ui | Fast UI, easy deploy on Vercel |
| Backend | Node.js + Express | Full control, good for background jobs |
| Database | PostgreSQL (Neon.tech free tier) | Relational data fits perfectly |
| ORM | Prisma | Type-safe queries, auto migrations |
| Auth | Clerk | Free 10k users, Google login ready |
| Payments | LemonSqueezy | Merchant of Record — handles all taxes globally |
| Background Jobs | node-cron (inside Express) | No extra service needed in V1 |
| Alerts | Slack Incoming Webhooks | Free |
| Tunnel | Cloudflare Tunnel | Expose home server to public internet |
| Frontend Deploy | Vercel | Free hobby tier |
| Backend Deploy | Mac Home Server (V1) → Railway (V2) | $0 to start |

---

## System Architecture Diagram

```
                        PUBLIC INTERNET
                              │
                    ┌─────────▼─────────┐
                    │  Cloudflare Tunnel │  (free)
                    └─────────┬─────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
    ┌─────────▼──────┐ ┌──────▼──────┐ ┌─────▼──────────┐
    │  Next.js App   │ │ Express API │ │  node-cron      │
    │  (Vercel)      │ │  (Mac Server│ │  Background Jobs│
    │                │ │   port 4000)│ │  (every 15 min) │
    └─────────┬──────┘ └──────┬──────┘ └─────┬──────────┘
              │               │               │
              └───────────────┼───────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   PostgreSQL DB    │
                    │   (Neon.tech)      │
                    └───────────────────┘


  External APIs pulled by node-cron:
  ┌─────────────┐    ┌─────────────┐
  │  Sentry API │    │  Expo EAS   │
  │ (crash data)│    │  API (OTA)  │
  └─────────────┘    └─────────────┘

  Output:
  ┌─────────────────────┐
  │  Slack Webhook      │
  │  (alert delivery)   │
  └─────────────────────┘
```

---

## Database Schema

```prisma
model User {
  id               String    @id @default(cuid())
  email            String    @unique
  clerkId          String    @unique
  stripeCustomerId String?
  plan             Plan      @default(FREE)
  projects         Project[]
  createdAt        DateTime  @default(now())
}

model Project {
  id           String        @id @default(cuid())
  name         String
  platform     Platform      @default(BOTH)
  userId       String
  user         User          @relation(fields: [userId], references: [id])
  integrations Integration[]
  releases     OtaRelease[]
  snapshots    CrashSnapshot[]
  alerts       Alert[]
  createdAt    DateTime      @default(now())
}

model Integration {
  id          String          @id @default(cuid())
  projectId   String
  project     Project         @relation(fields: [projectId], references: [id])
  type        IntegrationType
  credentials Json            // encrypted: { apiKey, orgSlug, projectSlug, etc }
  createdAt   DateTime        @default(now())
}

model OtaRelease {
  id            String    @id @default(cuid())
  projectId     String
  project       Project   @relation(fields: [projectId], references: [id])
  bundleVersion String
  rolloutPct    Float
  platform      Platform
  releasedAt    DateTime
  createdAt     DateTime  @default(now())
}

model CrashSnapshot {
  id            String   @id @default(cuid())
  projectId     String
  project       Project  @relation(fields: [projectId], references: [id])
  bundleVersion String
  crashRate     Float
  totalEvents   Int
  recordedAt   DateTime
  createdAt    DateTime  @default(now())
}

model Alert {
  id              String   @id @default(cuid())
  projectId       String
  project         Project  @relation(fields: [projectId], references: [id])
  threshold       Float    // e.g. 2.0 = 2x crash rate increase
  slackWebhookUrl String
  active          Boolean  @default(true)
  createdAt       DateTime @default(now())
}

enum Plan {
  FREE
  PRO
  TEAM
}

enum Platform {
  IOS
  ANDROID
  BOTH
}

enum IntegrationType {
  SENTRY
  EXPO_EAS
  CODEPUSH
  APP_STORE
  PLAY_CONSOLE
}
```

---

## Folder Structure

```
rn-health-dashboard/
│
├── frontend/                    # Next.js app
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── dashboard/
│   │   │   ├── page.tsx         # main dashboard
│   │   │   ├── [projectId]/
│   │   │   │   ├── page.tsx     # project detail
│   │   │   │   ├── alerts/
│   │   │   │   └── settings/
│   │   ├── onboarding/
│   │   │   └── page.tsx         # connect integrations
│   │   └── pricing/
│   │       └── page.tsx
│   ├── components/
│   │   ├── ui/                  # shadcn components
│   │   ├── CrashRateChart.tsx
│   │   ├── OtaStatusCard.tsx
│   │   └── AlertBanner.tsx
│   └── lib/
│       └── api.ts               # calls to Express backend
│
├── backend/                     # Node.js + Express
│   ├── src/
│   │   ├── index.ts             # Express app entry
│   │   ├── routes/
│   │   │   ├── projects.ts
│   │   │   ├── integrations.ts
│   │   │   ├── alerts.ts
│   │   │   └── webhooks.ts      # LemonSqueezy webhooks
│   │   ├── services/
│   │   │   ├── sentry.ts        # Sentry API calls
│   │   │   ├── eas.ts           # Expo EAS API calls
│   │   │   ├── slack.ts         # Slack webhook sender
│   │   │   └── crashMonitor.ts  # comparison logic
│   │   ├── jobs/
│   │   │   └── pollCrashRates.ts # node-cron job
│   │   ├── middleware/
│   │   │   └── auth.ts          # Clerk JWT verify
│   │   └── lib/
│   │       └── prisma.ts        # Prisma client singleton
│   └── prisma/
│       ├── schema.prisma
│       └── migrations/
│
└── PLAN.md
└── ARCHITECTURE.md
```

---

## API Endpoints

```
POST   /api/projects              Create project
GET    /api/projects              List user's projects
GET    /api/projects/:id          Get project detail

POST   /api/projects/:id/integrations     Connect Sentry/EAS
DELETE /api/projects/:id/integrations/:type

GET    /api/projects/:id/releases         OTA releases list
GET    /api/projects/:id/crashes          Crash snapshots

POST   /api/projects/:id/alerts           Create alert
PUT    /api/projects/:id/alerts/:alertId  Update threshold
DELETE /api/projects/:id/alerts/:alertId

POST   /api/projects/:id/rollback         Trigger EAS rollback

POST   /api/webhooks/lemonsqueezy         Payment events
```

---

## Background Job Logic (node-cron)

```
Every 15 minutes:
  For each active project:
    1. Fetch latest crash rate from Sentry API
    2. Store as CrashSnapshot in DB
    3. Get last OTA release timestamp
    4. Compare crash rate: before release vs after release
    5. If after/before > alert.threshold:
       → Send Slack message with bundle version, rates, rollback link
```

---

## Environment Variables (.env)

```env
# Server
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://...neon.tech/...

# Auth
CLERK_SECRET_KEY=sk_...
CLERK_PUBLISHABLE_KEY=pk_...

# Payments
LEMONSQUEEZY_API_KEY=...
LEMONSQUEEZY_WEBHOOK_SECRET=...

# Encryption (for storing integration credentials)
ENCRYPTION_KEY=32-char-random-string
```

---

## V1 → V2 Migration Path

| Component | V1 (now, $0) | V2 (when users arrive) |
|---|---|---|
| Backend hosting | Mac + Cloudflare Tunnel | Railway ($10/mo) |
| Database | Neon free | Neon paid / Railway Postgres |
| Background jobs | node-cron | BullMQ + Redis |
| Total cost | $0/mo | ~$30/mo |

Migration steps:
1. Push code to Railway — 10 min
2. `pg_dump` from Neon → `pg_restore` to Railway Postgres — 30 min
3. Copy `.env` variables to Railway dashboard — 5 min
4. Update DNS to point to Railway — 10 min

Total: ~1 hour
