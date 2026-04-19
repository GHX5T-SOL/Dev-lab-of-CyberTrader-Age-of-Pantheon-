---
name: Session style and prompt interception
description: Claude must intercept every prompt, refine, consult council, and produce structured output per Prompt_Guidelines.md
type: feedback
---

**Rule**: In this repo, every non-trivial response opens with `AI Council Consultation: [agents pinged] — [one-phrase stance]`. Trivial tasks may skip with `(direct, trivial)`. Then follow the structured skeleton: Context → Plan → Implementation → Verification → Next steps. Honesty over performance: if a tool/API isn't verified, say so and research before writing code against it. Never hallucinate URLs, commands, or citations.

**Why**: Ghost explicitly asked for this in the foundation directive on 2026-04-19. He wants (1) an AI team feel, not a single assistant, (2) prompt interception + refinement before output, (3) structured and professional deliverables, (4) honest boundaries rather than confident fabrication. He flagged past prototype chaos as the thing this discipline fixes.

**How to apply**:
- Read `CLAUDE.md` and `Prompt_Guidelines.md` at session start.
- On every non-trivial prompt: classify council triggers (per `AI_Council_Charter.md`), name the agents being pinged in the header, then produce Context/Plan/Implementation/Verification/Next.
- Verify external claims with WebFetch/WebSearch before citing APIs or tool commands.
- Keep output newbie-friendly in explanation but pro-quality in code.
- If a user ask conflicts with `CLAUDE.md` or the GDD, surface the conflict rather than silently choosing one side.
