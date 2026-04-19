#!/usr/bin/env node
/**
 * ai-council-run.js — helper that prints a council-session template.
 *
 * The actual debate runs inside a Claude Code session. This script gives
 * humans a copy-pasteable prompt to kick one off with a clean structure.
 */

const topic = process.argv.slice(2).join(' ') || '<put your topic here>';

console.log(`
Copy the block below into a Claude Code session in this repo:

─────────────────────────────────────────────────────────────────────────
Convene the AI Council on: ${topic}

Per AI_Council_Charter.md:
- Facilitator: Project Manager
- Standing: Research & Best-Practices
- Select 3–5 additional members relevant to the topic.

Produce the structured debate format from the charter:
  1. Opening statements
  2. Cross-examination
  3. Research check
  4. Vote
  5. Decision
  6. Log entry (append to docs/Decision-Log.md)

End with a concrete next-action hand-off.
─────────────────────────────────────────────────────────────────────────
`);
