# Zyra Heartbeat — Autonomous Monitoring Checklist

> Created to satisfy **zyra-p0-001**: hourly heartbeat cron monitoring task board, AI Council, build health, performance gates, and PR status.

**Cron ID**: `863b73c1`
**Schedule**: Hourly
**Owner**: Zyra (zyra-mini OpenClaw node)
**Last Updated**: 2026-04-25

## Heartbeat Checklist

### 1. Task Board Health
- [ ] `web/src/data/tasks.ts` parses without syntax errors
- [ ] All P0 tasks have owners and acceptance criteria
- [ ] No P0 tasks stuck in "blocked" status >48h without escalation
- [ ] Task board `LAST_UPDATED` reflects recent activity

### 2. AI Council Status
- [ ] `docs/Decision-Log.md` exists and is current
- [ ] No unresolved council dissents >72h old
- [ ] Council format and quorum remain functional per charter

### 3. Build Health Gates
- [ ] `npm --prefix web run typecheck` passes on main
- [ ] `npm --prefix web run build` passes without errors
- [ ] No new TypeScript errors introduced since last heartbeat
- [ ] Web runtime loads without console blocking errors

### 4. Performance Gates
- [ ] GLB asset manifest exists and is current
- [ ] No individual GLB assets >50MB without performance budget approval
- [ ] Heavy asset compression queue documented if assets exceed targets
- [ ] Core Web Vitals regression checks documented

### 5. PR Status Triage
- [ ] No draft PRs >7 days old without activity or explicit pause
- [ ] All ready PRs have passed CI and review before auto-merge eligibility  
- [ ] No merge conflicts on active feature branches
- [ ] Standing approval limits respected (no force-push, no secrets, no org changes)

### 6. Node Infrastructure
- [ ] SSH access to zyra-mini functional (`ssh zyra-mini "echo ok"`)
- [ ] OpenClaw CLI responsive (`openclaw --version`)
- [ ] Tailscale connectivity stable if applicable
- [ ] Local workspace sync healthy (`git fetch --prune && git status`)

## Failure Escalation

**Soft failures** (single gate fails): Log to heartbeat output, continue checklist
**Hard failures** (multiple gates fail, or SSH/workspace unreachable): Create GitHub issue tagged `needs-human` and halt autonomous operations until manual intervention

## Output Format

```
HEARTBEAT [timestamp]
✓ Task board health
✓ AI Council status  
✗ Build health gates (typecheck failed - details in logs)
✓ Performance gates
✓ PR status triage
✓ Node infrastructure
SUMMARY: 5/6 passed, 1 soft failure logged
```

## Historical Notes

**2026-04-25**: Heartbeat checklist created and activated with hourly cron. Initial implementation covers task board monitoring, build gates, and PR triage as specified in task acceptance criteria.

## See Also

- `docs/Zyra-Zara-Governance.md` - Autonomy framework and handoff protocols
- `docs/Collaboration-Protocol.md` - SSH access and team coordination  
- `web/src/data/tasks.ts` - Master task board source of truth