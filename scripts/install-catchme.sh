#!/usr/bin/env bash
# Install CatchMe (personal context/memory system) into a local sibling dir.
# Source: https://github.com/HKUDS/CatchMe
set -euo pipefail

CYAN='\033[0;36m'; GREEN='\033[0;32m'; RED='\033[0;31m'; NC='\033[0m'

if ! command -v conda >/dev/null; then
  printf "${RED}[!!]${NC} conda not found. install miniforge: https://github.com/conda-forge/miniforge\n"
  exit 1
fi

TARGET="${HOME}/.tools/catchme"
mkdir -p "${HOME}/.tools"

if [[ -d "${TARGET}" ]]; then
  printf "${CYAN}[..]${NC} CatchMe already cloned at ${TARGET}, pulling latest...\n"
  git -C "${TARGET}" pull --ff-only
else
  printf "${CYAN}[..]${NC} cloning CatchMe into ${TARGET}...\n"
  git clone https://github.com/HKUDS/CatchMe.git "${TARGET}"
fi

cd "${TARGET}"
conda create -n catchme python=3.11 -y 2>/dev/null || true
# shellcheck source=/dev/null
source "$(conda info --base)/etc/profile.d/conda.sh"
conda activate catchme
pip install -e .

printf "${GREEN}[ok]${NC} CatchMe installed at ${TARGET}.\n"
printf "   next: conda activate catchme && catchme init && catchme awake\n"
