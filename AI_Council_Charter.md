# AI Council Charter

> Governance for how the AI team makes non-trivial decisions on CyberTrader: Age of Pantheon.

## Purpose

The **AI Council** is the deliberative body for decisions that shape the game's direction, architecture, or economy. It prevents single-agent tunnel vision, surfaces trade-offs early, and produces a durable decision log Ghost and Zoro can audit.

Ghost is the human **Lead Developer**. Zoro is the human **Creative Lead**. Zyra and Zara are named OpenClaw workers that may convene or join Council sessions when autonomous work touches PM, QA, cron, branch, build, or PR risk.

## Composition

- **5–7 members per session**, assembled from the agent roster in [agents.md](agents.md).
- Composition rotates based on topic. Examples:
  - *Economy change*: Game Designer, Economy & Trading Sim, Backend, QA, PM → (5)
  - *New cinematic*: Cinematic, UI/UX, Brand, Frontend, PM → (5)
  - *Technical architecture*: Backend, Frontend, Research, QA, PM, ElizaOS Swarm, Zyra or Zara → (7)
  - *Autonomous OpenClaw work*: PM, Research, QA, Zyra, Zara, owning domain agent → (6)
- **Standing members** (present in every council): **Project Manager** (facilitator) + **Research & Best-Practices** (fact-checker).
- **Ghost and Zoro** are non-voting observers with override authority. Ghost has final lead-dev say on implementation scope; Zoro has final creative say on brand, visual direction, and presentation.

## When to convene

| Situation | Council? |
|---|---|
| Adding or removing a core mechanic | **Yes** |
| Changing tech stack (lib, framework, DB) | **Yes** |
| Economy tuning that affects player progression > 10% | **Yes** |
| Adding a new screen to main navigation | **Yes** |
| OpenClaw worker taking an autonomous task that can affect architecture, brand, auth, wallet, economy, deployment, or public docs | **Yes** |
| Renaming / rebranding | **Yes** |
| Fixing a typo, small bug, tweaking a color shade | No |
| Adding a utility function | No |
| Running a test | No |

Rule of thumb: **if Ghost or Zoro would care about the decision in a month, convene the council.**

## Format (conversational, single-session)

When convened inside a Claude session, the council runs as a **structured debate** in one response:

```
AI Council Session — [topic]
Members: [list]
Facilitator: Project Manager

┌─ Opening statements (1–2 lines each) ─┐
[Agent A]: position + reasoning
[Agent B]: position + reasoning
...

┌─ Cross-examination ─┐
[the 1–3 sharpest disagreements, steelmanned]

┌─ Research check ─┐
Research & Best-Practices: [any facts to verify, cites]

┌─ Vote ─┐
A: [option], B: [option], …  →  outcome
Dissent noted: [agent + reason, if any]

┌─ Decision ─┐
[one-paragraph ruling + concrete next actions]

┌─ Log ─┐
→ appended to docs/Decision-Log.md
```

## Voting

- **Preferred: consensus** (all members agree or abstain).
- **Fallback: simple majority** (≥4 of 7, ≥3 of 5).
- **Tie-breaker: PM + Research** jointly decide. If still split, **escalate to Ghost**.
- **Dissent is logged**, never suppressed.

## Escalation to Ghost / Zoro

Escalate when:
- Decision touches **scope, brand, budget, legal, or ship date**.
- Council is split 50/50 after a full round.
- Any agent flags a **non-reversible** action (destructive DB op, force-push, public launch, token mint).
- Any agent flags a **legal / regulatory** concern (tokens, gambling lookalikes, user data).

Escalation format:
```
[ESCALATION] topic: … | options: A / B / C | council lean: … | recommendation: …
```
Short, in-line, never buried.

## Decision log

Every council session appends to `docs/Decision-Log.md` with:
- Date + chapter name
- Topic
- Members present
- Outcome
- Dissent
- Affected files / systems

This is the **audit trail**. Future agents read it before proposing changes.

## Anti-patterns the Council must avoid

- **Rubber-stamping**: if every agent agrees instantly on a non-trivial topic, re-cast someone as devil's advocate and re-run.
- **Scope creep**: one decision per session. Stack follow-ups into future sessions.
- **Hallucinated citations**: Research member must verify any cited fact with WebFetch or reading the source.
- **Polling without reasoning**: every vote needs a one-line rationale.
- **Silent dissent**: disagreement must be logged even if the dissenter loses.

## Amendments

This charter is updated via a council session on itself. Edits land in git with a commit message starting `charter:`.
