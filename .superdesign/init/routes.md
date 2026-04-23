# Routes

## Public

- `/gate`: password gate with vault door, keypad, and Ghost + Zoro greeting.

## Office Shell

All `/office/*` routes use `web/src/app/office/layout.tsx`.

- `/office` is now the primary runtime route. It mounts the full-screen office game shell instead of the old workstation dashboard.
- Most other `/office/*` routes still render in the legacy shell as supporting admin/debug views.

## Primary Runtime

- `/office`: password-gated character selection plus in-world office runtime. Ghost or Zoro enters the lab, moves through the office, and opens surfaces/agent consoles contextually.
- `/office-v2`: alias route for the new runtime while the architecture settles. It should stay behaviorally aligned with `/office`.

## Supporting Workstations

- `/office/floor-3d`: immersive React Three Fiber office scene.
- `/office/avatars`: avatar lab. Phase B target: remove RPM creator and replace 2D gallery with live GLB cards.
- `/office/tasks`: Whiteboard task board from `web/src/data/tasks.ts`.
- `/office/team`: Team Wall from `web/src/data/team.ts`.
- `/office/spend`: Credit Ops dashboard backed by `/api/spend`.
- `/office/status`: status terminal backed by `web/src/data/status.ts`.
- `/office/roadmap`: roadmap view backed by `web/src/data/roadmap.ts`.
- `/office/council`: Council Hall manual council runner.
- `/office/automations`: cron rack backed by `web/src/data/automations.ts`.
- `/office/brand`, `/office/wireframes`, `/office/reel`, `/office/broadcast`, `/office/bible`, `/office/notes`: supporting workstations.

## API

- `/api/auth/verify`, `/api/auth/logout`
- `/api/spend`
- `/api/office/state`
- `/api/office/messages`
- `/api/office/preferences`
- `/api/voice/speak`
- `/api/council/run`, `/api/council/log`
- `/api/cron/*`
