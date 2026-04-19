---
name: Tool verification policy
description: Verify every referenced tool, URL, package, or API with WebFetch/WebSearch/source-read before writing code or install commands that depend on it
type: feedback
---

**Rule**: Before writing any code, install command, or documentation that references an external tool / package / URL / API, verify it exists and works as described. Use WebFetch, WebSearch, or read the source. Never rely on training-data memory alone for API shapes, install commands, or URL paths.

**Why**: On 2026-04-19 Ghost listed several tools (OpenClaw, CatchMe, OPC-skills, HeyGen Hyperframes) and asked the orchestrator to "install" them. Verifying surfaced that all four are real but with specific quirks (CatchMe needs conda, OpenClaw has curl-pipe install, Hyperframes skill path is unconfirmed). Faking a generic `npx install ...` would have silently broken the setup script. This is the pattern Ghost wants us to follow as a team discipline — honest boundaries over confident fabrication.

**How to apply**:
- Before referencing an install command in a script or doc, WebFetch the canonical source.
- Before writing code against a library's API, either read its current docs or cite a verified version.
- When the user's request mentions a tool, URL, or product name, assume it may be aspirational rather than confirmed; verify before building against it.
- When unverifiable, mark the reference with a visible "VERIFY BEFORE RUNNING" or similar caveat in the doc, rather than hiding it.
