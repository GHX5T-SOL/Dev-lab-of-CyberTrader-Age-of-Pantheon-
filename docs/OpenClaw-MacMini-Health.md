# OpenClaw Mac mini Health - 2026-04-28

Node: `brucewayne@100.117.148.52` over Tailscale
Host: `Bruces-Mac-mini.local`
Latest verified repair window: 2026-04-28T21:55Z

## Verified

- Interactive SSH is reachable, but can take 30-45 seconds to present a shell prompt over the Tailscale route. Health checks should use `ConnectTimeout` of at least 90 seconds or an already-open shell.
- `ai.openclaw.gateway` is loaded under launchd.
- Gateway `/ready` returns healthy at `http://127.0.0.1:18789/ready`.
- `ai.cybertrader.zara.autonomous`, `ai.cybertrader.zyra.autonomous`, and `ai.cybertrader.openclaw-watchdog` are loaded under launchd.
- `~/.openclaw` exists with agents, cron, workspaces, logs, and config.
- OpenClaw binary is symlinked at:
  - `/usr/local/bin/openclaw`
  - `/Users/brucewayne/.local/bin/openclaw`
- Non-interactive SSH has a minimal PATH (`/usr/bin:/bin:/usr/sbin:/sbin`), so commands must export:

```bash
export PATH="/usr/local/bin:/Users/brucewayne/.local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"
```

## Version

- Installed before update: `OpenClaw 2026.4.23 (a979721)`
- Latest official GitHub release checked by API: `v2026.4.24`
- Latest release URL: `https://github.com/openclaw/openclaw/releases/tag/v2026.4.24`
- Latest official release checked by API on 2026-04-28: `v2026.4.26`
- Current repaired runtime: `OpenClaw 2026.4.26 (be8c246)`.
- Required update target: `OpenClaw 2026.4.26`.
- Runtime Node: user-local `v22.22.2`
- Runner PATH now prefers `/Users/brucewayne/.openclaw-runtime-2026.4.26/node_modules/.bin` before the older `2026.4.24` runtime path.

## Model Config

The legacy OpenClaw gateway config summary showed:

- default primary model: `blockrun/openai/gpt-5.5`
- fallback chain includes `gpt-5.4`, Claude Opus/Sonnet, `gpt-5.3-codex`, `o3`, Gemini, Grok
- `thinkingDefault`: `max`
- Zara agent exists: `Zara - CyberTrader Implementation Scout`
- Zyra agent exists: `Zyra - CyberTrader PM/QA`
- cron enabled with `maxConcurrentRuns: 2`
- current config was re-touched by OpenClaw `2026.4.24` and still keeps `thinkingDefault: max` under agent defaults

The active Zara/Zyra launchd runner does not depend on that paid-first gateway chain. It runs free-first Goose/OpenRouter models, only enables paid Claude/Codex when explicit environment flags are set, and falls back to deterministic local maintenance plus Dev Lab run notes when providers fail.

Secrets were not printed or copied.

## v6 Runtime Hooks

- Clean remote v6 clone exists at `/Users/brucewayne/CyberTrader-Age-of-Pantheon-v6`.
- Dev Lab clone exists at `/Users/brucewayne/Dev-lab-of-CyberTrader-Age-of-Pantheon-`.
- External launchd jobs are active:
  - `ai.cybertrader.zara.autonomous`: every 2 hours.
  - `ai.cybertrader.zyra.autonomous`: every 1 hour.
  - `ai.cybertrader.openclaw-watchdog`: every 15 minutes.
- Gateway is running through launchd as `ai.openclaw.gateway`.
- First repaired Zara cycle pulled Dev Lab to `origin/main`, fast-forwarded v6 to current, and began active v6 implementation work.

## Issues Found

- `openclaw` is not on PATH in non-interactive SSH unless PATH is exported.
- Plain interactive SSH works, but non-interactive/batch SSH with short timeouts can fail because the Mac mini session is slow to complete key exchange/login over Tailscale.
- `openclaw doctor` can still exceed bounded runs; keep doctor/security audits time-limited.
- Launchd currently injects many API keys and wallet secrets into the gateway environment. Do not print launchd environment in logs. Plan a secrets hygiene pass before broader automation sharing.
- Remote Dev Lab repo had untracked `TASKS_NOTE.md`.
- Remote `~/cypantheon` is not the v6 repo; it points to the Dev Lab origin with no commits.
- OpenClaw reports 38 skill requirement gaps after doctor fix.

## Current Follow-up

1. Let Zara finish the active v6 implementation cycle and push when checks pass.
2. Keep the 15-minute watchdog active; it clears stale locks after `STALE_RUN_SECONDS`, recovers gateway `/ready`, and starts missing/exited Zara/Zyra jobs without interrupting active jobs.
3. Resolve or intentionally defer the remaining OpenClaw skill requirement gaps.
4. Run `openclaw security audit --deep` only in a bounded session.
5. Move long-lived secrets out of launchd-readable environment output where possible.
