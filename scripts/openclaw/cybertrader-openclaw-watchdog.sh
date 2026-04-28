#!/usr/bin/env bash
set -Eeuo pipefail

export PATH="$HOME/.local/node-current/bin:$HOME/.openclaw-runtime-2026.4.26/node_modules/.bin:$HOME/.openclaw-runtime-2026.4.24/node_modules/.bin:$HOME/.local/node-v22.22.2-darwin-x64/bin:$HOME/.local/bin:/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"
export LANG="${LANG:-en_US.UTF-8}"
export LC_ALL="${LC_ALL:-en_US.UTF-8}"

RUN_ROOT="${RUN_ROOT:-$HOME/.openclaw/cybertrader-runners}"
LOG_DIR="$RUN_ROOT/logs"
STATE_DIR="$RUN_ROOT/state"
LOCK_DIR="$RUN_ROOT/locks"
TARGET_OPENCLAW_VERSION="${TARGET_OPENCLAW_VERSION:-2026.4.26}"
GATEWAY_LABEL="${GATEWAY_LABEL:-ai.openclaw.gateway}"
STALE_RUN_SECONDS="${STALE_RUN_SECONDS:-14400}"
WATCHDOG_LOCK="$LOCK_DIR/openclaw-watchdog.lock"

mkdir -p "$LOG_DIR" "$STATE_DIR" "$LOCK_DIR"
exec >>"$LOG_DIR/openclaw-watchdog.log" 2>&1

now_iso() {
  date -u '+%Y-%m-%dT%H:%M:%SZ'
}

log() {
  printf '%s %s\n' "$(now_iso)" "$*"
}

with_timeout() {
  local seconds="$1"
  shift
  "$@" &
  local child_pid=$!
  (
    trap - EXIT
    sleep "$seconds"
    if kill -0 "$child_pid" 2>/dev/null; then
      log "timeout ${seconds}s for $*; terminating pid $child_pid"
      kill -TERM "$child_pid" 2>/dev/null || true
      sleep 8
      kill -KILL "$child_pid" 2>/dev/null || true
    fi
  ) &
  local watchdog_pid=$!
  local status=0
  wait "$child_pid" || status=$?
  kill "$watchdog_pid" 2>/dev/null || true
  wait "$watchdog_pid" 2>/dev/null || true
  return "$status"
}

acquire_watchdog_lock() {
  if mkdir "$WATCHDOG_LOCK" 2>/dev/null; then
    echo "$$" > "$WATCHDOG_LOCK/pid"
    date -u +%s > "$WATCHDOG_LOCK/created_at"
    return 0
  fi

  local pid created now age
  pid="$(cat "$WATCHDOG_LOCK/pid" 2>/dev/null || true)"
  created="$(cat "$WATCHDOG_LOCK/created_at" 2>/dev/null || echo 0)"
  [[ "$created" =~ ^[0-9]+$ ]] || created=0
  now="$(date -u +%s)"
  age=$((now - created))
  if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null && (( age < 900 )); then
    log "watchdog already active under pid $pid"
    exit 0
  fi
  log "clearing stale watchdog lock age=${age}s pid=${pid:-unknown}"
  rm -rf "$WATCHDOG_LOCK"
  mkdir "$WATCHDOG_LOCK"
  echo "$$" > "$WATCHDOG_LOCK/pid"
  date -u +%s > "$WATCHDOG_LOCK/created_at"
}

cleanup() {
  local owner_pid
  owner_pid="$(cat "$WATCHDOG_LOCK/pid" 2>/dev/null || true)"
  if [[ "$owner_pid" == "$$" ]]; then
    rm -rf "$WATCHDOG_LOCK"
  fi
}
trap cleanup EXIT

clear_stale_runner_locks() {
  local dir pid created now age cmd
  now="$(date -u +%s)"
  for dir in "$LOCK_DIR/global.lock" "$LOCK_DIR/zara.lock" "$LOCK_DIR/zyra.lock"; do
    [[ -d "$dir" ]] || continue
    pid="$(cat "$dir/pid" 2>/dev/null || true)"
    created="$(cat "$dir/created_at" 2>/dev/null || echo 0)"
    [[ "$created" =~ ^[0-9]+$ ]] || created=0
    age=$((now - created))
    if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
      cmd="$(ps -p "$pid" -o command= 2>/dev/null || true)"
      if (( age > STALE_RUN_SECONDS )) && [[ "$cmd" == *"cybertrader-agent-runner"* || "$cmd" == *"goose run"* || "$cmd" == *"codex exec"* || "$cmd" == *"claude"* ]]; then
        log "terminating stale runner lock $dir age=${age}s pid=$pid cmd=$cmd"
        kill -TERM "$pid" 2>/dev/null || true
        sleep 10
        kill -KILL "$pid" 2>/dev/null || true
        rm -rf "$dir"
      else
        log "runner lock active $dir age=${age}s pid=$pid"
      fi
    elif (( age > STALE_RUN_SECONDS )); then
      log "removing dead stale runner lock $dir age=${age}s"
      rm -rf "$dir"
    fi
  done
}

current_openclaw_version() {
  openclaw --version 2>/dev/null | awk '{print $2}' | sed 's/^v//'
}

ensure_openclaw_version() {
  local current
  current="$(current_openclaw_version || true)"
  if [[ "$current" == "$TARGET_OPENCLAW_VERSION" ]]; then
    log "OpenClaw version ok $current"
    return 0
  fi

  log "OpenClaw version drift current=${current:-missing} target=$TARGET_OPENCLAW_VERSION; attempting user-prefix upgrade"
  if command -v npm >/dev/null 2>&1; then
    NPM_CONFIG_CACHE="$HOME/.npm-openclaw-cache" npm install -g --prefix "$HOME/.local/node-current" "openclaw@$TARGET_OPENCLAW_VERSION" || true
  fi
  current="$(current_openclaw_version || true)"
  if [[ "$current" == "$TARGET_OPENCLAW_VERSION" ]]; then
    log "OpenClaw upgraded to $current"
    return 0
  fi
  log "OpenClaw upgrade unavailable; current=${current:-missing}"
  return 1
}

gateway_ready() {
  curl -fsS --max-time 8 http://127.0.0.1:18789/ready >/dev/null 2>&1
}

ensure_gateway_ready() {
  local uid
  uid="$(id -u)"
  if gateway_ready; then
    log "gateway ready"
    return 0
  fi

  log "gateway not ready; attempting OpenClaw CLI restart"
  with_timeout 120 openclaw gateway restart >/dev/null 2>&1 || true
  sleep 8
  if gateway_ready; then
    log "gateway recovered by OpenClaw CLI"
    return 0
  fi

  log "gateway still down; kickstarting launchd label $GATEWAY_LABEL"
  launchctl kickstart -k "gui/$uid/$GATEWAY_LABEL" >/dev/null 2>&1 || true
  sleep 15
  if gateway_ready; then
    log "gateway recovered by launchd kickstart"
    return 0
  fi

  log "gateway recovery failed"
  return 1
}

ensure_agent_job() {
  local agent="$1"
  local label="ai.cybertrader.$agent.autonomous"
  local uid row pid
  uid="$(id -u)"
  row="$(launchctl list | awk -v label="$label" '$3 == label {print; exit}')"
  if [[ -n "$row" ]]; then
    pid="$(awk '{print $1}' <<<"$row")"
    if [[ "$pid" != "-" ]]; then
      log "$label already running pid=$pid"
      return 0
    fi
    launchctl kickstart "gui/$uid/$label" >/dev/null 2>&1 || true
    log "$label was loaded but idle/exited; kickstarted"
    return 0
  fi

  local plist="$HOME/Library/LaunchAgents/$label.plist"
  if [[ -f "$plist" ]]; then
    launchctl bootstrap "gui/$uid" "$plist" >/dev/null 2>&1 || true
    launchctl kickstart -k "gui/$uid/$label" >/dev/null 2>&1 || true
    log "$label bootstrapped and kickstarted"
    return 0
  fi

  log "$label plist missing"
  return 1
}

write_status() {
  local ready="false"
  gateway_ready && ready="true"
  {
    printf '{\n'
    printf '  "checkedAt": "%s",\n' "$(now_iso)"
    printf '  "gatewayReady": %s,\n' "$ready"
    printf '  "openclawVersion": "%s",\n' "$(current_openclaw_version || true)"
    printf '  "launchd": %s\n' "$(launchctl list | grep -E 'ai\.(openclaw\.gateway|cybertrader\.(zara|zyra)\.autonomous)' | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read().splitlines()))')"
    printf '}\n'
  } > "$STATE_DIR/openclaw-watchdog-status.json"
}

acquire_watchdog_lock
log "watchdog start"
clear_stale_runner_locks
ensure_openclaw_version || true
ensure_gateway_ready || true
ensure_agent_job zara || true
ensure_agent_job zyra || true
write_status
log "watchdog finish"
