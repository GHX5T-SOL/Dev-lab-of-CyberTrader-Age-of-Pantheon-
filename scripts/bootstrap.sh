#!/usr/bin/env bash
# ============================================================================
# Dev Lab Bootstrap — one-shot setup for a new operator (Ghost, Zoro, or any
# future collaborator). Safe to re-run.
#
# What it does:
#   1. Preflight: checks Node >=20, npm, git are installed
#   2. Installs repo-root npm deps (meta + workspaces)
#   3. Installs web/ deps (the Dev Lab Next.js site)
#   4. Copies .env.example → .env at root + web/.env.local (if missing)
#   5. Attempts to install AI team skills (Remotion, OPC, Hyperframes)
#   6. Runs a build-verify on web/
#   7. Prints a "what to do next" summary
#
# Optional extras (not auto-run — they need external accounts / confirmation):
#   - npm run install-elizaos   — ElizaOS CLI (market sim swarm)
#   - npm run install-openclaw  — OpenClaw agent framework
#   - npm run install-catchme   — CatchMe context memory
# ============================================================================

set -euo pipefail

CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
DIM='\033[2m'
NC='\033[0m'

step() { printf "${CYAN}[..]${NC} %s\n" "$*"; }
ok()   { printf "${GREEN}[ok]${NC} %s\n" "$*"; }
warn() { printf "${YELLOW}[!!]${NC} %s\n" "$*"; }
err()  { printf "${RED}[xx]${NC} %s\n" "$*"; }
hr()   { printf "${DIM}%s${NC}\n" "────────────────────────────────────────────────────────────"; }

# Must be run from the repo root
if [ ! -f "CLAUDE.md" ] || [ ! -d "web" ]; then
  err "run this from the Dev Lab repo root (where CLAUDE.md + web/ live)"
  exit 1
fi

hr
printf "${CYAN}%s${NC}\n" "CyberTrader: Age of Pantheon — Dev Lab bootstrap"
hr

# ── 1. Preflight ────────────────────────────────────────────────────────────
step "preflight: node / npm / git"

if ! command -v node >/dev/null; then
  err "node not found. install Node 20+ (https://nodejs.org or nvm)."
  exit 1
fi
NODE_MAJOR=$(node -v | sed -E 's/v([0-9]+)\..*/\1/')
if [ "$NODE_MAJOR" -lt 20 ]; then
  err "node v$NODE_MAJOR detected — need Node 20+. please upgrade."
  exit 1
fi
ok "node $(node -v)"

if ! command -v npm >/dev/null; then err "npm not found."; exit 1; fi
ok "npm $(npm -v)"

if ! command -v git >/dev/null; then err "git not found."; exit 1; fi
ok "git $(git --version | awk '{print $3}')"

# ── 2. Repo root npm install ────────────────────────────────────────────────
hr
step "installing root npm deps (meta + workspaces)…"
if npm install --no-audit --no-fund; then
  ok "root deps installed"
else
  warn "root npm install had issues — not fatal (workspaces may not exist yet)"
fi

# ── 3. web/ npm install ─────────────────────────────────────────────────────
hr
step "installing web/ deps (Dev Lab site)…"
(
  cd web
  npm install --no-audit --no-fund
)
ok "web/ deps installed"

# ── 4. Env templates ────────────────────────────────────────────────────────
hr
step "wiring env files…"

if [ ! -f ".env" ]; then
  if [ -f ".env.example" ]; then
    cp .env.example .env
    ok "created .env from .env.example — fill in your keys"
  else
    warn ".env.example missing — skipping root env"
  fi
else
  ok ".env already exists — leaving it alone"
fi

if [ ! -f "web/.env.local" ]; then
  if [ -f "web/.env.example" ]; then
    cp web/.env.example web/.env.local
    ok "created web/.env.local from template"
  fi
else
  ok "web/.env.local already exists"
fi

# Offer to symlink web/.env.local → root .env for shared secrets
if [ -L "web/.env.local" ]; then
  ok "web/.env.local is symlinked (shared with root .env)"
elif [ -f ".env" ] && [ -f "web/.env.local" ]; then
  printf "${DIM}tip: to share secrets between root + web, replace web/.env.local with a symlink:${NC}\n"
  printf "${DIM}     (cd web && rm .env.local && ln -s ../.env .env.local)${NC}\n"
fi

# ── 5. Generate AUTH_SECRET + CRON_SECRET if missing ────────────────────────
hr
step "checking AUTH_SECRET and CRON_SECRET…"

# Read the env and see if these are blank
need_auth=0; need_cron=0
if [ -f ".env" ]; then
  if grep -q "^AUTH_SECRET=$" .env 2>/dev/null || ! grep -q "^AUTH_SECRET=" .env 2>/dev/null; then
    need_auth=1
  fi
  if grep -q "^CRON_SECRET=$" .env 2>/dev/null || ! grep -q "^CRON_SECRET=" .env 2>/dev/null; then
    need_cron=1
  fi
fi

if [ "$need_auth" = "1" ]; then
  AUTH_SECRET=$(node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))")
  if grep -q "^AUTH_SECRET=" .env 2>/dev/null; then
    # replace empty line
    if [ "$(uname)" = "Darwin" ]; then
      sed -i '' "s|^AUTH_SECRET=.*|AUTH_SECRET=$AUTH_SECRET|" .env
    else
      sed -i "s|^AUTH_SECRET=.*|AUTH_SECRET=$AUTH_SECRET|" .env
    fi
  else
    echo "AUTH_SECRET=$AUTH_SECRET" >> .env
  fi
  ok "generated AUTH_SECRET (32 bytes base64url)"
fi

if [ "$need_cron" = "1" ]; then
  CRON_SECRET=$(node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))")
  if grep -q "^CRON_SECRET=" .env 2>/dev/null; then
    if [ "$(uname)" = "Darwin" ]; then
      sed -i '' "s|^CRON_SECRET=.*|CRON_SECRET=$CRON_SECRET|" .env
    else
      sed -i "s|^CRON_SECRET=.*|CRON_SECRET=$CRON_SECRET|" .env
    fi
  else
    echo "CRON_SECRET=$CRON_SECRET" >> .env
  fi
  ok "generated CRON_SECRET (32 bytes base64url)"
fi

# ── 6. AI team skills ───────────────────────────────────────────────────────
hr
step "attempting AI team skill installs (safe to skip if they fail)…"
if [ -x "scripts/install-skills.sh" ]; then
  bash scripts/install-skills.sh || warn "some skills failed to install — check logs above"
else
  warn "scripts/install-skills.sh not executable — try: chmod +x scripts/install-skills.sh"
fi

# ── 7. Web build verify ─────────────────────────────────────────────────────
hr
step "running web/ typecheck + build to verify everything compiles…"
(
  cd web
  if npm run typecheck; then
    ok "typecheck clean"
  else
    err "typecheck failed — stop here and fix before continuing"
    exit 1
  fi
  if npm run build >/dev/null 2>&1; then
    ok "production build succeeded"
  else
    warn "production build failed — run 'cd web && npm run build' to see the error"
  fi
)

# ── 8. Summary ──────────────────────────────────────────────────────────────
hr
printf "${GREEN}%s${NC}\n" "BOOTSTRAP COMPLETE"
hr

cat <<EOF

${CYAN}What's next:${NC}

  1. ${YELLOW}Fill in your API keys${NC} in .env (at repo root):
       - ANTHROPIC_API_KEY          (required for Council)
       - ELEVENLABS_API_KEY         (voice, optional)
       - HEYGEN_API_KEY             (avatars, optional)
       - SPRITECOOK_API_KEY         (2D art, optional)
       - OPENAI_API_KEY             (fallback LLM, optional)
       - … any others you have      (see docs/Studio-Toolkit.md)

  2. ${YELLOW}Start the Dev Lab site locally:${NC}
       cd web && npm run dev
       → http://localhost:3000 (passcode: 2010, or your DEV_LAB_PASSWORD)

  3. ${YELLOW}Read the canon${NC} (auto-loaded by Claude Code, but skim yourself):
       - CLAUDE.md                    (hard rules + where-to-find)
       - docs/Game-Design-Doc.md      (game vision)
       - docs/Studio-Toolkit.md       (tools + keys you have)
       - agents.md                    (12-agent AI team)
       - AI_Council_Charter.md        (how agents decide together)

  4. ${YELLOW}Convene the Council${NC} on your first real task:
       npm run ai-council:run

  5. ${YELLOW}Optional heavy installs${NC} (need external accounts):
       npm run install-elizaos   # market sim swarm
       npm run install-openclaw  # long-running agent
       npm run install-catchme   # context memory

${CYAN}You're all set. Welcome to the lab.${NC}
EOF
