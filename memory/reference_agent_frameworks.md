---
name: AI team frameworks used by Dev Lab
description: Quick pointers to the external agent frameworks wired into the AI team — ElizaOS, OpenClaw, CatchMe, OPC-skills, Remotion skills, SpriteCook MCP
type: reference
---

**Frameworks + where to find them** (all verified real as of 2026-04-19):

- **ElizaOS** — https://elizaos.ai / https://github.com/elizaos/eliza — multi-agent Web3 / trading sim framework. Used by ElizaOS Swarm Coordinator (`agents/elizaos-swarm.md`) for market participant simulation. Install: `npm i -g @elizaos/cli`.
- **OpenClaw** — https://openclaw.ai — open-source personal AI assistant with chat-app bridges (WhatsApp, Telegram, Discord, Slack). Used by OpenClaw Living Agent (`agents/openclaw-living.md`) as a repo-embedded executor. Install: `curl -fsSL https://openclaw.ai/install.sh | bash` or `npm i -g openclaw`.
- **CatchMe** — https://github.com/HKUDS/CatchMe — personal activity capture + tree-based memory for agents. Install script at `scripts/install-catchme.sh` (conda-based). Purpose: long-horizon context memory across sessions.
- **OPC-skills** — https://github.com/ReScienceLab/opc-skills — solopreneur automation skill pack for Claude Code and other AI coding tools. Install: `npx skills add ReScienceLab/opc-skills`.
- **Remotion skills** — https://github.com/remotion-dev/skills — Claude Code skills for programmatic video generation. Install: `npx skills add remotion-dev/skills`. Used by Cinematic & Animation Agent.
- **HeyGen Hyperframes** — https://hyperframes.heygen.com — HTML → video for animated UI prototypes. Skill path `heygen-com/hyperframes` is plausible but NOT 100% verified; if install fails, fall back to the web product.
- **SpriteCook MCP** — already wired into this workspace as `mcp__spritecook__*` tools. No separate install needed. Used by Brand & Asset Agent.

**How to apply**: When asked to "install the AI team frameworks," run `bash setup.sh` (it prompts per-tool) or individual npm scripts in root `package.json`. When referencing APIs, verify against each product's docs; training-data API shapes are unreliable.
