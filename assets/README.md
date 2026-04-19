# /assets — Game-ready assets

Assets the running mobile app consumes at runtime. Owned jointly by Brand & Asset Agent (production) and Frontend/Mobile (integration).

## Subfolders

- `icons/` — app icons, nav icons, commodity icons (SVG preferred)
- `sprites/` — character sprites (SpriteCook output)
- `ui/` — UI backplates, CRT overlays, scanline textures
- `audio/` — SFX and ambient tracks (MVP: minimal)
- `cinematics/` — exported Remotion / Hyperframes clips (MP4/WebM)

## Rules

- **Every asset ships with a source file** when possible (`.svg` → `.svg`, `.png` from SpriteCook with its job ID as metadata).
- **Brand lock**: palette must match `brand/color/tokens.ts`. Brand & Asset Agent rejects drift.
- **Naming**: `kind-subject-variant.ext` — e.g., `icon-commodity-FDST.svg`, `sprite-faction-blackwake-idle.png`.
- **Size variants**: `@1x`, `@2x`, `@3x` suffix or SVG where lossless scale matters.
- **No decorative duplicates**: if `ui/scanline-soft.svg` exists, don't add `ui/scanline-soft-v2.svg` — iterate the original.

## Phase 0 deliverables

(Owned by Brand & Asset Agent, Phase 0 Day 5.)

- [ ] Eidolon primary mark (brand/logo/)
- [ ] 4 faction sigils (assets/sprites/factions/)
- [ ] 10 commodity icons (assets/icons/commodities/)
- [ ] 1 CRT scanline overlay (assets/ui/)
- [ ] 1 boot-sequence glitch sprite (assets/ui/)
