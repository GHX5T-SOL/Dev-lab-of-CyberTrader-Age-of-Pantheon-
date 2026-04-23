export type WorldHotspotId =
  | "tasks"
  | "wireframes"
  | "spend"
  | "commodities"
  | "brand"
  | "reel"
  | "council"
  | "status"
  | "openclaw";

export interface WorldRoom {
  id: string;
  name: string;
  summary: string;
  anchors: WorldHotspotId[];
}

export interface WorldHotspot {
  id: WorldHotspotId;
  title: string;
  room: string;
  summary: string;
  prompt: string;
  accent: string;
  position: [number, number, number];
  rotationY: number;
  radius: number;
  panelSize: [number, number];
}

export interface WorldBlocker {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  note: string;
}

export const WORLD_ROOMS: WorldRoom[] = [
  {
    id: "entry_deck",
    name: "Entry Deck",
    summary: "Ghost and Zoro enter here, suit up, and step into the floor.",
    anchors: ["tasks", "status"],
  },
  {
    id: "signal_wall",
    name: "Signal Wall",
    summary: "Wireframes, roadmap, and council signals projected across the back wall.",
    anchors: ["wireframes", "council"],
  },
  {
    id: "finance_lane",
    name: "Finance Lane",
    summary: "Spend meter, commodity exchange, and provider health hardware.",
    anchors: ["spend", "commodities", "status"],
  },
  {
    id: "creative_lane",
    name: "Creative Lane",
    summary: "Brand vault, reel booth, and the wall of visual canon.",
    anchors: ["brand", "reel"],
  },
  {
    id: "server_corner",
    name: "Server Corner",
    summary: "The OpenClaw node, render queue, and Zara/Zyra physical layer.",
    anchors: ["openclaw"],
  },
];

export const WORLD_HOTSPOTS: WorldHotspot[] = [
  {
    id: "tasks",
    title: "Whiteboard Ops",
    room: "Entry Deck",
    summary: "Ghost + Zoro task board with owner, priority, estimate, and acceptance.",
    prompt: "Open the whiteboard",
    accent: "#67FFB5",
    position: [-7.05, 1.75, 3.35],
    rotationY: Math.PI * 0.5,
    radius: 2.2,
    panelSize: [2.7, 1.8],
  },
  {
    id: "wireframes",
    title: "Wireframe Wall",
    room: "Signal Wall",
    summary: "Prototype monitors for v1-v5, str33t_trad3r, and the active Dev Lab.",
    prompt: "Inspect prototype monitors",
    accent: "#00F5FF",
    position: [0, 2.1, -8.28],
    rotationY: 0,
    radius: 2.8,
    panelSize: [3.8, 1.95],
  },
  {
    id: "spend",
    title: "Credit Ops",
    room: "Finance Lane",
    summary: "Token burn, live provider balance, and no-silent-burn rules.",
    prompt: "Open the burn monitor",
    accent: "#FF2A4D",
    position: [7.05, 1.6, 3.15],
    rotationY: -Math.PI * 0.5,
    radius: 2,
    panelSize: [2.3, 1.6],
  },
  {
    id: "commodities",
    title: "Commodity Exchange",
    room: "Finance Lane",
    summary: "The S1LKROAD 4.0 material rack: tickers, volatility, lore, and art.",
    prompt: "Open the commodity rack",
    accent: "#FFB341",
    position: [6.25, 1.45, 0.8],
    rotationY: -Math.PI * 0.35,
    radius: 2,
    panelSize: [2.7, 1.7],
  },
  {
    id: "brand",
    title: "Brand Vault",
    room: "Creative Lane",
    summary: "Palette, logos, prompts, and commodity art constraints.",
    prompt: "Open the brand vault",
    accent: "#7A5BFF",
    position: [-6.2, 1.55, 1.65],
    rotationY: Math.PI * 0.5,
    radius: 2.1,
    panelSize: [2.55, 1.65],
  },
  {
    id: "reel",
    title: "Cinema Nook",
    room: "Creative Lane",
    summary: "Remotion reels, onboarding cuts, and future cinematic queue.",
    prompt: "Enter the cinema nook",
    accent: "#7A5BFF",
    position: [-6.35, 1.35, -4.8],
    rotationY: Math.PI * 0.35,
    radius: 2.2,
    panelSize: [2.7, 1.55],
  },
  {
    id: "council",
    title: "Council Table",
    room: "Signal Wall",
    summary: "Phase, roadmap, signals, automations, and council decisions.",
    prompt: "Open council overview",
    accent: "#00F5FF",
    position: [0.1, 1.45, 0.55],
    rotationY: Math.PI,
    radius: 2.4,
    panelSize: [2.8, 1.7],
  },
  {
    id: "status",
    title: "Status Terminal",
    room: "Finance Lane",
    summary: "Blockers, wins, repo health, and Phase B reality checks.",
    prompt: "Open the status terminal",
    accent: "#67FFB5",
    position: [5.45, 1.5, 0.05],
    rotationY: -Math.PI * 0.5,
    radius: 1.7,
    panelSize: [2.15, 1.5],
  },
  {
    id: "openclaw",
    title: "OpenClaw Node",
    room: "Server Corner",
    summary: "Zara and Zyra on zyra-mini. Heartbeats, queues, and local heavy lifting.",
    prompt: "Open the server console",
    accent: "#7A5BFF",
    position: [8.05, 1.72, -4.25],
    rotationY: -Math.PI * 0.5,
    radius: 2.1,
    panelSize: [2.3, 1.55],
  },
];

export const WORLD_BLOCKERS: WorldBlocker[] = [
  { minX: -1.8, maxX: 1.8, minZ: -1.2, maxZ: 1.7, note: "council table" },
  { minX: -3.4, maxX: -1.3, minZ: -5.8, maxZ: -3.35, note: "left desk cluster" },
  { minX: 3.95, maxX: 5.8, minZ: -3.9, maxZ: -1.95, note: "right desk cluster" },
  { minX: 7.55, maxX: 8.95, minZ: -5.55, maxZ: -3.45, note: "server rack" },
  { minX: -7.95, maxX: -5.25, minZ: -6.85, maxZ: -4.45, note: "couch" },
];
