# Components

## `CyberText`

Source: `web/src/components/CyberText.tsx`

- Display text wrapper.
- Supports glitch styling through `data-text` + `.glitch`.
- Used for major page headings.

## `Panel` and `PanelHeader`

Source: `web/src/components/Panel.tsx`

- Shared single-level neon panel.
- Tone variants: default, acid, heat, violet.
- Used for sections, stats, and support content.

## `Workstation`

Source: `web/src/components/Workstation.tsx`

- Clickable card for office map stations.
- Contains icon, title, subtitle, preview, and occupant pills.

## `CharacterCard`

Source: `web/src/components/CharacterCard.tsx`

- Team Wall card.
- Currently uses avatar/initials styling and team metadata.

## `SpendTicker`

Source: `web/src/components/SpendTicker.tsx`

- Persistent header credit meter.
- Polls `/api/spend`.
- Shows total remaining, 24h delta, live provider count.

## `SpendPanel`

Source: `web/src/components/SpendPanel.tsx`

- Full credit dashboard.
- Polls `/api/spend`, groups providers by category, renders sparkline and provider cards.

## 3D Components

- `web/src/components/three/Floor3D.tsx`: client R3F scene shell, camera, lighting, effects, selection.
- `OfficeRoom.tsx`: procedural placeholder room and static props.
- `PerformerStandIn.tsx`: current low-poly capsule operator placeholder.
- `PerformerOverlay.tsx`: selected performer DOM overlay with voice playback.
- `NeonSkyline.tsx`: exterior skyline.

## New Phase B Components

- `web/src/components/game/office-v2/OfficeRuntime.tsx`
  - Full-screen game runtime for character select, office free-roam, HUD, in-world hotspots, and agent consoles.
- `web/src/components/game/office-v2/AnimatedOfficeAvatar.tsx`
  - Shared local-GLB avatar renderer with Ready Player Me motion retargeting and live transform refs.
- `GLBModel`
  - Generic GLB loader used for office shell and prop placement in the runtime.

Supporting runtime systems currently live inside `OfficeRuntime.tsx` and can be split further if the world grows:

- selection stage
- player controller
- NPC actor routes
- hotspot beacons
- hotspot panels
- agent console
- HUD and prompt strip
