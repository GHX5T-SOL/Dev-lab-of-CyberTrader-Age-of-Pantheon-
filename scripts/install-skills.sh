#!/usr/bin/env bash
# Install all Claude Code skills used by the AI team.
#
# Run inside a Claude Code session (the `skills` command is provided by the
# Claude Code harness). If run in vanilla shell it will print a hint.
set -euo pipefail

CYAN='\033[0;36m'; GREEN='\033[0;32m'; RED='\033[0;31m'; NC='\033[0m'

if ! command -v npx >/dev/null; then
  printf "${RED}[!!]${NC} npx not found. install Node 20+.\n"; exit 1
fi

printf "${CYAN}[..]${NC} installing Remotion skills...\n"
npx skills add remotion-dev/skills || printf "${RED}[!!]${NC} remotion skills install failed\n"

printf "${CYAN}[..]${NC} installing OPC-skills (solopreneur automation)...\n"
npx skills add ReScienceLab/opc-skills || printf "${RED}[!!]${NC} opc-skills install failed\n"

printf "${CYAN}[..]${NC} installing HeyGen Hyperframes skill...\n"
npx skills add heygen-com/hyperframes || printf "${RED}[!!]${NC} hyperframes install failed (may not exist yet — check https://hyperframes.heygen.com)\n"

printf "${GREEN}[ok]${NC} skill installs attempted. list installed skills with: npx skills list\n"
