# Decision Log

> Every AI Council decision, appended. Newest at top.

## 2026-04-21 — OpenClaw workers added to Dev Lab operating model

**Members**: Orchestrator (Claude), Compass, Cipher, Axiom, Talon, Zyra, Zara. Ghost requested and ratifies.

**Topic**: Represent the new OpenClaw workers across docs, task board, crons, Council, and the Dev Lab web app.

**Decisions**:
1. **Team model expands to 16 operators**: Ghost, Zoro, 12 council subagents, Zyra, and Zara.
2. **Ghost role clarified** as human Founder / Lead Developer.
3. **Zoro role clarified** as human Co-Founder / Creative Lead.
4. **Zyra owns PM / QA / cron autonomy**: repo health, board review, Council routing, GitHub issue follow-up, and status reporting.
5. **Zara owns implementation autonomy**: scoped task pickup, branch work, local verification, pushes, and draft PRs.
6. **OpenClaw crons are first-class project infrastructure** and must be mirrored in `web/src/data/automations.ts` and `/office/automations`.
7. **Autonomous pickup is allowed** when safe work exists; non-trivial architecture, brand, economy, auth, wallet, deployment, or public-facing work still goes through Council before execution.

**Dissent**: none recorded.

**Hand-off**: Zyra → create GitHub Issues from the expanded task board. Zara → wait for Ghost/Council to select the first Phase 1 implementation spike, then open a draft PR.

---

## 2026-04-19 — Repo scaffold + AI team activation

**Members**: Orchestrator (Claude) + implicit council check against [AI_Council_Charter.md](../AI_Council_Charter.md). Ghost ratifies.

**Topic**: Adopt the Dev Lab as the single organized hub; lock tech stack; activate the 12-agent team.

**Decisions**:
1. **Canonical vision** = v5 `BUILD_PLAN.md`, absorbed into [Game-Design-Doc.md](Game-Design-Doc.md). Other prototypes (v1–v4, str33t_trad3r) are referenced but not sources of truth.
2. **Tech stack locked** for Phase 1: Expo + React Native + TypeScript + Zustand + MMKV + Reanimated + Supabase. See [Technical-Architecture.md](Technical-Architecture.md).
3. **Authority adapter pattern** from day one, even for local-first MVP.
4. **Brand v1** adopted per [brand-guidelines.md](../brand/brand-guidelines.md). Violet reserved for lore beats only.
5. **12-agent team activated** per [agents.md](../agents.md). AI Council runs per [AI_Council_Charter.md](../AI_Council_Charter.md).
6. **30-day plan** locked per [Roadmap.md](Roadmap.md).

**Dissent**: none recorded.

**Hand-off**: Frontend/Mobile → scaffold Expo starter. Backend/Web3 → scaffold Supabase. Brand & Asset → produce logo v1 via SpriteCook. PM → schedule end-of-week council retro.

---

_(new decisions go above this line)_
