# OpenClaw Mac mini Health - 2026-04-25

Node: `brucewayne@100.117.148.52` over Tailscale
Host: `Bruces-Mac-mini.local`

## Verified

- SSH is reachable.
- `ai.openclaw.gateway` is loaded under launchd.
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
- Installed after update: `OpenClaw 2026.4.24 (cbcfdf6)`
- Runtime Node: user-local `v22.22.2`
- Gateway ProgramArguments now point at:
  - `/Users/brucewayne/.local/node-current/bin/node`
  - `/Users/brucewayne/.openclaw-runtime-2026.4.24/node_modules/openclaw/dist/index.js`

## Model Config

The non-secret config summary showed:

- default primary model: `blockrun/openai/gpt-5.5`
- fallback chain includes `gpt-5.4`, Claude Opus/Sonnet, `gpt-5.3-codex`, `o3`, Gemini, Grok
- `thinkingDefault`: `max`
- Zara agent exists: `Zara - CyberTrader Implementation Scout`
- Zyra agent exists: `Zyra - CyberTrader PM/QA`
- cron enabled with `maxConcurrentRuns: 2`
- current config was re-touched by OpenClaw `2026.4.24` and still keeps `thinkingDefault: max` under agent defaults

Secrets were not printed or copied.

## v6 Runtime Hooks

- Clean remote v6 clone exists at `/Users/brucewayne/CyberTrader-Age-of-Pantheon-v6`.
- Dev Lab clone exists at `/Users/brucewayne/Dev-lab-of-CyberTrader-Age-of-Pantheon-`.
- Added enabled cron jobs:
  - `CyberTrader v6 Zara autonomous implementation scout` at `17 */2 * * *`
  - `CyberTrader v6 Zyra QA and task sync` at `47 * * * *`
- Gateway is running through launchd as `ai.openclaw.gateway`.

## Issues Found

- `openclaw` is not on PATH in non-interactive SSH unless PATH is exported.
- `openclaw doctor` still times out in bounded runs after update; `openclaw doctor --fix` did complete.
- Launchd currently injects many API keys and wallet secrets into the gateway environment. Do not print launchd environment in logs. Plan a secrets hygiene pass before broader automation sharing.
- Remote Dev Lab repo had untracked `TASKS_NOTE.md`.
- Remote `~/cypantheon` is not the v6 repo; it points to the Dev Lab origin with no commits.
- OpenClaw reports 38 skill requirement gaps after doctor fix.

## Required Follow-up

1. Resolve or intentionally defer the 38 OpenClaw skill requirement gaps.
2. Run `openclaw security audit --deep` in a bounded session.
3. Let Zara/Zyra complete first v6 cron runs and verify commits/logs.
4. Log every autonomous run to `docs/automation-runs/YYYY-MM-DD.md`.
5. Move long-lived secrets out of launchd-readable environment output where possible.
