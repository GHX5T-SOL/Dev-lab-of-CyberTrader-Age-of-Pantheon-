# SETUP.md — Newbie-friendly setup walkthrough

> This walks you through a **first-time install on macOS / Linux / Windows (WSL)**. Read every step. Skip nothing the first time.

## What you'll have at the end

- A working Expo mobile app running on your phone or simulator
- A local Supabase backend
- The AI team activated and ready
- Optional: ElizaOS, OpenClaw, CatchMe, Remotion + Hyperframes, SpriteCook

---

## 0. Prerequisites

Install these first:

| Tool | Why | Install |
|---|---|---|
| **Node.js 20 LTS+** | runs the mobile app + scripts | [nodejs.org](https://nodejs.org) or `nvm install 20` |
| **git** | version control | [git-scm.com](https://git-scm.com) |
| **Expo Go** (phone app) | test the mobile app on real hardware | App Store / Play Store |
| **Watchman** (macOS) | file watching for Expo | `brew install watchman` |
| **conda** (optional, for CatchMe) | Python env manager | [miniforge](https://github.com/conda-forge/miniforge) |
| **Supabase CLI** | local backend | `brew install supabase/tap/supabase` |

Check versions: `node -v` (>=20), `npm -v` (>=10), `git --version`.

---

## 1. Clone & install

```bash
git clone https://github.com/GHX5T-SOL/Dev-lab-of-CyberTrader-Age-of-Pantheon-.git
cd Dev-lab-of-CyberTrader-Age-of-Pantheon-
bash setup.sh
```

`setup.sh` prompts before every global install or destructive action. Say `y` to what you want, `n` to skip. You can rerun it any time.

---

## 2. Environment secrets

```bash
cp .env.example .env
```

Open `.env` in your editor and fill in the keys you have. For Phase 1 you only *need*:

- `EXPO_PUBLIC_APP_NAME` (already set)
- `DEV_IDENTITY_ENABLED=true` (keeps wallet optional)

Everything else can stay blank until the feature needs it. The app detects missing keys and falls back to dev identity / local-only mode.

> **Browser auth note**: when you later wire up Supabase Auth, Solana Mobile Wallet Adapter, or ElizaOS Discord/Telegram bridges, the first call opens a browser window for OAuth. Run those steps on a desktop the first time, not in a headless SSH session.

---

## 3. Start the mobile app

```bash
npm run dev:mobile
```

This launches Expo. Scan the QR code with the Expo Go app on your phone, or press `i` for iOS simulator / `a` for Android emulator / `w` for web.

If nothing shows on your phone: make sure laptop and phone are on the same Wi-Fi.

---

## 4. Start the local backend (optional for Phase 0)

```bash
npm run dev:backend
```

This boots a local Supabase stack (Postgres + GoTrue + Edge Functions) via Docker. First run takes 1–2 minutes.

---

## 5. Activate the AI team

```bash
npm run team:activate
```

This prints the team roster and a short brief. Later it'll open a TUI to assign today's agents.

To consult the **AI Council** on a specific decision:

```bash
npm run ai-council:run
```

Or just open a Claude Code session in this repo — `CLAUDE.md` auto-loads and Claude will behave as the orchestrator by default. See [Prompt_Guidelines.md](Prompt_Guidelines.md).

---

## 6. (Optional) install the agent frameworks

Each is independent. Install only what you need right now.

### ElizaOS — multi-agent market simulation swarm
```bash
npm i -g @elizaos/cli
elizaos --version
# then, from this repo:
elizaos init
```

### OpenClaw — repo-embedded executor
```bash
curl -fsSL https://openclaw.ai/install.sh | bash
# or:
npm i -g openclaw
openclaw onboard
```

### CatchMe — agent context memory
```bash
bash scripts/install-catchme.sh
```

### Claude Code skills (Remotion + OPC + Hyperframes)
```bash
npm run install-all-skills
```

---

## 7. Verify everything

```bash
npm run verify:phase1
```

This runs typecheck + lint + tests. Should pass before you push.

---

## Troubleshooting

**"Command not found: expo"** → you skipped the global Expo install in `setup.sh`. Run `npm i -g expo-cli eas-cli`.

**Expo Go shows blank white screen** → check terminal for TypeScript errors. Press `r` to reload.

**Supabase won't start** → ensure Docker Desktop is running. `supabase stop && supabase start`.

**`npx skills add …` fails** → the skills framework is Claude-Code-specific. Run it inside a Claude Code session, not vanilla shell. See `skills/README.md`.

**AI Council "doesn't respond"** → it only activates inside Claude Code sessions (via `Prompt_Guidelines.md`). The npm scripts are stubs that print the roster; the real council runs in-conversation.

---

## Next

Open [agents.md](agents.md) to meet the team, then [docs/Roadmap.md](docs/Roadmap.md) for the 30-day plan.
