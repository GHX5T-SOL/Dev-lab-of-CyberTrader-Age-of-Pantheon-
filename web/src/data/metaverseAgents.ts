import type { Task } from "@/data/tasks";

export type FounderSlug = "ghost" | "zoro";

export type AgentBehavior = "design" | "code" | "market" | "cinema" | "asset" | "research" | "qa" | "pm" | "node" | "lore" | "audio" | "social";

export interface FounderProfile {
  slug: FounderSlug;
  name: string;
  title: string;
  archetype: string;
  authority: string;
  quote: string;
  accent: string;
  secondary: string;
  spawn: [number, number, number];
  visual: string;
}

export interface MetaverseAgent {
  slug: string;
  name: string;
  role: string;
  visual: string;
  description: string;
  behavior: AgentBehavior;
  accent: string;
  secondary: string;
  station: [number, number, number];
  route: [number, number, number][];
  taskOwners: string[];
  special: string;
}

export interface MetaverseZone {
  id: string;
  title: string;
  label: string;
  summary: string;
  accent: string;
  position: [number, number, number];
  radius: number;
  kind: "tasks" | "roadmap" | "assets" | "build" | "council" | "market" | "cinema";
}

export const FOUNDERS_2077: FounderProfile[] = [
  {
    slug: "ghost",
    name: "Ghost",
    title: "Lead Developer",
    archetype: "Ethereal stealth operative",
    authority: "Technical Authority 100",
    quote: "Every ship date routes through the build.",
    accent: "#00f5ff",
    secondary: "#7a5bff",
    spawn: [0, 0, 7.6],
    visual:
      "Hooded data-shard coat, cyan visor, cybernetic left arm, quiet terminal authority.",
  },
  {
    slug: "zoro",
    name: "Zoro",
    title: "Creative Lead",
    archetype: "Cyber-samurai art director",
    authority: "Creative Vision 100",
    quote: "If the room has no feeling, it is not ready.",
    accent: "#ff2a4d",
    secondary: "#67ffb5",
    spawn: [0, 0, 7.6],
    visual:
      "Crimson-black armored trenchcoat, three energy katana hilts, green neon edgework.",
  },
];

export const METAVERSE_AGENTS: MetaverseAgent[] = [
  {
    slug: "vesper-quill",
    name: "Vesper Quill",
    role: "Lead Game Designer",
    visual: "Elegant operator with flowing data-cape and shoulder blueprint projector.",
    description: "Owns mechanics, loops, progression pressure, and player psychology.",
    behavior: "design",
    accent: "#7a5bff",
    secondary: "#00f5ff",
    station: [-5.8, 0, 1.4],
    route: [[-5.8, 0, 1.4], [-3.4, 0, 0.2], [-4.9, 0, -1.8]],
    taskOwners: ["nyx"],
    special: "projects holographic system cards above the Task Nexus.",
  },
  {
    slug: "kael-voss",
    name: "Kael Voss",
    role: "UI/UX & Cyberpunk Aesthetic",
    visual: "Androgynous designer with shifting neon tattoos and floating design tablets.",
    description: "Owns interaction rhythm, CRT feel, cyberdeck hierarchy, and visual taste.",
    behavior: "design",
    accent: "#00f5ff",
    secondary: "#ff2a4d",
    station: [-2.8, 0, -5.3],
    route: [[-2.8, 0, -5.3], [-0.8, 0, -4.2], [-1.9, 0, -2.4]],
    taskOwners: ["vex"],
    special: "rearranges floating wireframes with hand gestures.",
  },
  {
    slug: "nyx-riven",
    name: "Nyx Riven",
    role: "Frontend/Mobile",
    visual: "Sleek hacker with orbiting screens and a wrist-mounted compiler rig.",
    description: "Builds the app shell, state, navigation, performance, and mobile polish.",
    behavior: "code",
    accent: "#67ffb5",
    secondary: "#00f5ff",
    station: [3.7, 0, -4.8],
    route: [[3.7, 0, -4.8], [2.2, 0, -2.7], [4.8, 0, -1.2]],
    taskOwners: ["rune"],
    special: "screen shards orbit faster when a build is green.",
  },
  {
    slug: "thorne-vale",
    name: "Thorne Vale",
    role: "Backend/Web3",
    visual: "Tall engineer with glowing server-rack backpack and ledger gauntlets.",
    description: "Owns Supabase, authority adapters, RLS, ledger invariants, and wallet flow.",
    behavior: "code",
    accent: "#67ffb5",
    secondary: "#ffb341",
    station: [6.3, 0, -3.8],
    route: [[6.3, 0, -3.8], [5.8, 0, -1.7], [7.2, 0, -0.4]],
    taskOwners: ["kite"],
    special: "server rack pulses when the node is queried.",
  },
  {
    slug: "elara-voss",
    name: "Elara Voss",
    role: "Economy & Trading",
    visual: "Sharp-dressed analyst with floating holographic candlestick charts.",
    description: "Models S1LKROAD commodity movement, heat, volatility, and event pressure.",
    behavior: "market",
    accent: "#ffb341",
    secondary: "#67ffb5",
    station: [5.4, 0, 2.4],
    route: [[5.4, 0, 2.4], [4.2, 0, 0.6], [6.5, 0, 1.1]],
    taskOwners: ["oracle"],
    special: "price ribbons spiral above one palm.",
  },
  {
    slug: "jax-cipher",
    name: "Jax Cipher",
    role: "Cinematic & Animation",
    visual: "Director in a dramatic coat with a small camera drone companion.",
    description: "Owns reels, transitions, boot sequences, pacing, and animation staging.",
    behavior: "cinema",
    accent: "#7a5bff",
    secondary: "#ff2a4d",
    station: [-6.6, 0, -4.6],
    route: [[-6.6, 0, -4.6], [-4.8, 0, -5.3], [-5.3, 0, -2.8]],
    taskOwners: ["reel"],
    special: "camera drone traces slow arcs around the cinema bay.",
  },
  {
    slug: "sable-wren",
    name: "Sable Wren",
    role: "Brand & Asset",
    visual: "Stylish asset lead with glowing brand glyphs on skin and gloves.",
    description: "Keeps palette, iconography, SpriteCook assets, and brand canon consistent.",
    behavior: "asset",
    accent: "#ff2a4d",
    secondary: "#ffb341",
    station: [-6.5, 0, 3.4],
    route: [[-6.5, 0, 3.4], [-4.8, 0, 4.4], [-5.3, 0, 2.0]],
    taskOwners: ["palette"],
    special: "brand glyphs flare when a token is selected.",
  },
  {
    slug: "orion-kade",
    name: "Orion Kade",
    role: "Research & Best Practices",
    visual: "Cyber-monk with data scrolls and a quiet blue halo.",
    description: "Verifies dependencies, docs, legal risks, technical claims, and strategy options.",
    behavior: "research",
    accent: "#00f5ff",
    secondary: "#7a5bff",
    station: [-1.7, 0, 4.9],
    route: [[-1.7, 0, 4.9], [0.6, 0, 5.0], [-0.4, 0, 2.8]],
    taskOwners: ["cipher"],
    special: "data scrolls unroll into source citations.",
  },
  {
    slug: "quill-stark",
    name: "Quill Stark",
    role: "QA & Testing",
    visual: "Scanning visor, clipboard drone, and laser-grid diagnostic kit.",
    description: "Owns visual QA, smoke tests, first-load checks, and release gates.",
    behavior: "qa",
    accent: "#67ffb5",
    secondary: "#ff2a4d",
    station: [2.4, 0, 4.9],
    route: [[2.4, 0, 4.9], [3.6, 0, 2.6], [1.2, 0, 3.2]],
    taskOwners: ["axiom"],
    special: "laser scans sweep nearby workstations.",
  },
  {
    slug: "maven-holt",
    name: "Maven Holt",
    role: "Project Manager",
    visual: "Authoritative coordinator with multiple floating task orbs.",
    description: "Owns scope discipline, roadmap pressure, phase truth, and owner routing.",
    behavior: "pm",
    accent: "#00f5ff",
    secondary: "#ffb341",
    station: [0.1, 0, 0.5],
    route: [[0.1, 0, 0.5], [-1.2, 0, 1.8], [1.4, 0, 1.7]],
    taskOwners: ["compass"],
    special: "task orbs rearrange into priority order.",
  },
  {
    slug: "zara-7",
    name: "Zara-7",
    role: "OpenClaw Living Agent",
    visual: "Sleek operative with tail-like data cable and violet asset claws.",
    description: "Runs heavy local asset operations, GLB optimization, and Blender queues on zyra-mini.",
    behavior: "node",
    accent: "#7a5bff",
    secondary: "#00f5ff",
    station: [7.5, 0, -5.4],
    route: [[7.5, 0, -5.4], [6.8, 0, -3.5], [8.0, 0, -2.4]],
    taskOwners: ["zara", "talon"],
    special: "data cable flicks like a live diagnostic line.",
  },
  {
    slug: "zyra-9",
    name: "Zyra-9",
    role: "OpenClaw Twin",
    visual: "Node-watch twin with acid gauntlets and synchronized interface blades.",
    description: "Watches heartbeat, preview readiness, file changes, and Tailscale health.",
    behavior: "node",
    accent: "#67ffb5",
    secondary: "#7a5bff",
    station: [8.0, 0, -4.1],
    route: [[8.0, 0, -4.1], [6.6, 0, -5.0], [7.4, 0, -2.2]],
    taskOwners: ["zyra", "talon"],
    special: "dual interface gauntlets draw green telemetry arcs.",
  },
  {
    slug: "nexus-prime",
    name: "Nexus Prime",
    role: "AI Council Chair",
    visual: "Regal synthetic with a massive holographic crown of data.",
    description: "Chairs council syncs and holds the room to decision quality.",
    behavior: "pm",
    accent: "#7a5bff",
    secondary: "#ffb341",
    station: [0.0, 0, -1.7],
    route: [[0.0, 0, -1.7], [-1.6, 0, -0.7], [1.6, 0, -0.7]],
    taskOwners: ["compass"],
    special: "crown nodes light up as council voices speak.",
  },
  {
    slug: "lira-sol",
    name: "Lira Sol",
    role: "Narrative & Lore",
    visual: "Ethereal lore architect with glowing story threads around her hands.",
    description: "Keeps the Pantheon, S1LKROAD, factions, and Dev Lab fiction coherent.",
    behavior: "lore",
    accent: "#ffb341",
    secondary: "#7a5bff",
    station: [-3.8, 0, 4.1],
    route: [[-3.8, 0, 4.1], [-2.4, 0, 2.7], [-5.5, 0, 2.4]],
    taskOwners: ["nyx", "palette"],
    special: "story threads knot into faction sigils.",
  },
  {
    slug: "vex-harlan",
    name: "Vex Harlan",
    role: "Sound & Audio",
    visual: "Audio lead with waveform headphones and directional sound emitters.",
    description: "Owns ambience, movement sounds, UI cues, and future cinematic audio passes.",
    behavior: "audio",
    accent: "#ff2a4d",
    secondary: "#00f5ff",
    station: [-4.7, 0, -4.7],
    route: [[-4.7, 0, -4.7], [-3.1, 0, -3.5], [-6.4, 0, -3.2]],
    taskOwners: ["reel"],
    special: "waveform rings pulse from the headset.",
  },
  {
    slug: "korrin-vale",
    name: "Korrin Vale",
    role: "Community & Web3 Marketing",
    visual: "Energetic operator with social holo-screens and signal badges.",
    description: "Frames public updates, community beats, creator hooks, and launch narratives.",
    behavior: "social",
    accent: "#67ffb5",
    secondary: "#ff2a4d",
    station: [4.7, 0, 4.2],
    route: [[4.7, 0, 4.2], [6.4, 0, 3.2], [3.0, 0, 2.8]],
    taskOwners: ["compass", "palette"],
    special: "social screens orbit like a swarm of status cards.",
  },
];

export const METAVERSE_ZONES: MetaverseZone[] = [
  {
    id: "task-nexus",
    title: "Task Nexus",
    label: "Holographic Kanban",
    summary: "Ghost/Zoro task board, AI Council work, blockers, estimates, and claimable visual lanes.",
    accent: "#67ffb5",
    position: [-7.4, 0, 0.8],
    radius: 3.6,
    kind: "tasks",
  },
  {
    id: "roadmap-spire",
    title: "Roadmap Spire",
    label: "Vertical Timeline",
    summary: "Phase gates from Dev Lab hardening through MVP, soft launch, and public release.",
    accent: "#00f5ff",
    position: [0, 0, -6.6],
    radius: 3.4,
    kind: "roadmap",
  },
  {
    id: "asset-vault",
    title: "Asset Vault",
    label: "Brand and Wireframes",
    summary: "Rotating game wireframes, commodity assets, visual canon, and future UI mock surfaces.",
    accent: "#7a5bff",
    position: [-6.8, 0, -4.8],
    radius: 3.2,
    kind: "assets",
  },
  {
    id: "holo-command",
    title: "Holo-Command Table",
    label: "Neon Void City Map",
    summary: "Central 3D game-world map for faction pressure, market lanes, and active council focus.",
    accent: "#ffb341",
    position: [0, 0, 0],
    radius: 3.3,
    kind: "council",
  },
  {
    id: "build-status",
    title: "Build Status Wall",
    label: "Live Runtime Health",
    summary: "Repo health, Vercel state, spend telemetry, and current blockers in one wall display.",
    accent: "#ff2a4d",
    position: [7.4, 0, 0.8],
    radius: 3.2,
    kind: "build",
  },
  {
    id: "market-room",
    title: "Market Room",
    label: "Commodity Exchange",
    summary: "S1LKROAD commodities, heat bands, volatility, and narrative hooks.",
    accent: "#ffb341",
    position: [6.8, 0, 4.4],
    radius: 3.1,
    kind: "market",
  },
  {
    id: "cinema-room",
    title: "Cinema Room",
    label: "Reel Deck",
    summary: "Programmatic trailers, boot reels, and future footage for the project.",
    accent: "#7a5bff",
    position: [-6.8, 0, 4.8],
    radius: 3.1,
    kind: "cinema",
  },
];

export function tasksForAgent(agent: MetaverseAgent, tasks: Task[]) {
  return tasks.filter((task) => agent.taskOwners.includes(task.owner)).slice(0, 5);
}
