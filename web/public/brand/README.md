# /public/brand

Static brand assets served by the Dev Lab website.

## Expected structure

```
public/brand/
├── avatars/
│   ├── ghost.png         (Ghost portrait — skull mask, hoodie, slung rifle)
│   ├── zoro.png          (Zoro portrait — neo-hacker swordsman, katana, green wrap)
│   ├── nyx.png           (Game Designer)
│   ├── vex.png           (UI/UX Cyberpunk)
│   ├── rune.png          (Frontend Mobile)
│   ├── kite.png          (Backend & Web3)
│   ├── oracle.png        (Economy & Trading Sim)
│   ├── reel.png          (Cinematic & Animation)
│   ├── palette.png       (Brand & Asset)
│   ├── cipher.png        (Research & Best Practices)
│   ├── axiom.png         (QA & Testing)
│   ├── compass.png       (Project Manager)
│   ├── talon.png         (OpenClaw Living)
│   └── hydra.png         (ElizaOS Swarm)
├── commodities/
│   ├── fractal_dust.png
│   ├── plutonion_gas.png
│   ├── neon_glass.png
│   ├── helix_mud.png
│   ├── void_bloom.png
│   ├── oracle_resin.png
│   ├── velvet_tabs.png
│   ├── neon_dust.png
│   ├── phantom_crates.png
│   └── ghost_chips.png
└── logo/
    ├── primary.png       (wordmark + mark)
    └── mark.png          (icon-only)
```

## Specs

- **Transparent background** (alpha PNG).
- **512×512 minimum** for commodity icons; 1024×1024 preferred.
- **Avatars**: portrait crop, 768×1024, subject centered, room at top for name overlay.
- **Palette compliance**: use brand palette only. No generic purple gradients.
- **Ticker reference**: Pirate OS v0.1.3 artboard Ghost shared — match that look.

## Generation task (Zoro)

Use SpriteCook MCP. See `/agents/brand-asset.md` for the full prompt template.
Each asset must pass Palette's QA before merging.

## Phase A state

All files are expected but not yet generated. The site renders initials-block
placeholders when images are missing — no broken-image icons.
