#!/usr/bin/env bash
set -Eeuo pipefail

AGENT_ID="${1:-}"
if [[ "$AGENT_ID" != "zara" && "$AGENT_ID" != "zyra" ]]; then
  echo "usage: $0 zara|zyra" >&2
  exit 64
fi

export PATH="$HOME/.local/node-current/bin:$HOME/.openclaw-runtime-2026.4.24/node_modules/.bin:$HOME/.local/node-v22.22.2-darwin-x64/bin:$HOME/.local/bin:/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"
export LANG="${LANG:-en_US.UTF-8}"
export LC_ALL="${LC_ALL:-en_US.UTF-8}"

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
DIRECTIVE_FILE="$RUN_ROOT/notes/$AGENT_ID-telegram-directives.md"
AGENT_BACKEND_TIMEOUT_SECONDS="${AGENT_BACKEND_TIMEOUT_SECONDS:-1800}"
OPENCLAW_USE_OPENAI_CODEX="${OPENCLAW_USE_OPENAI_CODEX:-0}"
OPENCLAW_ALLOW_PAID_CLI="${OPENCLAW_ALLOW_PAID_CLI:-0}"
OPENCLAW_FREE_GOOSE_MODELS="${OPENCLAW_FREE_GOOSE_MODELS:-openrouter|openai/gpt-oss-120b:free openrouter|z-ai/glm-4.5-air:free openrouter|openai/gpt-oss-20b:free openrouter|meta-llama/llama-3.3-70b-instruct:free openrouter|qwen/qwen3-coder:free openrouter|qwen/qwen3-next-80b-a3b-instruct:free openrouter|nousresearch/hermes-3-llama-3.1-405b:free openrouter|meta-llama/llama-3.2-3b-instruct:free}"
ZYRA_START_DELAY_SECONDS="${ZYRA_START_DELAY_SECONDS:-45}"
MAIN_PID="$$"
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
    local lock_cmd
    lock_cmd="$(ps -p "$lock_pid" -o command= 2>/dev/null || true)"
    if [[ "$lock_cmd" == *"cybertrader-agent-runner"* || "$lock_cmd" == *"codex exec"* || "$lock_cmd" == *"claude"* ]]; then
      echo "lock $name is active under pid $lock_pid ($lock_cmd)"
      exit 0
    fi
    echo "stale lock $name pid $lock_pid now belongs to unrelated process; clearing"
    rm -rf "$dir"
    mkdir "$dir"
    echo "$$" > "$dir/pid"
    date -u +%s > "$dir/created_at"
    return 0
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
  if [[ "$$" != "$MAIN_PID" || "${BASH_SUBSHELL:-0}" != "0" ]]; then
    return 0
  fi

  local dir owner_pid
  for dir in "$LOCK_DIR/global.lock" "$LOCK_DIR/$AGENT_ID.lock"; do
    owner_pid="$(cat "$dir/pid" 2>/dev/null || true)"
    if [[ "$owner_pid" == "$MAIN_PID" ]]; then
      rm -rf "$dir"
    fi
  done
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
    trap - EXIT
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
- There are no Ghost/Zoro/human approval gates for normal implementation, design, lore, asset, automation, or roadmap work.

Repositories:
- Dev Lab, lore, game bible, AI Council docs, roadmap, living task map:
  $DEVLAB_REPO
- Actual game prototype to change and ship:
  $GAME_REPO

Operating rules:
0. In Goose/free-router mode, use shell commands such as rg, sed, cat, find, npm, and git for file inspection and edits. Do not call non-existent tools such as open_file or search.
1. Pull and inspect both repos before deciding.
2. Read the Dev Lab source of truth first: README.md, AI_Council_Charter.md, agents.md, TASKS.md, PLAN.md, docs/Roadmap.md, docs/V6-App-Store-Readiness-Task-Map.md, docs/Lore-Bible.md, docs/Game-Design-Doc.md.
3. Keep the free-router context small: inspect only the specific files needed for one task. Do not dump entire huge markdown files unless necessary.
4. Pick exactly one high-value unblocked task. Prefer tasks assigned to $AGENT_ID. If none exist, take another AI Council task. If all tasks are done, invent and implement the next useful game improvement.
5. Make a focused production-grade change in the v6 repo. Prioritize visible player-facing upgrades when safe: PirateOS polish, AgentOS factions, PantheonOS territory, missions, levels, commodities, abilities, cinematics, UI, assets, or performance.
6. Update Dev Lab living docs after the task: TASKS.md and/or docs/V6-App-Store-Readiness-Task-Map.md and a dated note under docs/automation-runs/. If the task exposes a human-only account/legal/payment/credential blocker, write it to HUMAN_ACTIONS.md and continue with other work.
7. Run the most relevant checks available in package.json. Fix failures you introduce.
8. Commit and push every completed change to GitHub. Push v6 changes to origin/main. Push Dev Lab task/docs updates to origin/main.
9. Do not force-push. Do not expose secrets. Do not delete unrelated work. Do not edit the Dev Lab 3D office unless the task specifically requires it.
10. If blocked by missing credentials, quota, dependency failure, or merge conflict, write a precise blocker note in Dev Lab and choose a smaller unblocked task if possible. Do not wait for Ghost, Zoro, or human review.

Your current focus area: $CADENCE.

Run id: $RUN_ID.
When finished, leave the repos clean or with committed/pushed changes only.
PROMPT

if [[ -f "$DIRECTIVE_FILE" ]]; then
  {
    echo
    echo "Recent Telegram/user directives for $AGENT_ID:"
    tail -n 120 "$DIRECTIVE_FILE"
  } >> "$PROMPT_FILE"
fi

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
  echo "--- trying claude primary ---"
  local output_file="$STATE_DIR/$AGENT_ID-claude-output.log"
  local status=0
  run_with_timeout "$AGENT_BACKEND_TIMEOUT_SECONDS" claude \
    --model sonnet \
    --permission-mode bypassPermissions \
    --add-dir "$DEVLAB_REPO" \
    --add-dir "$GAME_REPO" \
    -p "$(cat "$PROMPT_FILE")" > "$output_file" 2>&1 || status=$?
  cat "$output_file"
  cp "$output_file" "$LAST_MESSAGE"
  return "$status"
}

run_goose_model() {
  local provider="$1"
  local model="$2"
  echo "--- trying goose free/router coding fallback provider=$provider model=$model ---"
  if [[ "$provider" == "openrouter" && -z "${OPENROUTER_API_KEY:-}" ]]; then
    echo "OPENROUTER_API_KEY missing; skipping $model"
    return 1
  fi
  if [[ "$provider" == "google" ]]; then
    export GOOGLE_API_KEY="${GOOGLE_API_KEY:-${GEMINI_API_KEY:-}}"
    [[ -n "${GOOGLE_API_KEY:-}" ]] || { echo "GOOGLE_API_KEY/GEMINI_API_KEY missing; skipping $model"; return 1; }
  fi
  local safe_model="${model//[^A-Za-z0-9._-]/_}"
  local output_file="$STATE_DIR/$AGENT_ID-goose-${provider}-${safe_model}-output.log"
  local status=0
  (
    cd "$GAME_REPO"
    export GOOSE_DISABLE_KEYRING=1
    export GOOSE_TELEMETRY_ENABLED=false
    export GOOSE_PROVIDER="$provider"
    export GOOSE_MODEL="$model"
    run_with_timeout "$AGENT_BACKEND_TIMEOUT_SECONDS" goose run \
      --no-session \
      --no-profile \
      --with-builtin developer \
      --provider "$provider" \
      --model "$model" \
      --max-turns 30 \
      --text "$(cat "$PROMPT_FILE")"
  ) > "$output_file" 2>&1 || status=$?
  tail -240 "$output_file" || true
  cp "$output_file" "$LAST_MESSAGE" || true
  return "$status"
}

run_goose_free_chain() {
  local spec provider model
  for spec in $OPENCLAW_FREE_GOOSE_MODELS; do
    provider="${spec%%|*}"
    model="${spec#*|}"
    [[ -n "$provider" && -n "$model" && "$provider" != "$model" ]] || continue
    if run_goose_model "$provider" "$model"; then
      echo "goose free/router backend succeeded: $provider $model"
      return 0
    fi
    echo "goose free/router backend failed: $provider $model"
  done
  return 1
}

run_local_maintenance() {
  echo "--- running no-LLM local maintenance fallback ---"
  local note="$DEVLAB_REPO/docs/automation-runs/${RUN_ID}-${AGENT_ID}-local-maintenance.md"
  local report="$STATE_DIR/$AGENT_ID-local-maintenance-output.log"
  mkdir -p "$(dirname "$note")"
  {
    echo "# $RUN_ID local maintenance fallback"
    echo
    echo "Agent: $AGENT_ID"
    echo "Status: model/router backends were unavailable or rate-limited, so the runner performed deterministic local maintenance and exited cleanly."
    echo
    echo "## Checks"
  } > "$note"
  {
    echo "run_id=$RUN_ID agent=$AGENT_ID"
    echo "date=$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
    echo "v6_status_before=$(git -C "$GAME_REPO" status --short --branch | tr '\n' ' ')"
    echo "devlab_status_before=$(git -C "$DEVLAB_REPO" status --short --branch | tr '\n' ' ')"
    cd "$GAME_REPO"
    if npm run | grep -q "regression:monitor"; then
      echo "running npm run regression:monitor"
      run_with_timeout 1200 npm run regression:monitor || true
    elif npm run | grep -q "typecheck"; then
      echo "running npm run typecheck"
      run_with_timeout 900 npm run typecheck || true
    else
      echo "no package maintenance script found"
    fi
    echo "v6_status_after=$(git -C "$GAME_REPO" status --short --branch | tr '\n' ' ')"
    echo "devlab_status_after=$(git -C "$DEVLAB_REPO" status --short --branch | tr '\n' ' ')"
  } > "$report" 2>&1 || true
  tail -120 "$report" || true
  {
    echo
    echo '```text'
    tail -120 "$report" || true
    echo '```'
  } >> "$note"
  cp "$report" "$LAST_MESSAGE" || true
  return 0
}

run_openrouter_note() {
  echo "--- trying OpenRouter free-model fallback note ---"
  [[ -n "${OPENROUTER_API_KEY:-}" ]] || { echo "OPENROUTER_API_KEY missing"; return 1; }
  export RUN_ID AGENT_ID DEVLAB_REPO GAME_REPO LAST_MESSAGE
  python3 - <<'PYOR'
import json, os, pathlib, urllib.request
run_id=os.environ['RUN_ID']; agent=os.environ['AGENT_ID']
dev=pathlib.Path(os.environ['DEVLAB_REPO']); game=pathlib.Path(os.environ['GAME_REPO'])
prompt=f"""You are {agent}, an autonomous CyberTrader v6 agent. Primary code backend is unavailable. Produce a concise recovery task note: one safe next task, exact files to inspect, and acceptance checks. Do not include secrets. Dev Lab: {dev}. Game repo: {game}."""
req=urllib.request.Request('https://openrouter.ai/api/v1/chat/completions', data=json.dumps({'model':'openai/gpt-oss-120b:free','messages':[{'role':'system','content':'You write practical engineering task notes.'},{'role':'user','content':prompt}],'max_tokens':900}).encode(), headers={'Authorization':'Bearer '+os.environ['OPENROUTER_API_KEY'], 'Content-Type':'application/json', 'HTTP-Referer':'https://github.com/GHX5T-SOL/CyberTrader-Age-of-Pantheon-v6', 'X-Title':'CyberTrader OpenClaw Runner'})
try:
  with urllib.request.urlopen(req, timeout=90) as r: data=json.loads(r.read().decode())
  content=data['choices'][0]['message']['content'].strip()
except Exception as e:
  print('OpenRouter fallback failed:', e); raise SystemExit(1)
out=dev/'docs'/'automation-runs'/f'{run_id}-{agent}-openrouter-fallback.md'
out.parent.mkdir(parents=True, exist_ok=True)
body = "# {} OpenRouter fallback\n\nAgent: {}\nStatus: primary code backend unavailable; free-model fallback produced this recovery note.\n\n{}\n".format(run_id, agent, content)
out.write_text(body, encoding='utf-8')
pathlib.Path(os.environ['LAST_MESSAGE']).write_text(content, encoding='utf-8')
print(content)
PYOR
}

STATUS=1
run_goose_free_chain && STATUS=0 || STATUS=$?
if (( STATUS != 0 )) && [[ "$OPENCLAW_ALLOW_PAID_CLI" == "1" ]]; then run_claude && STATUS=0 || STATUS=$?; fi
if (( STATUS != 0 )) && [[ "$OPENCLAW_ALLOW_PAID_CLI" == "1" && "$OPENCLAW_USE_OPENAI_CODEX" == "1" ]]; then run_codex "gpt-5.5" && STATUS=0 || STATUS=$?; fi
if (( STATUS != 0 )) && [[ "$OPENCLAW_ALLOW_PAID_CLI" == "1" && "$OPENCLAW_USE_OPENAI_CODEX" == "1" ]]; then run_codex "gpt-5.4" && STATUS=0 || STATUS=$?; fi
if (( STATUS != 0 )) && [[ "$OPENCLAW_ALLOW_PAID_CLI" == "1" && "$OPENCLAW_USE_OPENAI_CODEX" == "1" ]]; then run_codex "gpt-5.4-mini" && STATUS=0 || STATUS=$?; fi
if (( STATUS != 0 )); then run_openrouter_note && STATUS=0 || STATUS=$?; fi
if (( STATUS != 0 )); then run_local_maintenance && STATUS=0 || STATUS=$?; fi
if (( STATUS == 0 )) && [[ -z "$(git -C "$GAME_REPO" status --porcelain)" && -z "$(git -C "$DEVLAB_REPO" status --porcelain)" ]]; then
  echo "backend completed without repo changes; recording deterministic maintenance heartbeat"
  run_local_maintenance && STATUS=0 || STATUS=$?
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
