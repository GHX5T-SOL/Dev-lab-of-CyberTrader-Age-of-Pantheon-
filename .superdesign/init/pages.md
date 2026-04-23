# Pages

## `/office`

Source: `web/src/app/office/OfficeGameMount.tsx`

Dependencies:

- `web/src/components/game/office-v2/OfficeRuntime.tsx`
- `web/src/data/officeGame.ts`
- `web/src/lib/officeState.ts`
- `TEAM`
- `TASKS`
- `PROTOTYPES`
- `STATUS`

Phase B changes:

- Replace the previous workstation website with the office game runtime.
- Character select must feel like a game lobby, then transition into free-roam office play.
- Whiteboard, wireframes, credits, cinema, brand, council, and OpenClaw are surfaced as in-world interaction nodes.
- Zara and Zyra remain visible in the world and in the HUD status framing.

## `/office-v2`

Source: `web/src/app/office-v2/page.tsx`

Dependencies:

- `web/src/app/office-v2/OfficeV2Mount.tsx`
- `web/src/components/game/office-v2/OfficeRuntime.tsx`

Phase B changes:

- Keep as the explicit runtime alias while `/office` ships the same experience.
- Useful for QA and controlled rollout.

## `/office/avatars`

Source: `web/src/app/office/avatars/page.tsx`

Dependencies:

- `CyberText`
- `Panel`, `PanelHeader`
- `AVATAR_SPECS`
- `PERFORMERS`
- `TEAM`

Phase B changes:

- Remove Ready Player Me creator iframe and RPM setup copy.
- Replace SpriteCook 2D gallery with live 3D GLB avatar gallery.
- Show local GLB paths and role/status tags.

## `/office/floor-3d`

Source: `web/src/app/office/floor-3d/page.tsx`

Dependencies:

- `Floor3DMount`
- `PERFORMERS`
- `TEAM`
- `Panel`, `PanelHeader`

Phase B changes:

- Replace stand-in copy with live GLB count.
- Explain procedural movement and local GLB environment.
- Keep interaction instructions and cast list.

## `/office/tasks`

Source: `web/src/app/office/tasks/page.tsx`

Dependencies:

- `TASKS`
- `TEAM`
- `Panel`
- `CyberText`

Phase B changes:

- Render priority, estimate, dependencies, acceptance criteria, and owner tags.
- Keep grouped by owner and status sorted.

## `/office/team`

Source: `web/src/app/office/team/page.tsx`

Dependencies:

- `FOUNDERS`, `AGENTS`
- `CharacterCard`
- `CyberText`

Phase B changes:

- Add OpenClaw Agents section for Zara and Zyra.
- Correct org chart.

## `/office/spend`

Source: `web/src/app/office/spend/page.tsx`

Dependencies:

- `SpendPanel`
- `PROVIDERS`
- `CyberText`
- `Panel`

Phase B changes:

- Stronger Credit Ops hero.
- Persistent header meter already exists; improve text and provider health framing.
