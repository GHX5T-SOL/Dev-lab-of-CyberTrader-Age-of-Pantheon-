# CyberTrader v6 Prototype Export

Date: 2026-04-24

CyberTrader: Age of Pantheon v6 is the selected playable prototype moving forward. The actual game source is exported from this Dev Lab repo's `src/` directory to:

https://github.com/GHX5T-SOL/CyberTrader-Age-of-Pantheon-v6

This version includes the working local authority trade loop, XP/rank progression, inventory slots, real-time clock/ticks, deterministic market news, location travel, heat and raid systems, Black Market heat reduction, courier shipments, and the intro cinematic route.

Deployment note: `src/vercel.json` configures Vercel with `npm run build:web`, `npm run web -- --port 8081`, `dist` output, and SPA rewrites.
