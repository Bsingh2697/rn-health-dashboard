# RN Health Dashboard

> Know exactly when your OTA update broke production.

A unified monitoring dashboard for React Native teams. Correlates OTA releases with crash rates in real-time — and alerts your Slack the moment something goes wrong.

---

## The Problem

React Native teams manage crash reports in Sentry, OTA updates in Expo EAS, and store reviews manually — all in separate tools. There's no single place to answer the most critical question:

**Did my last OTA push cause a crash spike?**

---

## What This Does

- Tracks OTA bundle versions and rollout % from Expo EAS
- Monitors crash rate per bundle version from Sentry
- Automatically correlates OTA releases with crash spikes
- Sends a Slack alert the moment crash rate crosses your threshold
- One-click rollback to previous bundle

---

## Tech Stack

- **Frontend** — Next.js 14 + Tailwind CSS + shadcn/ui
- **Backend** — Node.js + Express
- **Database** — PostgreSQL + Prisma ORM
- **Auth** — Clerk
- **Payments** — LemonSqueezy
- **Alerts** — Slack Webhooks
- **Hosting** — Vercel (frontend) + Cloudflare Tunnel (backend)

---

## Integrations (V1)

- [x] Expo EAS
- [x] Sentry
- [x] Slack
- [ ] Google Play Console *(coming soon)*
- [ ] App Store Connect *(coming soon)*
- [ ] Microsoft CodePush *(coming soon)*

---

## Pricing

| Plan | Price | Projects | History | Alerts |
|---|---|---|---|---|
| Free | $0 | 1 | 7 days | — |
| Pro | $29/mo | 5 | 30 days | Slack |
| Team | $79/mo | Unlimited | 90 days | Slack + Email |

---

## Status

Currently in development. Waitlist open.

---

## License

MIT
