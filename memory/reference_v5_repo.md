---
name: v5 canonical source repo
description: github.com/GHX5T-SOL/CyberTrader-Age-of-Pantheon-v5 is the canonical design source — README + BUILD_PLAN.md fully absorbed into docs/Game-Design-Doc.md
type: reference
---

**Canonical URL**: https://github.com/GHX5T-SOL/CyberTrader-Age-of-Pantheon-v5

**Key files**:
- `README.md` — Phase 1 pirate-OS loop overview (cinematic → wallet → boot → dashboard → trading)
- `BUILD_PLAN.md` — full 3-phase plan (MVP, AgentOS, PantheonOS), tech stack, commodity design, aesthetic spec, DoD
- Structure: `app/`, `src/`, `supabase/`, `docs/`, `design/`, `tests/`, `.superdesign/`

**Why**: This was Ghost's most advanced prototype. All vision and technical decisions in the Dev Lab derive from it. Other prototypes (v1–v4, str33t_trad3r) are historical reference only.

**How to apply**: When the Dev Lab's own `docs/Game-Design-Doc.md` is ambiguous or missing a detail, check v5's BUILD_PLAN.md. If a conflict exists, the Dev Lab's doc wins unless Ghost explicitly retcons. Don't copy v5 code directly — the Dev Lab is a clean restart; cherry-pick concepts, not implementations.
