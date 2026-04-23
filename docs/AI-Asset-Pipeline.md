# AI Asset Pipeline

> Practical notes from the current upgrade pass using ImageGen, SpriteCook,
> Figma, and Hugging Face.

## What changed in this pass

- Added mobile commodity art under `src/assets/commodities/`
- Wired commodity thumbnails into the playable market UI
- Added repo-specific Figma handoff rules in `docs/Figma-Design-System-Rules.md`

## Image generation used

Used built-in image generation to create missing Phase 1 commodity art for:
- `SNPS` Synapse Silk
- `MTRX` Matrix Salt
- `AETH` Aether Tabs
- `BLCK` Blacklight Serum

The generated source files remain under:
- `C:\Users\akmha\.codex\generated_images\019db97e-f708-7e53-9557-b83070b9a248`

Selected outputs were copied into the project at:
- `src/assets/commodities/synapse_silk.png`
- `src/assets/commodities/matrix_salt.png`
- `src/assets/commodities/aether_tabs.png`
- `src/assets/commodities/blacklight_serum.png`

## SpriteCook status

Tried to use SpriteCook for new commodity generation, but the account currently
has no credits available.

Result:
- existing SpriteCook references remain useful for style consistency
- generation is blocked until credits are topped up

When SpriteCook credits are available again, use it for:
- final commodity production passes
- consistent avatar and world prop generation
- replacement of provisional AI-generated art where needed

## Hugging Face research notes

Useful current repos found for background-removal / cleanup workflows:

- `ZhengPeng7/BiRefNet`
- `ZhengPeng7/BiRefNet_HR`
- `briaai/RMBG-1.4`
- `briaai/RMBG-2.0`

Why these matter:
- they are strong candidates for cleaning transparent commodity cutouts
- they can help normalize future generated assets before final import

Useful style reference found for game-art experimentation:
- `artificialguybr/ps1redmond-ps1-game-graphics-lora-for-sdxl`

That model is not a direct fit for the current premium mobile commodity pass,
but it is worth remembering for retro side projects or alternate mockups.

## Recommended workflow

1. Generate a first-pass commodity or prop image.
2. Clean the cutout if needed using a background-removal model/workflow.
3. Import the selected final into `src/assets/` or `web/public/brand/`.
4. Update the consuming UI immediately so the asset is exercised in runtime.
5. Replace provisional art later with SpriteCook finals when credits are available.
