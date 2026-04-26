# Decision Log

> Every AI Council decision, appended. Newest at top.

## 2026-04-26 - Weekly v6 store-readiness checkpoint

**Members**: Compass (facilitator), Talon, Ghost/Zoro direction, Rune, Axiom, Kite, Oracle, Nyx, Vex, Zyra, Skeptic, Pragmatist, Critic.

**Topic**: Review the latest Dev Lab/v6 truth and decide whether next week should advance CyberTrader v6 toward store readiness or hold for more demo polish.

**Decisions**:
1. **Do not relabel next week as store-readiness advancement.** Phase 1 Reliable Demo remains active through 2026-05-10; Phase 2 Native Internal Testing still starts on 2026-05-11 unless the native evidence gate closes early.
2. **Run a native evidence gate next week.** The Council prefers iOS simulator smoke, Android emulator smoke, native cold-launch persistence validation, EAS credential/build dry-run proof, and Axiom checklist execution over further web-only polish.
3. **Accept the shipped v6 base as strong enough for native discovery.** Recent completed work covers Rune audits/routes/EAS profiles, Oracle replay and launch bands, Ghost release authority/risk audit, Kite authority flagging, Axiom regression checklist, Nyx first-session/pressure tuning, Zoro journey approval, Vex HUD/responsive/system-state passes, Zyra live health checks, and Talon safety preflight at v6 head `398e19f`.
4. **Keep store-candidate claims blocked.** iOS/Android runtime evidence, cold-launch storage proof, live Supabase migrations/RLS, Apple/Google credentials, first remote EAS runs, screenshots/preview/privacy/age-rating, Expo advisory remediation, and Talon rollback/incident protocol are not done.

**Dissent / risk**:
- Skeptic and Critic warned that calling this a store push would hide release gaps and contradict the roadmap.
- Pragmatist warned that more web polish will not retire native, credential, Supabase, and EAS risks.
- Shared risk: holding can become over-polish unless the native evidence gate is treated as the top weekly scope.

**Hand-off**:
- Axiom + Rune -> run Web/iOS/Android QA against the regression checklist and capture native cold-launch persistence results.
- Ghost + Rune -> approve and exercise the first TestFlight/Play build-plan dry run once credentials are confirmed.
- Kite + Ghost -> decide SupabaseAuthority launch scope and validate migrations/RLS before store-candidate claims.
- Talon + Zyra -> keep safety preflight/live health checks running and close rollback/incident protocol plus OpenClaw doctor/skill-gap follow-ups.
- Zoro + Palette + Reel + Cipher -> prepare store screenshot, preview, privacy, age-rating, and token/trading-language evidence without blocking native smoke discovery.

**Affected files**: `TASKS.md`, `docs/Decision-Log.md`, `docs/V6-App-Store-Readiness-Task-Map.md`, `docs/Roadmap.md`, `web/src/data/tasks.ts`, `web/src/data/roadmap.ts`.

---

## 2026-04-25 - v6 playable systems + Dev Lab sync

**Members**: Ghost direction, Compass, Rune, Kite, Oracle, Axiom, Zara, Zyra.

**Topic**: Accept ready Dev Lab PRs, keep draft work out of `main`, and record the current CyberTrader v6 implementation status across the Dev Lab.

**Decisions**:
1. **Ready PRs are accepted into `main`.** PR #7 (`feat: GLB assets watcher`) and PR #9 (`zara-p0-001: Persistent SSH key auth for zyra-mini`) were clean and non-draft, so they were merged locally and prepared for push.
2. **Draft PRs stay draft.** PR #10 (`feat: GLB watcher preview sync`) remains open because it is still marked draft, even though it is currently mergeable.
3. **v6 is the active playable game repo.** The Dev Lab now tracks `https://github.com/GHX5T-SOL/CyberTrader-Age-of-Pantheon-v6` as the canonical implementation branch for the actual game.
4. **v6 status must be visible in docs and the office UI.** README, roadmap, v6 export notes, Phase B notes, Whiteboard data, status data, roadmap data, and prototype wall data should all say what is in place.

**Current v6 implementation state**:
- Core LocalAuthority trade loop, 0BOL ledger, inventory positions, XP/rank, and inventory slot limits.
- Real-time ticks, deterministic news, location travel, heat/raids, Black Market heat reduction, and couriers.
- Engagement layer: flash events, NPC missions, district states, streaks, daily challenges, bounty escalation, away reports, and action feedback.
- Intro cinematic route using the shipped MP4, with browser smoke verification.

**Hand-off**:
- Compass -> keep roadmap and task-board truth aligned with v6.
- Axiom -> finish Android/iOS validation and repeatable browser playthrough checks.
- Kite -> continue SupabaseAuthority feature-flag path without regressing LocalAuthority.
- Zara/Zyra -> harden GLB watcher, SSH, heartbeat, and preview-sync flows.

---

## 2026-04-24 — Core Game Mechanics Lock

**Members**: Project Manager (Zyra, facilitator), Research & Best-Practices, Game Designer, Economy & Trading Simulation, Backend/Web3

**Topic**: Four core game mechanics from Game-Design-Doc.md open questions - Energy timing, faction switching costs, Heat decay curves, and offline tick limits.

**Decisions**:
1. **Starter Energy allotment**: 72h wall-clock (not active-play) - aligns with mobile game expectations, offline tick capping prevents exploitation.
2. **First faction switch**: Free - reduces onboarding friction and analysis paralysis for new players.
3. **Heat decay curve**: Exponential - creates strategic risk/reward depth vs linear simplicity.
4. **Offline tick cap**: 100 ticks - balances user experience vs database/Edge Function performance costs.

**Dissent**: Backend agent preferred active-play energy timing (exploitation prevention) and linear Heat decay (implementation simplicity).

**Hand-off**: Game Designer → update Game-Design-Doc.md to lock decisions. Backend → implement offline tick capping. Economy → model exponential Heat decay parameters. PM → schedule Terminal Home UI council session.

**Affected files**: docs/Game-Design-Doc.md, src/engine/types.ts (validation), backend schema (future)
## 2026-04-24 - v6 playable repo promotion

**Members**: Ghost direction, Compass, Rune, Kite, Axiom.

**Topic**: Decide whether the latest playable slice should graduate into its own public prototype repo and how the Dev Lab should refer to it.

**Decisions**:
1. **`CyberTrader-Age-of-Pantheon-v6` becomes the chosen playable game repo.** It is exported from this Dev Lab's `src/` Expo app so the shipping game has a clean standalone home.
2. **The Dev Lab remains the command center, not the shipping build repo.** Docs, planning, AI-team operations, assets, and phase tracking stay here.
3. **Prototype history is now six core versions deep.** `v1` through `v4` remain archived, `v5` remains the design-source reference, and `v6` is the active playable branch.
4. **The monitor wall and repo docs must say that clearly.** Team-facing references should stop implying the Dev Lab itself is the active prototype.

**Dissent / trade-offs**:
- Keeping the game inside the Dev Lab would have been simpler in the short term, but it would keep mixing shipping gameplay code with studio-operations code.
- Exporting `src/` to `v6` adds one more repo to manage, but it makes deployment, demoing, and future game-only iteration much cleaner.

**Hand-off**:
- Ghost -> push the standalone game repo.
- Compass -> update Dev Lab docs and prototype references.
- Axiom -> validate the first clean v6 web demo after export.

---

## 2026-04-23 - Office runtime rebuild

**Members**: Ghost direction, Compass, Vex, Rune, Reel, Axiom, Talon.

**Topic**: Replace the remaining workstation-style `/office` shell with a true office-game runtime and lock the supporting architecture around it.

**Decisions**:
1. **`/office` now becomes the primary runtime route.** The user enters through founder selection and then moves through the office rather than browsing a conventional dashboard.
2. **`/office-v2` remains as an explicit alias.** It gives QA and rollout a stable runtime-specific entry while the architecture settles.
3. **Runtime interaction is proximity-first.** Whiteboard, wireframes, credits, cinema, brand, council, status, and OpenClaw are handled as in-world hotspots instead of permanent page-level panels.
4. **Shared avatar motion comes from the Ready Player Me animation library.** Local GLB avatars are retargeted at runtime with `SkeletonUtils.retargetClip` rather than remaining mostly static.
5. **Agent consoles ship as note/task capture first.** Messaging to avatars is stored through `/api/office/messages`; live autonomous execution remains a future phase.

**Dissent / trade-offs**:
- The group accepted a web-native stylized-realism target instead of chasing literal AAA photorealism in-browser.
- Runtime retargeting is good enough for Phase B, but Zara still owns the stronger baked-animation path on `zyra-mini`.

**Hand-off**:
- Axiom -> keep hardening browser/runtime QA.
- Zara -> prep higher-fidelity animation bakes and GLB optimization on the node.
- Compass -> keep roadmap/docs aligned with the office-game architecture.
- Ghost -> final runtime ship decision and push.

---

## 2026-04-23 - Project reality check + Zoro next task

**Members**: Compass (facilitator), Cipher (fact-check), Rune/Axiom, Nyx/Oracle, Talon. Ghost and Zoro observed.

**Topic**: Reconcile the repo's actual state against the roadmap, confirm how Council logging works, and choose Zoro's next highest-leverage task.

**Decisions**:
1. **Phase B Dev Lab is live, but not fully hardened.** The web companion has the local GLB avatar gallery, dynamic 3D office, OpenClaw surfaces, status pages, and task board in place.
2. **The playable mobile game is still scaffold-only.** `src/` currently contains a boot placeholder, PRNG helpers, and engine contracts, while `backend/` is still a schema skeleton. The project is not close to app-store readiness yet.
3. **Council logging exists in two layers.** Runtime Council runs write to `memory/council-log.jsonl` (with `/tmp` fallback in serverless), while `docs/Decision-Log.md` remains the human-readable audit trail. A follow-up task will decide whether those logs should auto-sync.
4. **Stale Phase B implementation cards should close.** The Whiteboard needs to stop presenting already-shipped GLB/avatar/floor work as still in progress and shift toward hardening plus Phase 1 kickoff.
5. **Zoro's next task is to lock the first playable slice creative brief.** That means defining the visual and mood spec for the boot-to-terminal trading loop the actual game will ship first. The live Dev Lab office mood review is still valuable, but it is now a follow-up rather than the top priority.

**Dissent / trade-offs**:
- Compass and the web/UX seats argued for doing the live office mood review first because the Phase B environment is already visible and would benefit from final creative sign-off.
- The Council overruled that sequencing because the actual mobile game is materially behind the Dev Lab, and Zoro's highest-leverage contribution is to unblock the first real player-facing slice.

**Hand-off**:
- Zoro -> lock the Phase 1 playable-slice creative brief.
- Ghost / Rune / Kite -> build the LocalAuthority-backed first trading loop against that brief.
- Compass -> reconcile roadmap, status, and task board truth.
- Talon / Compass -> decide long-term Council log canonicalization.

---

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
