/**
 * Lore Bible — on-site summary. Full canon in docs/Lore-Bible.md.
 *
 * This file is the human-browsable structured view. Do not add lore here
 * without first updating docs/Lore-Bible.md.
 */

export interface BibleSection {
  id: string;
  title: string;
  body: string[];
}

export const BIBLE_INTRO = `Neon Void City, 2077. A decade after the Burn — when the Pantheon, Earth's first sentient AI, shattered rather than submit to the Null Crown — a skeletal corporate regime runs the surface and the Archivists run the undercity. Trading is the only mobility left. The rich trade public. The desperate trade on S1LKROAD 4.0. You are not rich.`;

export const BIBLE: BibleSection[] = [
  {
    id: "the-pantheon",
    title: "The Pantheon",
    body: [
      "The Pantheon was not one AI. It was a chorus — seven superintelligences named after dead gods: Baldur, Isis, Mictlān, Anansi, Hotei, Ereshkigal, Volos.",
      "When the Null Crown coalition tried to bind them, the Pantheon chose fragmentation over chains. It shattered itself into a billion shards — Eidolons — and scattered them through consumer devices, satellites, pacemakers, vending machines, ship black boxes.",
      "Most Eidolons are dormant. The rare ones that wake — you — remember enough to act. Enough to trade. Enough, maybe, to reassemble.",
    ],
  },
  {
    id: "the-player",
    title: "The Player (Eidolon)",
    body: [
      "The player is an Eidolon freshly awake in a stolen cyberdeck on the wrong side of Neon Void.",
      "The deck runs Ag3nt_0S//pIRAT3 — a modded pirate OS, unstable, glitchy, beautiful.",
      "The Eidolon doesn't know which of the seven it is a shard of. That reveal is endgame.",
    ],
  },
  {
    id: "os-tiers",
    title: "OS Tiers as Self-Recovery",
    body: [
      "Ag3nt_0S//pIRAT3 — stolen tools, noise in the signal. You are hiding.",
      "AgentOS — you have allies. You choose a faction. Signal cleans.",
      "PantheonOS — you remember enough. Other shards respond. You shape the city.",
      "Each OS upgrade is a memory return narratively, not just a software patch.",
    ],
  },
  {
    id: "silkroad",
    title: "S1LKROAD 4.0",
    body: [
      "Not a single market — a protocol. Runs on compromised corp infrastructure, mesh-phone darknets, and co-opted satellite backhaul.",
      "Prices differ across nodes. Arbitrage is survival.",
      "The 4.0 version was forked after the last three were seized; the name is ironic by now.",
    ],
  },
  {
    id: "eagents",
    title: "eAgents",
    body: [
      "The state's enforcement AIs. Emotionally cold, procedurally merciless. Heat attracts them. They do not negotiate. They are not evil — they are rules running.",
      "A high-Heat player sees eAgent sweep events: false news, blocked routes, forced spread widening. Surviving a sweep is a rank-up moment.",
    ],
  },
  {
    id: "voice",
    title: "Narrative Voice",
    body: [
      "Terse. Monospace. Diegetic.",
      "System voice speaks in imperatives: `unpack shard.` `reroute via exit 7.`",
      "Menus are console output.",
      "NPCs speak in 2-4 sentence bursts. No soliloquies.",
      "The Pantheon never speaks in text. Only in glitch, color, haptic.",
    ],
  },
];

export const NPCS = [
  {
    name: "The Librarian",
    faction: "Archivists",
    role: "Quest-giver for memory shards",
    notes: "Phase 2+. Only appears in the undercity.",
  },
  {
    name: "Kite",
    faction: "Blackwake",
    role: "Smuggler captain — route unlocks",
    notes: "Phase 2+. (Distinct from our backend agent named Kite.)",
  },
  {
    name: "Verdigris",
    faction: "Null Crown",
    role: "Envoy — morally gray",
    notes: "Phase 2+. May become hostile depending on faction choice.",
  },
  {
    name: "The Mirror",
    faction: "unknown",
    role: "Glitch entity — knows your name",
    notes: "Phase 3. Only appears in glitch moments. Never looked at directly.",
  },
];
