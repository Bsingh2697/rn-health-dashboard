# RN Health Dashboard — Build Plan

## What is this product?

A unified dashboard for React Native teams to monitor OTA releases, crash rates, and get instant Slack alerts when a bundle breaks production. Core value: correlate OTA push with crash spike automatically.

---

## Phase 0 — Validate (Week 1–2) — $0

**Goal: 50 waitlist signups before writing a single line of backend code.**

### Tasks:
- [ ] Build landing page (Next.js + Tailwind)
- [ ] Add email waitlist form (Resend / Mailchimp free tier)
- [ ] Add mockup screenshots of dashboard
- [ ] Post on RN Discord `#tools` channel
- [ ] Post on r/reactnative
- [ ] Post on X/Twitter

### Success criteria:
- 50 signups in 2 weeks → build karo
- Less than 50 → revisit messaging or pivot

---

## Phase 1 — MVP Build (Week 3–10) — $0

### MVP Scope (3 integrations only):
1. **Expo EAS** — OTA bundle versions + rollout %
2. **Sentry** — Crash rate per bundle version
3. **Slack** — Alert when crash spikes after OTA push

### Features:
1. **Onboarding** — Sign up → Create project → Connect Sentry + EAS → Done
2. **Dashboard** — Latest bundle, crash rate graph (7 days, per version), warning banner on spike
3. **Alert System** — User sets threshold → background job polls every 15 min → Slack message on breach
4. **Rollback** — One-click EAS API call to promote previous bundle
5. **Billing** — Free / Pro $29 / Team $79

### Pricing:
| Plan | Price | Limits |
|---|---|---|
| Free | $0 | 1 project, 7-day history, no alerts |
| Pro | $29/mo | 5 projects, 30-day history, Slack alerts, rollback |
| Team | $79/mo | Unlimited projects, team members, email alerts |

### Week by Week:
```
Week 3:  Project setup, Clerk auth, DB schema, routing
Week 4:  Sentry API integration — fetch + store crash data
Week 5:  Expo EAS API integration — fetch + store OTA data
Week 6:  Dashboard UI — crash graph + OTA status cards
Week 7:  Alert system — node-cron background job
Week 8:  Slack webhook integration + alert delivery
Week 9:  LemonSqueezy billing integration + pricing page
Week 10: Polish, bug fixes, onboarding flow
```

---

## Phase 2 — Growth Features (Week 11–18)

Only build if Phase 1 has paying users.

- [ ] Google Play Console — ANR rate, ratings
- [ ] App Store Connect — ratings, crash organizer
- [ ] Bundle size trend via CI webhook
- [ ] Team member invites
- [ ] Weekly email digest
- [ ] CodePush / AppCenter support

---

## Phase 3 — Distribution

### Content Marketing:
- Blog: "How we caught a silent crash affecting 30% users"
- Publish on dev.to + Hashnode
- Share in RN Discord (helpful, not spammy)
- X/Twitter — RN community is small but tight-knit

### Revenue Targets:
```
10 Pro users  = $290/mo   ← first milestone
50 Pro users  = $1,450/mo ← validation
100 Pro users = $2,900/mo ← ramen profitable
200 Pro users = $5,800/mo ← solid indie SaaS
```

---

## Migration Plan (when users arrive)

| Now ($0) | Later (paid) | Cost |
|---|---|---|
| Mac home server | Railway | $10/mo |
| Neon free tier | Neon paid / Railway Postgres | $19/mo |
| node-cron | BullMQ + Redis | included in Railway |

Migration difficulty: **Easy** — 3–4 hours max if `.env` discipline maintained from Day 1.

---

## Key Rules (follow from Day 1):

1. **Never hardcode any value** — everything in `.env`
2. **Keep integrations minimal** — only Sentry + EAS in V1
3. **ship fast** — ugly but working > pretty but delayed
