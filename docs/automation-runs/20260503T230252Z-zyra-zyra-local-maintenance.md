# 20260503T230252Z-zyra local maintenance fallback

Agent: zyra
Status: model/router backends were unavailable or rate-limited, so the runner performed deterministic local maintenance and exited cleanly.

## Checks

```text
run_id=20260503T230252Z-zyra agent=zyra
date=2026-05-03T23:03:55Z
v6_status_before=## main...origin/main 
devlab_status_before=## main...origin/main ?? docs/automation-runs/20260503T230252Z-zyra-zyra-local-maintenance.md 
npm error A complete log of this run can be found in: /Users/brucewayne/.npm/_logs/2026-05-03T23_03_56_280Z-debug-0.log
running npm run regression:monitor

> cybertrader-mobile@0.1.0-phase0 regression:monitor
> node scripts/regression-monitor.mjs

{
  "ok": false,
  "runId": "2026-05-03T23:03:57.825Z",
  "skipped": false,
  "forceMode": false,
  "previousCommit": "c7258616d88dd78d05f172aef9a7f910ec1a2ea2",
  "checkedCommit": "ad8f2dc31e8c6b3d5e59721768d3d7a5e6c2519c",
  "startedAt": "2026-05-03T23:03:57.826Z",
  "finishedAt": "2026-05-03T23:07:31.719Z",
  "steps": [
    {
      "step": "typecheck",
      "ok": false,
      "stderr": ""
    },
    {
      "step": "jest",
      "ok": true,
      "stdout": "> cybertrader-mobile@0.1.0-phase0 test\n> jest --runInBand --forceExit"
    },
    {
      "step": "health:live",
      "ok": true,
      "stdout": "> cybertrader-mobile@0.1.0-phase0 health:live\n> node scripts/check-live-deployment.mjs\n\n{\n  \"ok\": true,\n  \"url\": \"https://cyber-trader-age-of-pantheon-v6.vercel.app\",\n  \"status\": 200,\n  \"durationMs\": 1140,\n  \"contentType\": \"text/html; charset=utf-8\",\n  \"vercelCache\": \"HIT\"\n}"
    }
  ]
}
v6_status_after=## main...origin/main 
devlab_status_after=## main...origin/main ?? docs/automation-runs/20260503T230252Z-zyra-zyra-local-maintenance.md 
```
