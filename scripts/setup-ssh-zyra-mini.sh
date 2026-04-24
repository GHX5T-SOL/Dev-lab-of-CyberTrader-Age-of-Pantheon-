#!/usr/bin/env bash
# Setup persistent SSH key authentication for the zyra-mini node.
# Ensures password‑less `ssh zyra-mini` for both Zyra and Zara agents.

set -euo pipefail

REMOTE_HOST="zyra-mini"
KEY_TYPE="ed25519"
KEY_PATH="$HOME/.ssh/id_${KEY_TYPE}"
PUB_KEY_PATH="${KEY_PATH}.pub"

# 1. Generate key if missing
if [[ ! -f "$KEY_PATH" ]]; then
  echo "[setup‑ssh] Generating new SSH key (${KEY_TYPE})..."
  ssh-keygen -t $KEY_TYPE -f "$KEY_PATH" -N "" -C "zara@$(hostname)"
else
  echo "[setup‑ssh] Existing SSH key found."
fi

# 2. Ensure ssh-copy-id is available
if command -v ssh-copy-id >/dev/null 2>&1; then
  echo "[setup‑ssh] Using ssh-copy-id to install public key on $REMOTE_HOST"
  ssh-copy-id -i "$PUB_KEY_PATH" "$REMOTE_HOST"
else
  echo "[setup‑ssh] ssh-copy-id not available – falling back to manual cat"
  PUBLIC_KEY=$(cat "$PUB_KEY_PATH")
  ssh "$REMOTE_HOST" "mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo \"$PUBLIC_KEY\" >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
fi

# 3. Verify password‑less login
echo "[setup‑ssh] Verifying password‑less SSH access..."
ssh -o BatchMode=yes "$REMOTE_HOST" "echo ok" && echo "[setup‑ssh] Success! You can now run 'ssh $REMOTE_HOST' without a password."

# 4. Documentation reminder
cat <<EOF

---
Documentation note:
The access setup is documented in docs/Zyra-Zara-Governance.md under the "SSH Persistent Key Setup" section.
EOF