# Phase 1 First Playable Slice Brief

> Creative brief for the first real game demo. This is the player-facing slice Zoro is locking before implementation begins in earnest.

## Purpose

Ship the **first believable 5-10 minute player session** of CyberTrader: Age of Pantheon.

This slice must prove three things:
- the game feels like a **working cyberdeck**, not a dashboard
- the player understands they are an **Eidolon waking inside stolen hardware**
- one complete trade can happen end to end with visible consequences

## Demo definition

The first playable slice is:
1. boot sequence
2. handle / dev-identity entry
3. terminal home
4. market scan with 10 commodities visible
5. one buy flow
6. one sell flow
7. visible updates to balance, position, Energy, and Heat
8. clear "you survived your first move" end state

Not in scope for this slice:
- factions
- missions
- map
- wallet-first onboarding
- cinematics longer than a tight intro beat
- lore-heavy exposition dumps

## Player fantasy

The player should feel:
- under-equipped
- slightly hunted
- smart enough to survive
- one trade away from momentum

The emotional arc is:
- confusion
- system boot confidence
- market curiosity
- low-risk first action
- small win
- desire to go deeper

## Core tone

This slice should read as:
- illicit
- premium
- tense
- legible
- diegetic

It must **not** read as:
- a crypto exchange
- a spreadsheet
- a finance sim for adults in suits
- a generic neon cyberpunk collage

## Screen-by-screen direction

### 1. Boot

Goal: wake the player inside compromised hardware.

Visual direction:
- near-black `bg.void`
- cyan system text
- acid confirmations
- one amber instability warning
- no lore violet here

Copy style:
- terse
- monospace
- system-first

Required beats:
- BIOS check
- unstable cloak
- signal integrity value
- handle prompt

The player should feel the deck is alive, damaged, and usable.

### 2. Handle / dev identity

Goal: let the player claim identity fast without breaking immersion.

Visual direction:
- same terminal shell, no new visual language
- one input focus state in cyan
- helper text in muted fg

Rules:
- this is still diegetic, not "sign up"
- avoid web-form language
- dev identity fallback should feel like a temporary local alias, not a fake account

Preferred copy pattern:
- `handle: [enter]_`
- `local shell only. uplink optional.`

### 3. Terminal home

Goal: establish the player’s status at a glance.

Required modules:
- handle
- OS tier
- 0BOL balance
- Energy
- Heat
- market open signal
- one clear CTA into S1LKROAD

Visual hierarchy:
- top: identity + system condition
- middle: active resource strip
- bottom: primary action to enter market

This screen should feel like a cockpit, not a menu.

### 4. Market scan

Goal: make the 10 commodities feel readable, dangerous, and alive.

Presentation rules:
- ticker first, name second
- current price must be visually dominant
- delta / motion should be legible without turning the screen into noise
- at least one low-risk beginner commodity should feel obviously approachable

Commodity feel targets:
- `VBLM` should feel like the safest first move
- `FDST` and `BLCK` should feel tempting but dangerous
- `ORRS` should feel reactive to signal/news even before full news systems arrive

Visual rhythm:
- dense, terminal-like rows
- enough spacing to tap confidently on mobile
- prices should feel alive through subtle pulse/flicker, not constant chaos

### 5. Buy flow

Goal: make the first purchase feel risky but understandable.

Required visible inputs:
- selected commodity
- current price
- quantity
- projected cost
- projected Heat impact

The confirmation should feel like:
- a committed system action
- not a shopping cart

Preferred confirmation language:
- `execute buy`
- `commit order`
- `route packet`

Avoid:
- `continue`
- `checkout`
- `submit`

### 6. Sell flow

Goal: close the loop and show that the game has teeth.

After selling, the player must see:
- updated 0BOL
- realized result
- Heat movement
- open/closed position state

The first demo should lean toward a **small positive result**, not a harsh punishment. We want momentum, not early churn.

## Resource feel

### Energy

Energy is life support, not stamina.

Direction:
- acid green when stable
- amber when thinning
- never decorative

The player should read Energy as: "I can keep operating."

### Heat

Heat is consequence pressure.

Direction:
- red only
- more severe than loss
- feels like detection risk, not generic danger

The player should read Heat as: "If I get sloppy, something will come for me."

## Copy rules

All text in this slice should obey:
- short lines
- system voice
- no filler words
- no playful app language
- no real-world trading slang unless it fits the world

Good:
- `market open`
- `small trade. low heat.`
- `signal traced. move.`

Bad:
- `Welcome back!`
- `Nice trade!`
- `You're all set`

## Motion and audio

Motion:
- subtle scanline movement
- tiny price pulses
- one satisfying confirm press on trade execution
- no bouncy transitions

Audio:
- low electrical ambience
- soft terminal confirmations
- one stronger confirm sting when a trade executes

Silence should still feel intentional. No empty placeholder quiet.

## Visual constraints

Use the locked brand system:
- cyan = active
- acid = working / profit / energy
- heat red = consequences
- amber = caution / information
- violet = lore only, and rare

Typography:
- terminal body in mono
- headings restrained
- glitch type only for short accents

No generic purple gradients.
No admin-dashboard cards.
No oversized decorative chrome that blocks readability.

## Success test

This slice is creatively successful if a first-time player can say:
- "I woke up inside a cyberdeck"
- "I understood what to tap"
- "I made one trade"
- "I saw why Energy and Heat matter"
- "I want to open the market again"

## Handoff to build

Ghost / Rune / Vex should implement against these priorities:
1. keep the whole slice in one visual language from boot through first sell
2. make the terminal readable on portrait mobile first
3. ensure the first trade feels consequential but not punishing
4. favor clarity over decorative effects whenever they conflict

## Immediate follow-up after this brief

Once implementation begins, Zoro's next creative follow-up is:
- approve office lighting and avatar placement in the Dev Lab as a secondary Phase B polish pass
