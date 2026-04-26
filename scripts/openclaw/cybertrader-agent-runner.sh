#!/usr/bin/env bash
set -Eeuo pipefail

AGENT_ID="${1:-}"
if [[ "$AGENT_ID" != "zara" && "$AGENT_ID" != "zyra" ]]; then
  echo "usage: $0 zara|zyra" >&2
  exit 64
fi

export PATH="$HOME/.local/node-current/bin:$HOME/.openclaw-runtime-2026.4.24/node_modules/.bin:$HOME/.local/node-v22.22.2-darwin-x64/bin:$HOME/.local/bin:/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"

DEVLAB_REPO="${DEVLAB_REPO:-$HOME/Dev-lab-of-CyberTrader-Age-of-Pantheon-}"
GAME_REPO="${GAME_REPO:-$HOME/CyberTrader-Age-of-Pantheon-v6}"
RUN_ROOT="${RUN_ROOT:-$HOME/.openclaw/cybertrader-runners}"
LOG_DIR="$RUN_ROOT/logs"
STATE_DIR="$RUN_ROOT/state"
LOCK_DIR="$RUN_ROOT/locks"
export CODEX_HOME="${CODEX_HOME:-$RUN_ROOT/codex-home}"
RUN_ID="$(date -u +%Y%m%dT%H%M%SZ)-$AGENT_ID"
LOG_FILE="$LOG_DIR/$AGENT_ID.log"
LAST_MESSAGE="$STATE_DIR/$AGENT_ID-last-message.md"
AGENT_BACKEND_TIMEOUT_SECONDS="${AGENT_BACKEND_TIMEOUT_SECONDS:-2700}"
ZYRA_START_DELAY_SECONDS="${ZYRA_START_DELAY_SECONDS:-45}"
if [[ "$AGENT_ID" == "zara" ]]; then
  AGENT_DISPLAY="Zara"
else
  AGENT_DISPLAY="Zyra"
fi

mkdir -p "$LOG_DIR" "$STATE_DIR" "$LOCK_DIR" "$CODEX_HOME"
exec >>"$LOG_FILE" 2>&1

echo "===== $RUN_ID start $(date '+%Y-%m-%dT%H:%M:%S%z') ====="

if [[ "$AGENT_ID" == "zyra" && "$ZYRA_START_DELAY_SECONDS" != "0" ]]; then
  echo "zyra start delay ${ZYRA_START_DELAY_SECONDS}s to avoid launchd/git contention"
  sleep "$ZYRA_START_DELAY_SECONDS"
fi

load_env_file() {
  local file="$1"
  [[ -f "$file" ]] || return 0
  set -a
  # shellcheck disable=SC1090
  source "$file"
  set +a
}

load_env_file "$HOME/.openclaw/.env"
load_env_file "$HOME/zyra/.env"
load_env_file "$HOME/Projects/ZARA/.env"

if [[ -z "${OPENAI_API_KEY:-}" && -f "$HOME/Library/LaunchAgents/ai.openclaw.gateway.plist" ]]; then
  echo "OPENAI_API_KEY missing from shell env; OpenClaw gateway may still have it in launchd env."
fi

ensure_codex_api_login() {
  if [[ -z "${OPENAI_API_KEY:-}" ]]; then
    echo "OPENAI_API_KEY unavailable; skipping Codex API-key login"
    return 1
  fi

  printenv OPENAI_API_KEY | codex login --with-api-key \
    -c 'model_provider="openai"' >/dev/null 2>&1 || {
    echo "Codex API-key login failed; will still try configured fallbacks"
    return 1
  }
}

acquire_lock() {
  local name="$1"
  local dir="$LOCK_DIR/$name.lock"
  local max_age_seconds="${2:-21600}"
  if mkdir "$dir" 2>/dev/null; then
    echo "$$" > "$dir/pid"
    date -u +%s > "$dir/created_at"
    return 0
  fi
  local created now age lock_pid
  lock_pid="$(cat "$dir/pid" 2>/dev/null || true)"
  if [[ -n "$lock_pid" ]] && kill -0 "$lock_pid" 2>/dev/null; then
    echo "lock $name is active under pid $lock_pid"
    exit 0
  fi
  created="$(cat "$dir/created_at" 2>/dev/null || true)"
  if ! [[ "$created" =~ ^[0-9]+$ ]]; then
    created=0
  fi
  now="$(date -u +%s)"
  age=$((now - created))
  if (( age > max_age_seconds )); then
    echo "stale lock $name detected after ${age}s; clearing"
    rm -rf "$dir"
    mkdir "$dir"
    echo "$$" > "$dir/pid"
    date -u +%s > "$dir/created_at"
    return 0
  fi
  echo "lock $name is active; another CyberTrader autonomy run is working"
  exit 0
}

release_locks() {
  rm -rf "$LOCK_DIR/global.lock" "$LOCK_DIR/$AGENT_ID.lock"
}
trap release_locks EXIT

acquire_lock "$AGENT_ID" 21600
acquire_lock "global" 21600

configure_git() {
  git config user.name "OpenClaw $AGENT_DISPLAY"
  git config user.email "openclaw-${AGENT_ID}@users.noreply.github.com"
}

run_with_timeout() {
  local seconds="$1"
  shift
  "$@" &
  local child_pid=$!
  (
    sleep "$seconds"
    if kill -0 "$child_pid" 2>/dev/null; then
      echo "backend timeout after ${seconds}s; terminating pid $child_pid" >&2
      kill -TERM "$child_pid" 2>/dev/null || true
      sleep 15
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

commit_dirty_state() {
  local repo="$1"
  local label="$2"
  cd "$repo"
  configure_git
  if [[ -n "$(git status --porcelain)" ]]; then
    git add -A
    git commit -m "chore(openclaw): ${AGENT_ID} autosave ${label} ${RUN_ID}" || true
    git push origin HEAD || true
  fi
}

sync_repo_main() {
  local repo="$1"
  local remote="$2"
  local label="$3"
  if [[ ! -d "$repo/.git" ]]; then
    mkdir -p "$(dirname "$repo")"
    git clone "$remote" "$repo"
  fi
  cd "$repo"
  configure_git
  commit_dirty_state "$repo" "pre-run-$label"
  git fetch origin main
  if git show-ref --verify --quiet refs/heads/main; then
    git switch main
  else
    git switch -c main --track origin/main
  fi
  git pull --rebase --autostash origin main
}

sync_repo_main "$DEVLAB_REPO" "https://github.com/GHX5T-SOL/Dev-lab-of-CyberTrader-Age-of-Pantheon-" "devlab"
sync_repo_main "$GAME_REPO" "https://github.com/GHX5T-SOL/CyberTrader-Age-of-Pantheon-v6.git" "v6"

if [[ "$AGENT_ID" == "zara" ]]; then
  AGENT_TITLE="Zara - OpenClaw implementation scout"
  CADENCE="implementation, feature work, repo hygiene, asset/performance work, App Store readiness unblockers"
else
  AGENT_TITLE="Zyra - OpenClaw QA, task sync, release readiness watcher"
  CADENCE="QA, build verification, task-map updates, release readiness, broken-work recovery, documentation sync"
fi

PROMPT_FILE="$STATE_DIR/$AGENT_ID-prompt.md"
cat > "$PROMPT_FILE" <<PROMPT
You are $AGENT_TITLE running autonomously on the Mac mini.

Mission:
- Bring CyberTrader: Age of Pantheon v6 to a polished App Store submission-ready product.
- Work continuously in sync with the Dev Lab AI Council.
- Never wait for new human instructions when useful work is available.

Repositories:
- Dev Lab, lore, game bible, AI Council docs, roadmap, living task map:
  $DEVLAB_REPO
- Actual game prototype to change and ship:
  $GAME_REPO

Operating rules:
1. Pull and inspect both repos before deciding.
2. Read the Dev Lab source of truth first: README.md, AI_Council_Charter.md, agents.md, TASKS.md, PLAN.md, docs/Roadmap.md, docs/V6-App-Store-Readiness-Task-Map.md, docs/Lore-Bible.md, docs/Game-Design-Doc.md.
3. Inspect the current v6 app state, package scripts, build/test setup, and outstanding implementation gaps.
4. Pick exactly one high-value unblocked task. Prefer tasks assigned to $AGENT_ID. If none exist, take another AI Council task. If all tasks are done, proactively improve v6 toward App Store readiness.
5. Make a focused production-grade change in the v6 repo. Avoid broad rewrites.
6. Update Dev Lab living docs after the task: TASKS.md and/or docs/V6-App-Store-Readiness-Task-Map.md and a dated note under docs/automation-runs/.
7. Run the most relevant checks available in package.json. Fix failures you introduce.
8. Commit and push every completed change to GitHub. Push v6 changes to origin/main. Push Dev Lab task/docs updates to origin/main.
9. Do not force-push. Do not expose secrets. Do not delete unrelated work. Do not edit the Dev Lab 3D office unless the task specifically requires it.
10. If blocked by missing credentials, quota, dependency failure, or merge conflict, write a precise blocker note in Dev Lab and choose a smaller unblocked task if possible.

Your current focus area: $CADENCE.

Run id: $RUN_ID.
When finished, leave the repos clean or with committed/pushed changes only.
PROMPT

run_codex() {
  local model="$1"
  local prompt_text
  prompt_text="$(cat "$PROMPT_FILE")"
  echo "--- trying codex model=$model ---"
  ensure_codex_api_login || true
  run_with_timeout "$AGENT_BACKEND_TIMEOUT_SECONDS" codex exec \
    -c 'model_provider="openai"' \
    -c 'model_reasoning_effort="xhigh"' \
    --cd "$GAME_REPO" \
    --add-dir "$DEVLAB_REPO" \
    --model "$model" \
    --dangerously-bypass-approvals-and-sandbox \
    --output-last-message "$LAST_MESSAGE" \
    "$prompt_text"
}

run_claude() {
  echo "--- trying claude fallback ---"
  run_with_timeout "$AGENT_BACKEND_TIMEOUT_SECONDS" claude -p \
    --model sonnet \
    --effort max \
    --permission-mode bypassPermissions \
    --add-dir "$DEVLAB_REPO" \
    --add-dir "$GAME_REPO" \
    "$(cat "$PROMPT_FILE")" | tee "$LAST_MESSAGE"
}

STATUS=1
run_codex "gpt-5.5" && STATUS=0 || STATUS=$?
if (( STATUS != 0 )); then run_codex "gpt-5.4" && STATUS=0 || STATUS=$?; fi
if (( STATUS != 0 )); then run_codex "gpt-5.4-mini" && STATUS=0 || STATUS=$?; fi
if (( STATUS != 0 )); then run_claude && STATUS=0 || STATUS=$?; fi

if (( STATUS != 0 )); then
  echo "all agent backends failed with status $STATUS"
  mkdir -p "$DEVLAB_REPO/docs/automation-runs"
  cat > "$DEVLAB_REPO/docs/automation-runs/${RUN_ID}-blocked.md" <<BLOCKED
# $RUN_ID blocked

Agent: $AGENT_ID
Status: all configured agent backends failed before a completed task could be shipped.

Required follow-up:
- Check OpenAI/Claude quota and auth on the Mac mini.
- Check runner log: $LOG_FILE
- Re-run: $RUN_ROOT/bin/cybertrader-agent-runner.sh $AGENT_ID
BLOCKED
fi

for repo in "$GAME_REPO" "$DEVLAB_REPO"; do
  cd "$repo"
  configure_git
  if [[ -n "$(git status --porcelain)" ]]; then
    git add -A
    git commit -m "chore(openclaw): ${AGENT_ID} autonomous cycle ${RUN_ID}" || true
  fi
  git pull --rebase --autostash origin main || true
  git push origin HEAD:main || true
done

echo "===== $RUN_ID finished status=$STATUS $(date '+%Y-%m-%dT%H:%M:%S%z') ====="
exit "$STATUS"
