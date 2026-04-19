# /brand — Brand system

Start with [brand-guidelines.md](brand-guidelines.md).

## Subfolders

- `logo/` — logo variants (SVG + PNG + adaptive android)
- `color/` — palette exports for design tools and code
- `typography/` — web fonts + specimen pages
- `icons/` — custom icon set (SVG)
- `sprites/` — character + commodity sprite sheets (SpriteCook output)
- `ui/` — reference renders of UI components

## Owners

**Brand & Asset Agent** ([`agents/brand-asset.md`](../agents/brand-asset.md)) owns production. **UI/UX & Cyberpunk Agent** owns application. Changes go through an AI Council brand subsession.

## Generation pipeline

Most raster assets are generated via the **SpriteCook MCP**:

1. Open a Claude Code session in this repo.
2. "Brand & Asset, generate [description]."
3. Agent calls `mcp__spritecook__generate_game_art` with brand-locked parameters.
4. Output is imported to `brand/sprites/` or `assets/`.
5. Council review before landing in player-facing screens.
