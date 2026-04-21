# Decision Log

> Every AI Council decision, appended. Newest at top.

## 2026-04-21 — Phase B Dev Lab activation

**Members**: Ghost direction, Orchestrator, UI/UX, Frontend/Mobile, Brand & Asset, QA, OpenClaw Living.

**Topic**: Promote the Dev Lab companion site from Phase A scaffold to a live 3D Phase B command center.

**Decisions**:
1. **Ghost role corrected** to Lead Developer and final technical sign-off.
2. **Zoro role corrected** to Creative Lead and final visual/brand sign-off.
3. **Zara and Zyra added** as concrete OpenClaw Living Agents on `ssh zyra-mini` over Tailscale.
4. **Avatar Lab now uses local GLB assets** from `web/public/GLB_Assets`; the remote creator iframe path is removed from the product UI.
5. **Floor 3D defaults to `office_floor_option_2.glb`** because the inspection pass found it much lighter than option 1 while still suitable for the office layout.
6. **Whiteboard becomes the Phase B operating board** with owner, priority, estimate, dependency, acceptance criteria, and tags.

**Dissent / risks**:
- Heavy furniture GLBs require a Zara compression/LOD pass before mobile-grade reuse.
- `ssh zyra-mini` resolved during verification, but `tailscale` and `openclaw` CLIs were not on PATH on the remote node.

**Hand-off**: Zara → GLB compression and Blender queue setup. Zyra → heartbeat/file watcher hardening. Axiom → browser performance benchmark. Ghost → final push/redeploy sign-off.

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
