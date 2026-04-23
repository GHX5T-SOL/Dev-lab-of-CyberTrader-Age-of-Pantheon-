# Dev Lab Rebuild Blueprint — Web-Native AAA-Style 3D Office

## Summary

Rebuild the Dev Lab from scratch as a **desktop-first, web-native, third-person 3D office game** on the existing Next.js/Vercel stack. `/office` becomes the primary game route; existing workstation pages remain as **secondary debug/admin surfaces**. The rebuild uses a new scene/runtime architecture, a coherent high-fidelity office environment, proper player/NPC locomotion, readable in-world interaction surfaces, and a staged delivery path behind `/office-v2` before flipping production.

## Locked Product Decisions

- **Runtime:** stay **web-native** with Next.js + React Three Fiber; do not pivot to Unity/Unreal for this phase.
- **Presence model:** **single-player first**. Architect cleanly for future co-presence, but do not build networking now.
- **Camera/gameplay:** **third-person tactical** with over-shoulder camera, spring-arm follow, contextual interaction zones, and close-up readable surfaces on approach/hover.
- **AI avatar interaction:** phase one is **task/note capture**, not live autonomous agent execution.
- **Shipping aesthetic:** target **high-end stylized realism** with cinematic cyberpunk office tone; do not chase literal GTA V photoreal in-browser.
- **Desktop/mobile:** full free-roam is **desktop-first**. Mobile gets a guided/tap-led spectator mode or simplified navigation, not parity controls.
- **Gate flow:** keep the password gate, then enter a **game-like character selection lobby** before the office.
- **Asset policy:** use local GLBs first, but the shipping office is allowed to use **new royalty-free external assets** where the current pack is insufficient.

## Implementation Changes

### 1. New Runtime and Route Strategy
- Build the new experience under **`/office-v2`** first; keep current `/office` intact until parity and QA are complete.
- Replace the current monolithic scene with a **modular game runtime**:
  - `GameShell` for route boot, loading, settings, and error boundaries
  - `SceneWorld` for environment and lighting
  - `PlayerController` for movement and camera
  - `ActorSystem` for NPC schedules and animation states
  - `InteractionSystem` for proximity, hover, focus, and readable pop-ups
  - `UiLayer` for diegetic overlays, pause/settings, subtitles, and note consoles
- Add a **state store** for player selection, graphics settings, current room, active interaction, and note/message state.

### 2. Environment and Art Direction
- Treat `office_floor_option_2.glb` as a **blockout/layout reference**, not the final shipping environment.
- Assemble a new coherent office from one consistent asset direction: penthouse floor, skyline windows, desks, conference zone, cinema room, OpenClaw server corner, wireframe wall, whiteboard war room, commodity/archive room, and credits ops bay.
- Normalize all imported props and environment pieces in Blender before shipping:
  - scale
  - pivots
  - collision meshes
  - material cleanup
  - emissive calibration
  - LODs where needed
- Use AIDesigner for the **visual concept pass** only: character select composition, room mood, signage language, and diegetic HUD direction.
- Use `imagegen` and SpriteCook only for **supporting surfaces**: monitor content, holo signage, decals, posters, loading art, and stylized overlays.

### 3. Character, Animation, and NPC System
- Create a **canonical humanoid rig pipeline** for all keeper avatars. Do not assume the current GLBs are directly compatible with Ready Player Me clips.
- Use Blender on `zyra-mini` to retarget all shipping avatars to one shared animation contract:
  - idle
  - walk
  - run
  - turn-in-place
  - interact
  - typing
  - seated work
  - talk/listen
- Preferred animation source order:
  1. existing embedded clips if usable
  2. Ready Player Me animation library where the rig matches cleanly
  3. Mixamo or other royalty-safe locomotion/gesture clips retargeted into the canonical rig
- Player character must use **true skeletal locomotion blending**, not procedural bobbing.
- NPCs must all be present in the office:
  - founders + Zara + Zyra + 12 AI residents
  - each gets a home station, 1–3 alternate anchors, schedule weights, and signature behavior
- Use an **authored waypoint graph**, not generic navmesh/pathfinding, for phase one reliability.
- NPC logic is state-machine driven: `working`, `walking`, `meeting`, `idle-look`, `server-watch`, `whiteboard-review`, `cinema-watch`.

### 4. Interaction Model and Readable Surfaces
- Remove the current “big HTML planes everywhere” approach.
- Each workstation becomes a **physical in-world object** with three states:
  - **far:** subtle diegetic beacon/signage only
  - **near:** readable world-space preview on the actual object
  - **focus:** anchored visor/modal pop-up for clear reading or action
- Whiteboard, wireframe wall, spend monitor, brand vault, cinema screen, commodity archive, and server console all use this same interaction contract.
- Whiteboard behavior:
  - walk near to see a legible board preview
  - hover/click to expand into a readable tactical panel
  - filter at minimum for Ghost, Zoro, priority, status, and dependency
- AI avatar behavior:
  - walk near an avatar to show identity and current assignment
  - focus opens a diegetic console with bio, current task, recent notes, and a message composer
- Message flow for phase one:
  - `POST /api/office/messages` saves a note/task addressed to an avatar
  - messages render back in avatar consoles and optional whiteboard queues
  - no live agent execution in this phase

### 5. Data and Interface Changes
- Introduce explicit world data contracts:
  - `RoomZone`
  - `InteractionNode`
  - `ReadableSurface`
  - `ActorRoute`
  - `ActorSchedule`
  - `ActorAnimationProfile`
  - `PlayerPreferences`
  - `OfficeMessage`
- Add an office aggregation endpoint:
  - `GET /api/office/state` for tasks, wireframes, spend summary, actor availability, brand assets, reel metadata, and room labels
- Keep `/api/spend` as the finance feed, but consume it through the new office state layer for in-world displays.
- Persist:
  - character selection + graphics settings via `POST /api/office/preferences`
  - avatar notes/messages via `POST /api/office/messages`
- Use Supabase for message/preferences persistence if environment is available; otherwise a clearly marked dev-only local fallback.

### 6. Delivery Phases and Dependencies
1. **Concept and blockout**
   - AIDesigner concept pass
   - room adjacency map
   - gameplay camera/interaction spec
2. **Core runtime**
   - `/office-v2`
   - controller
   - camera
   - interaction framework
   - loading/error boundaries
3. **Environment pass**
   - final office shell
   - collisions
   - room anchors
   - lighting
   - skyline
4. **Avatar/animation pass**
   - canonical rig
   - retargeted clips
   - player blend tree
   - NPC schedules
5. **Workstation systems**
   - whiteboard
   - wireframes
   - credits ops
   - commodity room
   - cinema room
   - brand vault
   - server room
6. **Polish and swap**
   - VFX
   - audio
   - performance tuning
   - feature-flag flip from `/office-v2` to `/office`

Parallel work after core runtime is ready:
- **Environment assembly**
- **Avatar retarget/animation pipeline**
- **Readable surface conversion for workstation content**

## Test Plan

- **Visual acceptance**
  - character selection reads like a game lobby, not a web form
  - office has coherent room composition, physical props, skyline, and working NPC density
  - no overlapping UI planes in normal gameplay
- **Interaction acceptance**
  - gate → selection → office load works cleanly
  - WASD/arrow movement is responsive
  - player animation matches idle/walk/run/turn states
  - walking near whiteboard/wireframes/spend surfaces makes them readable
  - hover/focus opens clear anchored pop-ups
  - approaching an AI avatar opens a stable console and accepts notes
- **Performance**
  - desktop target: stable high-fidelity experience with all actors present
  - asset budgets enforced with source/license manifest and LOD rules
  - mobile falls back to guided mode rather than failing silently
- **Technical QA**
  - `npm run build`
  - `npm run typecheck`
  - browser smoke tests for gate, selection, office load, movement, focus, message save, spend feed
  - final Vercel preview check before route swap

## Assumptions and Defaults

- Current `/office` code is **not reused as the final architecture**; it is replaced after `/office-v2` passes QA.
- Legacy `/office/*` pages remain as support/debug routes unless explicitly removed later.
- The current avatar GLBs are kept only if they survive the canonical rig/animation pipeline; otherwise replacement avatars are allowed.
- External royalty-free assets may be added for office fidelity, but all must be normalized and tracked in an asset/license manifest.
- Voice chat, real multiplayer, and live agent execution are out of scope for this rebuild phase.
- The finish line for this phase is a **believable, readable, desktop-first 3D office game shell**, not the entire metaverse roadmap.
