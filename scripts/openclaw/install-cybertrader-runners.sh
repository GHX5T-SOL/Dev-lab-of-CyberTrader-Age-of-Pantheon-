#!/usr/bin/env bash
set -Eeuo pipefail

RUN_ROOT="${RUN_ROOT:-$HOME/.openclaw/cybertrader-runners}"
SCRIPT_SOURCE="${SCRIPT_SOURCE:-$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/cybertrader-agent-runner.sh}"
LAUNCH_AGENTS="$HOME/Library/LaunchAgents"

mkdir -p "$RUN_ROOT/bin" "$RUN_ROOT/logs" "$RUN_ROOT/state" "$RUN_ROOT/locks" "$LAUNCH_AGENTS"
install -m 0755 "$SCRIPT_SOURCE" "$RUN_ROOT/bin/cybertrader-agent-runner.sh"

write_plist() {
  local agent="$1"
  local interval="$2"
  local label="ai.cybertrader.${agent}.autonomous"
  local plist="$LAUNCH_AGENTS/$label.plist"
  cat > "$plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>$label</string>
  <key>ProgramArguments</key>
  <array>
    <string>$RUN_ROOT/bin/cybertrader-agent-runner.sh</string>
    <string>$agent</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>StartInterval</key>
  <integer>$interval</integer>
  <key>StandardOutPath</key>
  <string>$RUN_ROOT/logs/$agent.launchd.out.log</string>
  <key>StandardErrorPath</key>
  <string>$RUN_ROOT/logs/$agent.launchd.err.log</string>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>$HOME/.local/node-current/bin:$HOME/.openclaw-runtime-2026.4.24/node_modules/.bin:$HOME/.local/node-v22.22.2-darwin-x64/bin:$HOME/.local/bin:/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
    <key>DEVLAB_REPO</key>
    <string>$HOME/Dev-lab-of-CyberTrader-Age-of-Pantheon-</string>
    <key>GAME_REPO</key>
    <string>$HOME/CyberTrader-Age-of-Pantheon-v6</string>
    <key>RUN_ROOT</key>
    <string>$RUN_ROOT</string>
  </dict>
</dict>
</plist>
PLIST
  plutil -lint "$plist"
}

write_plist "zara" 7200
write_plist "zyra" 3600

uid="$(id -u)"
for agent in zara zyra; do
  label="ai.cybertrader.${agent}.autonomous"
  plist="$LAUNCH_AGENTS/$label.plist"
  launchctl bootout "gui/$uid/$label" >/dev/null 2>&1 || true
  launchctl bootstrap "gui/$uid" "$plist"
  launchctl kickstart -k "gui/$uid/$label" || true
done

echo "Installed CyberTrader autonomous runners under $RUN_ROOT"
launchctl list | grep 'ai.cybertrader' || true
