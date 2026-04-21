# Studio Toolkit

The media + AI tools Ghost and Zoro have keys / licenses for. **Reach for these first before suggesting third-party replacements.**

All keys live in the root `.env` (symlinked into `web/.env.local`). The Dev Lab's Spend dashboard (`/office/spend`) probes live-billing APIs; this doc is the **capability registry** — what each tool is for and when to use it.

## Voice & audio

| Tool | Env key | Use for |
|---|---|---|
| **ElevenLabs** | `ELEVENLABS_API_KEY` | Character voices, narrator lines, in-game VO, Reel's explainer voiceovers, Oracle's market-bulletin delivery. Match voice to each AI agent's persona in `web/src/data/team.ts`. |

**Rule:** any spoken line in the Dev Lab or game defaults to ElevenLabs. Don't suggest `say` / macOS TTS / third-party VO tools unless ElevenLabs is down.

## Avatars & characters

| Tool | Env key | Use for |
|---|---|---|
| **HeyGen + Hyperframes** | `HEYGEN_API_KEY` | Photoreal talking-head avatars for explainer videos, Council broadcast clips, on-site hero intros. Ghost has **Hyperframes** skills installed — use the frame-accurate pipeline for lip sync + sustained eye contact. |
| **SpriteCook MCP** | `SPRITECOOK_API_KEY` | 2D character portraits, item icons, tilesets, UI elements, short 2D animations. Phase A avatar source. Prompts for all 16 operators live in `web/src/data/avatars.ts`. Pixel mode for in-game; HD mode for office portraits. |
| **Local GLB Assets + R3F** | _none_ | Phase B 3D office rigs and props. Files live in `web/public/GLB_Assets/`, are cataloged in `web/src/data/glbAssets.ts`, and are bound through `web/src/data/performers.ts`. |
| **Ready Player Me animation-library** | _none_ | Research reference for future retargeted mocap clips. Do not use a remote creator iframe in the Dev Lab. |

**Rule of thumb:**
- Talking head / on-camera → **HeyGen**
- 2D portrait, icon, sprite → **SpriteCook**
- 3D walkable office character → **Local GLB Assets** + R3F (Phase B)
- Retargeted motion research → **Ready Player Me animation-library** + Blender/Zara queue

## Video & cinematics

| Tool | Env key | Use for |
|---|---|---|
| **Remotion** | `REMOTION_LICENSE_KEY` | Programmatic video rendering — explainer tray on Zoro's desk, weekly recap reels, cutscenes with deterministic data. Compositions in `web/remotion/` (Phase B). Repo root has Remotion skills installed. |

## Design & branding

| Tool | Integration | Use for |
|---|---|---|
| **Canva** | Studio tool (manual) | Fast social / promo assets, pitch deck frames, static marketing cards, one-off thumbnails. |
| **Claude Design** | Studio tool (Claude skill) | Design critique, layout generation, design-system reviews. Pair with brand guidelines. |

**Source of truth for brand** is `web/public/brand/` + `web/src/data/brand.ts` — Canva exports must conform to the locked palette (ink / cyan / acid / heat / violet).

## Reasoning & agents

| Tool | Env key | Use for |
|---|---|---|
| **Anthropic / Claude** | `ANTHROPIC_API_KEY` | Council deliberation, persona voice, long-form reasoning. Council routes use `claude-haiku-4-5` for latency-bound; swap to Sonnet/Opus for deep planning. |
| **OpenAI** | `OPENAI_API_KEY` | Fallback LLM, DALL-E images, embeddings for memory. |
| **OpenRouter** | `OPENROUTER_API_KEY` | Multi-provider routing for cost / model-choice optimization. |
| **Vercel AI Gateway** | `VERCEL_AI_GATEWAY_API_KEY` | Unified AI access with fallbacks + observability. Phase C Council migrates here for graceful provider degradation. |
| **Hugging Face** | `HF_TOKEN` | Open-weight models, datasets, specialized pipelines. |
| **Conway** | `CONWAY_API_KEY` | Sandboxed code execution, domain management, wallet ops — the agent's runtime utility belt. |

## Infrastructure

| Tool | Env key | Use for |
|---|---|---|
| **Supabase** | `SUPABASE_URL` + service role | Postgres + RLS + Edge Functions for the actual game (leaderboards, wallets, rank ledger, trade receipts). |
| **GitHub** | `GITHUB_TOKEN` | Source of truth. Push to `main` triggers Vercel auto-redeploy. |
| **Vercel** | Platform | Hosting. **Hobby plan** — crons capped at daily. Sub-daily automations run locally (see `/web/src/app/office/automations`). |

## Non-negotiables

- **Never substitute a tool above with a generic alternative** just because training data suggests one.
- **All keys stay in `.env`** — never commit, never paste into chat transcripts, never echo in logs.
- **Budget awareness:** every provider shown above is probed live on `/office/spend`. If a new agent wants to use a paid tool, check the balance first.
