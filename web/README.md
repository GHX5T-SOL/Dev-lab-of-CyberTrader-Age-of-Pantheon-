# CyberTrader Dev Lab — Virtual Office

> This is **not** the CyberTrader game. This is our **internal studio workspace** — a virtual office where Ghost, Zoro, the 12-agent AI Council roster, and the Zara/Zyra OpenClaw operators coordinate the build of the actual mobile game.

## What's here

A Next.js 15 site, password-gated (password: `2010` by default), deployable to Vercel. Inside: a cinematic vault-door entry, an isometric office dashboard, and clickable "workstations" that open zoomable panels for each project section:

- **Roadmap** — phase cadence pulled from `../docs/Roadmap.md`
- **Game Bible** — full lore from `../docs/Lore-Bible.md`
- **Team** — all 16 operators (Ghost, Zoro, 12 AI agents, Zara, Zyra) with avatars, roles, personas, and OpenClaw node status
- **Brand** — palette, logos, commodity asset spec
- **Wireframes** — prototypes v1-v6 index with repo/preview links
- **Tasks** — current task per person (what Ghost / Zoro / each agent is doing right now)
- **Status** — current phase, next milestone, blockers
- **Avatar Lab** — live local GLB avatar gallery from `/public/GLB_Assets`
- **Floor 3D** — dynamic R3F office with the chosen GLB floor, props, moving avatars, and voice overlay
- **Credit Ops** — persistent spend meter plus provider dashboard
- **Zoro's Notes** — Remotion-generated explainer videos

## Phase split (be honest about what's built)

`v6` is now the chosen playable build. This `web/` app remains the internal studio office that tracks the six-prototype history and supports the shipping game.

**Phase A — shipped:**
- Full site scaffold, password gate, all content sections populated from `../docs/`
- Cinematic 2D vault door + keypad entry (CSS + SVG + Framer Motion)
- Isometric 2D office dashboard with clickable workstations
- Vercel cron stub at `/api/cron/ai-team-tick`
- Placeholder character portraits and first static office workstation shell

**Phase B — live now:**
- React Three Fiber 3D office scene with `office_floor_option_2.glb`
- Local GLB avatars for all 16 operators from `/public/GLB_Assets`
- Zara and Zyra surfaced as OpenClaw Living Agents on `ssh zyra-mini`
- Whiteboard seeded with 60+ owner-tagged tasks, estimates, dependencies, and acceptance criteria
- Persistent header credit meter plus refreshed Credit Ops dashboard
- Remotion explainer queue on Zoro's desk

**Phase C — later:**
- Vercel Cron wired to real AI team progress logic (actual autonomous work)
- Onlook integration — **BLOCKED**: Onlook is Next.js+Tailwind only and not embeddable, so it can't edit the Expo/RN game and can't be iframed inside this site. We'll document an alternative IDE path (Conway MCP sandbox or CodeSandbox embed).

## Run locally

```bash
cd web
cp .env.example .env.local
# edit .env.local — set DEV_LAB_PASSWORD (default 2010), AUTH_SECRET (generate one), CRON_SECRET
npm install
npm run dev
# open http://localhost:3000
```

To generate `AUTH_SECRET` and `CRON_SECRET`:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

## Deploy to Vercel (Ghost — do this when ready)

```bash
cd web
npm i -g vercel@latest        # make sure Vercel CLI is current
vercel login                  # opens browser
vercel link                   # choose your team + create project "cybertrader-dev-lab"
# IMPORTANT: when prompted, set the project root directory to `web` (not repo root).

# Push env vars to Vercel (one per line):
echo "2010" | vercel env add DEV_LAB_PASSWORD production
echo "$(node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))")" | vercel env add AUTH_SECRET production
echo "$(node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))")" | vercel env add CRON_SECRET production

# Deploy preview:
vercel

# Promote to production:
vercel --prod
```

The included `vercel.ts` registers the hourly AI team tick cron automatically on deploy.

## Architecture (at a glance)

```
web/
├── src/
│   ├── app/
│   │   ├── page.tsx                 → redirects to /gate or /office
│   │   ├── gate/page.tsx            vault door + keypad
│   │   ├── office/
│   │   │   ├── page.tsx             isometric office dashboard
│   │   │   ├── roadmap/page.tsx
│   │   │   ├── bible/page.tsx
│   │   │   ├── team/page.tsx
│   │   │   ├── brand/page.tsx
│   │   │   ├── wireframes/page.tsx
│   │   │   ├── tasks/page.tsx
│   │   │   ├── status/page.tsx
│   │   │   └── notes/page.tsx       Zoro's video tray (Phase B)
│   │   └── api/
│   │       ├── auth/verify          POST password check
│   │       ├── auth/logout          clears cookie
│   │       └── cron/ai-team-tick    hourly Vercel cron
│   ├── components/                  VaultDoor, Keypad, GLBAvatar, Floor3D, etc.
│   ├── data/                        team, performers, GLB manifest, roadmap, bible…
│   ├── lib/                         auth, constants
│   └── styles/
├── middleware.ts                    redirects unauthenticated → /gate
├── vercel.ts                        modern Vercel config (crons + headers)
└── next.config.ts
```

## Hard rules (inherit from parent repo CLAUDE.md)

1. AI Council Consultation header on every non-trivial response.
2. Never assume — verify libraries / APIs / URLs.
3. Newbie-friendly + pro-quality.
4. No external IP. City is **Neon Void City** (per Lore Bible) — never "Night City".
5. Verify before every destructive or shared action.

See `../CLAUDE.md` for the full 9-rule list.
