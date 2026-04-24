# Council Logging Policy — Canonical Source Resolution

**Status**: DRAFT - addresses compass-p1-004  
**Date**: 2026-04-24  
**Context**: Two parallel council logging systems need canonicalization

## Current State

1. **JSONL Runtime Logs** (`memory/council-log.jsonl`)
   - Machine-readable format  
   - Automated logging from council runtime
   - Schema: `{at, trigger, topic, participants, picks, summary, actions, provider}`
   - Example: 2026-04-23 "Project reality check" session

2. **Markdown Decision Logs** (`docs/Decision-Log.md`)  
   - Human-readable format
   - Manual append after council sessions
   - Schema: Date, Members, Topic, Decisions, Dissent, Hand-off
   - Example: 2026-04-24 "Core Game Mechanics" session (AI Council #1)

## Recommended Policy

### **DUAL-WRITE with Markdown as Canonical**

**Primary Source**: `docs/Decision-Log.md` (human-readable, version-controlled, reviewable)  
**Secondary Source**: `memory/council-log.jsonl` (machine-readable, automation hooks)

### **Process**

1. **Council Session Execution**: 
   - All council sessions MUST result in a Decision-Log.md entry
   - JSONL entries are OPTIONAL but recommended for automation

2. **Markdown Entry Format** (canonical):
   ```markdown
   ## YYYY-MM-DD — Topic Title
   
   **Members**: [list with facilitator noted]
   **Topic**: [description]  
   **Decisions**: [numbered outcomes]
   **Dissent**: [any recorded dissent with reasoning]
   **Hand-off**: [concrete next actions with owners]
   **Affected files**: [list]
   ```

3. **JSONL Entry Format** (automation):
   ```json
   {"at":"ISO-8601","trigger":"manual|scheduled","topic":"string","participants":["slug"],"decisions":["string"],"dissent":["string"],"actions":["string"],"provider":"agent-id"}
   ```

4. **Retention**:
   - Markdown: Permanent (version-controlled)
   - JSONL: 90-day rolling window (can be archived/exported)

### **Conflict Resolution**

If JSONL and Markdown conflict → **Markdown wins** (canonical source)

### **Migration Actions**

1. ✅ AI Council #1 (2026-04-24) already in Decision-Log.md format  
2. ⚠️  Council session from 2026-04-23 exists only in JSONL - needs Decision-Log.md entry
3. 🔄 Update AI_Council_Charter.md to reference this policy
4. 🔄 Update council session templates to include both formats

## Benefits

- **Canonical source**: Single source of truth for decisions  
- **Human reviewability**: Markdown is readable in PRs and diffs
- **Automation support**: JSONL enables programmatic analysis
- **Audit trail**: Git history tracks decision evolution
- **Governance clarity**: Clear conflict resolution hierarchy