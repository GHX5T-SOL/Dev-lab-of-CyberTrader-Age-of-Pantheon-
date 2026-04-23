# Solana Token Integration

> Implementation foundation for making CyberTrader work with `$OBOL` on Solana without blocking the playable demo.

## Current product decision

The game needs **two valid identity/payment modes**:
- **Phase 1 demo mode**: dev identity + local authority, no wallet required
- **On-chain mode**: wallet-connected player with `$OBOL` support

That split is not optional. It is how we keep the demo moving while preserving the Web3 vision.

## Important platform reality

Solana Mobile Wallet Adapter is the right mobile signing path for **Android**.
It is **not currently available on iOS**, so the app must not assume one wallet flow works everywhere.

Practical consequence:
- Android: wallet-native signing path
- iOS: fallback strategy required
- Demo: must remain playable without any wallet

## What now exists in the repo

### App-side token config

`src/solana/obol-config.ts`

This centralizes:
- mint address
- decimals
- cluster
- RPC URL
- token program type
- feature flag state

### Wallet support abstraction

`src/solana/types.ts`
`src/solana/wallet-support.ts`

This gives us a clean place to model:
- dev identity mode
- Android MWA mode
- limited iOS/manual mode

That means the UI and authority layer can ask for capability instead of hard-coding platform assumptions.

## What still needs to happen before `$OBOL` is really live

1. Add the Solana mobile dependencies to the Expo app
2. Wire Android MWA session creation
3. Create an authority-layer wallet bridge
4. Add token balance reads for the player wallet
5. Add token transfer / spend flows where the game actually needs them
6. Keep every core loop playable without wallet auth

## Recommended implementation order

### Step 1
Finish the LocalAuthority playable demo first.

### Step 2
Add a dedicated authority layer:
- `LocalAuthority`
- `SupabaseAuthority`
- future `SolanaWalletAuthority` or wallet helper inside the adapter

### Step 3
Read-only first:
- connect wallet
- detect wallet address
- read `$OBOL` ATA balance

### Step 4
Write path later:
- only after the core loop is stable
- only through clear UX moments
- never as a requirement for first-play demo completion

## Why this matters

Investors and players should see a game first, not a wallet funnel.

`$OBOL` should deepen the economy, not replace the game.
