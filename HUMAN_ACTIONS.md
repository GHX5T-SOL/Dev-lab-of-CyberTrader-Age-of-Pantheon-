# Human Action Ledger

This file is the only place for items that truly require a human account owner, legal declarant, payment decision, or external credential. These items are **non-blocking** for the autonomous build pipeline.

Agents must keep building CyberTrader v6 while this list waits.

## Open Items

| ID | Owner | Needed From Human | Why AI Cannot Complete It Alone | Status |
| --- | --- | --- | --- | --- |
| human-store-001 | Ghost/Zoro | Apple Developer and Google Play Console account access or delegated credentials | Store submission, legal declarations, and account ownership require account-holder access | open |
| human-policy-001 | Ghost/Zoro | Final legal/business declarations for privacy, age rating, and trader/account-owner status | These are legal/account-owner attestations, not implementation tasks | open |
| human-budget-001 | Ghost/Zoro | Paid model and paid build-service budget preference, if any | Agents default to free-first routing and existing credits only | open |

## Agent Rules

- Do not stop autonomous work because an item is listed here.
- If a task needs a human-only input, log it here, update Dev Lab run notes, and immediately choose another unblocked task.
- Do not print secrets or paste credentials into this file.
- Do not perform irreversible on-chain/mainnet or paid account actions unless the account is already configured and the operation is explicitly safe for the release workflow.
