# Brand Guidelines — CyberTrader: Age of Pantheon

> The single source of truth for how this game looks, sounds, and feels. Every screen, asset, video, and store listing must respect these rules.

## Brand essence

**A ghost in the machine, trading across the neon void.**

CyberTrader is not a crypto app. It is not a finance dashboard. It is a **working cyberdeck** — a hacker's terminal that happens to be a game. Premium mobile craftsmanship meets illicit underground trading culture.

## Pillars

| Pillar | Meaning | Ship test |
|---|---|---|
| **Ghost in the machine** | the player is a fragment of a dead AI, not a human trader | Does the UI feel like *the AI's* perspective, not a human's? |
| **Hacker terminal** | CRT scanlines, glitch type, monospace, amber warnings | Can a stranger tell it's a hacker thing in 1 second? |
| **Premium mobile** | 60fps, tactile gestures, no placeholder, no lorem | Would you show this at an Apple keynote? |
| **Working not decorative** | every element has a diegetic function | Can a player explain what that glowing panel *does* in the lore? |

## Aesthetic pillars (recap from v5 BUILD_PLAN)

- "Ghost in the machine" + anime hacker terminal + premium mobile game + high-tech trading floor.
- Interface must feel like a working cyberdeck, not a website.

## Color system

Primary palette (locked). Hex values and usage:

| Token | Hex | Where |
|---|---|---|
| `bg.void` | `#050608` | primary background |
| `bg.terminal` | `#0A0F0D` | secondary, panel backgrounds |
| `bg.deep-green-black` | `#07130E` | inset surfaces, trading terminal body |
| `fg.primary` | `#E8F0EE` | default text, off-white |
| `fg.muted` | `#7B8B8A` | secondary text, muted blue-gray |
| `accent.cyan` | `#00F5FF` | primary action, CTAs, active cursors |
| `accent.acid-green` | `#67FFB5` | profit, energy, confirmations |
| `danger.heat` | `#FF2A4D` | heat meter, losses, destructive |
| `warn.amber` | `#FFB341` | warnings, news alerts, caution |
| `lore.violet` | `#7A5BFF` | Pantheon/memory/lore — **rare use only** |

### Usage rules
- **Never use generic cyberpunk purple gradients.** Violet is reserved for lore beats only (memory shards, Pantheon whispers).
- **Cyan is the player's voice.** Every primary action, cursor, and active state.
- **Acid green = "everything is working."** Profit, energy, success.
- **Red heat = "consequences are coming."** Never use red for chrome or decoration.
- **Amber = "information that needs reading."** News tickers, integrity warnings.
- Black is **not** pure `#000` — use `#050608` so CRT grain reads.

## Typography

| Role | Family | Weight | Tracking |
|---|---|---|---|
| Terminal body | `JetBrains Mono` or `IBM Plex Mono` | 400/500 | 0 |
| UI headings | `Space Grotesk` | 600/700 | -1% |
| Glitch / lore | `Major Mono Display` or `VT323` | 400 | +2% |
| Numeric tickers | `IBM Plex Mono` tabular | 500 | 0 |

- **Mobile minimum: 14pt.** No smaller. Terminal feel does not excuse unreadable type.
- **Line height: 1.4+** in all paragraph contexts.
- **Glitch type is a special effect, not body text.** Use it for 1–3 word accents only.

## Motion & effects

- Layered scanlines (static + slow scroll).
- CRT grain (subtle, ~4% opacity noise).
- Animated telemetry (breathing CPU/memory/Heat bars at idle).
- Glitch typography on state changes (rank up, OS upgrade, Heat spike).
- Holographic panels on PantheonOS-tier UI.
- Buttons press **in**, not up. Haptic on every confirm.
- 60fps floor. 120fps where device allows.

**Forbidden**: parallax marketing carousels, cartoon bounces, "fun" confetti, generic slot-machine reels, Material 3 defaults.

## Logos

Logo variants live in [`brand/logo/`](logo/). Required:

- `logo-primary.svg` — full wordmark with hollow-cyan outline
- `logo-mark.svg` — just the Eidolon sigil (triangle + glitch line)
- `logo-mono.svg` — single-color flat for small sizes
- `logo-app-icon.png` — 1024×1024 for app stores
- `logo-adaptive-android/` — foreground + background layers

Status: placeholders to be produced by the Brand & Asset Agent via SpriteCook. See [`brand/logo/README.md`](logo/README.md).

## Iconography

- Line-weight icons only (1.5px on 24pt grid).
- Sharp terminals, no pill-rounded corners.
- Two weights: `thin` (1px) for ambient chrome, `bold` (2px) for interactive.

Source library: custom set in [`brand/icons/`](icons/). Do not ship Lucide / Material defaults on player-facing screens.

## Voice & tone

- **Terse. Monospace. Diegetic.** Menus read like console output.
- No marketing exclamation. No "Sweet!", "Oops!", "Uh-oh!".
- Errors speak in system voice: `[e_AGENT] signal detected. heat +4.`
- Tutorial speaks as Ag3nt_0S//pIRAT3 OS itself, not a narrator.
- Loading states are *always* diegetic: `unpacking shard…`, `rerouting via tor exit 7…`.

## Don'ts

- ❌ generic purple gradients
- ❌ flat admin dashboards
- ❌ tiny text
- ❌ placeholder icons or lorem ipsum
- ❌ references to Ghost in the Shell, Watch Dogs, Cyberpunk 2077, Deus Ex, or other protected IP
- ❌ "crypto bro" aesthetics (laser eyes, mooning rockets, pepe variants)
- ❌ emoji in UI chrome

## Asset folders

```
brand/
├── brand-guidelines.md   ← this file
├── logo/                 ← logo SVGs + PNGs
├── color/                ← palette exports (SCSS, TS tokens, Figma)
├── typography/           ← font files + specimen
├── icons/                ← custom icon set
├── sprites/              ← character + commodity sprites (SpriteCook output)
└── ui/                   ← UI components as reference images
```

## Updating

Brand changes require an AI Council session (Brand & Asset + UI/UX + Ghost). Log in `docs/Decision-Log.md` with prefix `brand:`.
