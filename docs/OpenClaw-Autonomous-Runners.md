# OpenClaw Autonomous Runners

The Mac mini runs Zara and Zyra through external `launchd` jobs instead of OpenClaw's embedded cron. This avoids the current gateway freezes caused by OpenClaw cron, Telegram startup, and ClawRouter proxy startup while still keeping the agents on a repeatable 24/7 cadence.

Source of truth:
- Dev Lab repo: `/Users/brucewayne/Dev-lab-of-CyberTrader-Age-of-Pantheon-`
- Game repo: `/Users/brucewayne/CyberTrader-Age-of-Pantheon-v6`
- Runner root: `/Users/brucewayne/.openclaw/cybertrader-runners`

Jobs:
- `ai.cybertrader.zara.autonomous`: every 2 hours, implementation and production changes.
- `ai.cybertrader.zyra.autonomous`: every 1 hour, QA, task sync, release readiness, recovery.
- Codex desktop heartbeat `openclaw-runner-health-watchdog`: every 2 hours, reports unhealthy runner/gateway/repo states in the controlling thread.

Each cycle:
1. Syncs both repos.
2. Reads Dev Lab lore, AI Council docs, roadmap, and task map.
3. Chooses one high-value unblocked task.
4. Changes the v6 game repo.
5. Updates Dev Lab task/roadmap/run notes.
6. Runs relevant checks.
7. Commits and pushes to GitHub.

Current stability policy:
- OpenClaw gateway stays up with `OPENCLAW_SKIP_CHANNELS=1` and `OPENCLAW_SKIP_CRON=1`.
- Telegram is not allowed to own execution because Telegram API calls currently time out from the Mac mini.
- ClawRouter is disabled until its proxy can run without blocking the gateway bind. A re-test on 2026-04-26 still prevented `/ready` from coming up.
- OpenClaw thinking defaults are `xhigh`; `max` is invalid for `openai/gpt-5.5`.
- OpenClaw sandbox mode is `off` on this Mac mini because Docker is not installed and Docker sandbox mode prevents embedded agent runs.
- The runner uses an isolated `CODEX_HOME` under the runner root so stale ChatGPT/Aperture Codex auth cannot override API-key auth.
- The runner's lock cleanup only runs in the top-level process, preventing timeout/watchdog helpers from clearing the global lock mid-run.
- The runner tries Codex `gpt-5.5`, then `gpt-5.4`, then `gpt-5.4-mini`, then Claude Code fallback.
- Each backend attempt is capped at 45 minutes so a stuck model call does not freeze a full shift.

Current known provider state:
- The OpenAI API key is present and `/v1/models` succeeds.
- OpenAI generation currently returns quota exceeded, so live work falls through to Claude Code until credits are restored.
- The configured free BlockRun/ClawRouter route is not currently reliable enough for unattended production changes because enabling the proxy blocks the gateway from reaching `/ready`.

Useful commands:

```bash
ssh brucewayne@100.117.148.52
tail -f ~/.openclaw/cybertrader-runners/logs/zara.log
tail -f ~/.openclaw/cybertrader-runners/logs/zyra.log
launchctl list | grep ai.cybertrader
~/.openclaw/cybertrader-runners/bin/cybertrader-agent-runner.sh zara
~/.openclaw/cybertrader-runners/bin/cybertrader-agent-runner.sh zyra
```

## 2026-04-27 runner routing update

Zara and Zyra now use a free-first resilient provider cascade on `brucewayne@100.117.148.52`:

1. Goose CLI with OpenRouter free models, currently starting with `openai/gpt-oss-120b:free` and falling back through GLM, GPT-OSS 20B, Llama, Qwen, and Hermes free models.
2. Optional paid CLI fallbacks are disabled by default. Set `OPENCLAW_ALLOW_PAID_CLI=1` only when Claude/Codex credits are intentionally available.
3. If model routing is unavailable or a free model no-ops, the runner performs deterministic local maintenance (`npm run regression:monitor` or `npm run typecheck`), writes an automation run note, commits, pushes, and exits cleanly.
4. The runner prompt now tells Goose to use shell tools (`rg`, `sed`, `cat`, `find`, `npm`, `git`) and avoid unavailable pseudo-tools such as `open_file` or `search`.
