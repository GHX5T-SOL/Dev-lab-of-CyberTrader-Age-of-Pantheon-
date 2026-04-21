# Phase B — Live 3D Dev Lab

Status: **LIVE as of 2026-04-21**.

Phase B turns the Dev Lab web app into a living command center for CyberTrader: Age of Pantheon. The game remains the Expo/React Native build; the Dev Lab is the internal studio floor where Ghost, Zoro, the AI Council, Zara, and Zyra coordinate work.

## What Is Live

- **Avatar Lab** now renders local GLB rigs from `web/public/GLB_Assets/` instead of a remote creator iframe.
- **Floor 3D** loads `office_floor_option_2.glb` as the base environment, adds local furniture/prop GLBs, and places 16 moving operators around the office.
- **Ghost** is corrected globally as **Lead Developer** and final technical sign-off.
- **Zoro** is corrected globally as **Creative Lead** and final visual/brand sign-off.
- **Zara** and **Zyra** are surfaced as OpenClaw Living Agents on `ssh zyra-mini`.
- **Whiteboard** is now a Phase B operating board with 60+ tasks, owners, priorities, estimates, dependencies, acceptance criteria, and tags.
- **Credit Ops** has a persistent header meter and a more explicit provider dashboard.

## Asset Decision

`office_floor_option_2.glb` is the default office shell. The inspection pass found it far lighter than option 1 while still giving enough structure for a cyberpunk penthouse floor. Option 1 stays in the manifest as a future cinematic or offline-render candidate.

The heavy furniture GLBs are usable in the web scene but need a compression/LOD pass before they become mobile-grade assets. Zara owns that queue.

## OpenClaw Physical Layer

Command:

```bash
ssh zyra-mini
```

Verified on 2026-04-21:

- Host resolved as `Bruces-Mac-mini.local`.
- Remote user shell responded.
- `~/.openclaw` state exists.
- `tailscale` and `openclaw` CLIs were not on PATH during the check.

Zara owns asset ops: GLB compression, LOD generation, Blender retargeting, large-file cleanup, and render queue prep.

Zyra owns node watch: heartbeat cron, GLB_Assets file watcher, preview-sync readiness, Tailscale/SSH health, and long-running render queue monitoring.

## Phase B Definition Of Done

- `npm run typecheck` passes in `web/`.
- `npm run build` passes in `web/`.
- `/office`, `/office/avatars`, `/office/floor-3d`, `/office/team`, `/office/tasks`, `/office/status`, and `/office/spend` render without blocking errors.
- No Dev Lab UI references a broken remote avatar creator iframe.
- Ghost and Zoro roles are correct in data, docs, and visible pages.
- Zara and Zyra appear in Team Wall, header/status surfaces, Avatar Lab, Floor 3D, docs, and the Whiteboard.
- Heavy GLB budget risks are logged for Zara/Axiom follow-up.

## Research Notes

- Ready Player Me `animation-library` remains useful as a retargeted mocap source for future idle/walk/gesture clips.
- drei `useAnimations` and Three.js `AnimationMixer` are the current runtime pattern for playing embedded GLB clips.
- Procedural `useFrame` motion is the Phase B fallback for local GLBs that do not contain animation clips.
- AI4AnimationPy is a future research path for offline animation experiments, not a browser runtime dependency.
