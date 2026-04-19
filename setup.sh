#!/usr/bin/env bash
# ============================================================================
# CyberTrader: Age of Pantheon — one-command setup
# ----------------------------------------------------------------------------
# Safe by default: prompts before anything that installs globally or writes
# outside the repo. Run from the repo root.
# ============================================================================
set -euo pipefail

GREEN='\033[0;32m'; CYAN='\033[0;36m'; RED='\033[0;31m'; NC='\033[0m'
ok()   { printf "${GREEN}[ok]${NC} %s\n" "$*"; }
info() { printf "${CYAN}[..]${NC} %s\n" "$*"; }
warn() { printf "${RED}[!!]${NC} %s\n" "$*"; }

confirm() {
  # $1 = prompt
  read -r -p "$1 [y/N] " resp
  [[ "$resp" =~ ^[Yy]$ ]]
}

# ---- preflight --------------------------------------------------------------
info "preflight checks..."
command -v node >/dev/null || { warn "node not found. install Node 20+ (nvm recommended)."; exit 1; }
command -v npm  >/dev/null || { warn "npm not found."; exit 1; }
command -v git  >/dev/null || { warn "git not found."; exit 1; }
node_v=$(node -v)
ok "node ${node_v}"

# ---- repo deps --------------------------------------------------------------
info "installing repo devDependencies..."
npm install
ok "repo deps installed"

# ---- .env -------------------------------------------------------------------
if [[ ! -f .env ]]; then
  info "no .env found; creating from .env.example"
  cp .env.example .env
  warn "edit .env and fill in real keys before running dev commands"
fi

# ---- optional: AI skills ----------------------------------------------------
if confirm "install Claude Code skills (Remotion, OPC-skills, HeyGen Hyperframes)?"; then
  bash scripts/install-skills.sh || warn "one or more skill installs failed; continue manually"
fi

# ---- optional: ElizaOS ------------------------------------------------------
if confirm "install ElizaOS CLI globally (@elizaos/cli)?"; then
  npm i -g @elizaos/cli && ok "elizaos installed ($(elizaos --version 2>/dev/null || echo 'installed'))"
fi

# ---- optional: OpenClaw -----------------------------------------------------
if confirm "install OpenClaw (runs a shell script from openclaw.ai)?"; then
  curl -fsSL https://openclaw.ai/install.sh | bash || warn "openclaw install failed"
fi

# ---- optional: CatchMe ------------------------------------------------------
if confirm "install CatchMe (needs conda + Python 3.11)?"; then
  bash scripts/install-catchme.sh || warn "catchme install failed"
fi

# ---- optional: mobile toolchain --------------------------------------------
if confirm "install Expo CLI + EAS CLI globally?"; then
  npm i -g expo-cli eas-cli && ok "expo + eas installed"
fi

ok "setup complete."
cat <<'EOF'

next steps:
  1. edit .env with your real keys
  2. npm run dev:mobile      # start the Expo app
  3. npm run team:activate   # brief the AI team on current goals
  4. read SETUP.md for a full walkthrough, or agents.md for the AI team overview
EOF
