---
name: Locked tech stack (Phase 1)
description: Expo + React Native + TypeScript + Zustand + MMKV + Reanimated + Supabase + Solana Mobile Wallet Adapter — changes require council
type: project
---

**Locked for Phase 1** (decision logged 2026-04-19 in `docs/Decision-Log.md`):

- Mobile: Expo (latest stable) + React Native + TypeScript
- Navigation: Expo Router (NOT react-navigation)
- State: Zustand (NOT Redux/MobX/Recoil)
- Persistence: react-native-mmkv
- Animation: react-native-reanimated
- Graphics: react-native-svg (no native-linking charts in Phase 1)
- Web3: Solana Mobile Wallet Adapter (feature-flagged, dev-identity fallback required)
- Backend: Supabase (Postgres + Edge Functions + RLS)
- Cinematics: Remotion + HeyGen Hyperframes
- Asset gen: SpriteCook MCP
- Multi-agent sim: ElizaOS
- Context memory: CatchMe
- Repo executor: OpenClaw
- Skill packs: OPC-skills, Remotion skills

**Why**: v5 prototype used Expo + RN + Supabase; keeps continuity. Game is primarily stylized 2D terminal UI with optional future 3D — Unity overkill. Zustand+MMKV is pragmatic for small-state, high-frequency updates. Deterministic engine design mandates no non-deterministic libs.

**How to apply**: Any proposal adding a dep outside this list triggers a council session (Backend + Frontend + PM + Research minimum). Record the outcome in `docs/Decision-Log.md`. Forbidden in Phase 1: Redux, MobX, Recoil, react-navigation, native-linking chart libs, Moment.js, Next.js patterns (this is a mobile app, not a web app).
