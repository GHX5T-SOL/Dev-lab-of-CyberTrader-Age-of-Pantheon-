export type FounderSlug = "ghost" | "zoro";

export type OfficeHotspotId =
  | "whiteboard"
  | "wireframes"
  | "credits"
  | "commodities"
  | "brand"
  | "cinema"
  | "council"
  | "status"
  | "openclaw";

export interface OfficeDistrict {
  id: string;
  title: string;
  summary: string;
  anchors: OfficeHotspotId[];
}

export interface OfficeHotspot {
  id: OfficeHotspotId;
  districtId: string;
  title: string;
  summary: string;
  prompt: string;
  accent: string;
  position: [number, number, number];
  rotationY: number;
  interactionRadius: number;
  previewScale: [number, number];
  route: string;
}

export interface OfficeBlocker {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface OfficePatrol {
  speed: number;
  waitMs: number;
  nodes: [number, number, number][];
}

export interface OfficePropPlacement {
  id: string;
  modelPath: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  accent?: string;
  emissiveBoost?: number;
  animationName?: string;
}

// The zone grouping follows a task-oriented card-sort pass: command surfaces,
// strategy/media walls, finance, lore/brand, and physical infrastructure.
export const OFFICE_DISTRICTS: OfficeDistrict[] = [
  {
    id: "command-deck",
    title: "Command Deck",
    summary: "Founder tasking, council decisions, and live status.",
    anchors: ["whiteboard", "council", "status"],
  },
  {
    id: "signal-wall",
    title: "Signal Wall",
    summary: "Wireframes, roadmap mirrors, and comparison screens.",
    anchors: ["wireframes"],
  },
  {
    id: "market-lane",
    title: "Market Lane",
    summary: "Spend telemetry, commodities, and burn-rate visibility.",
    anchors: ["credits", "commodities"],
  },
  {
    id: "creative-vault",
    title: "Creative Vault",
    summary: "Brand canon, cinematics, and visual direction.",
    anchors: ["brand", "cinema"],
  },
  {
    id: "node-core",
    title: "Node Core",
    summary: "OpenClaw execution rack on zyra-mini.",
    anchors: ["openclaw"],
  },
];

export const OFFICE_HOTSPOTS: OfficeHotspot[] = [
  {
    id: "whiteboard",
    districtId: "command-deck",
    title: "Whiteboard Ops",
    summary: "Ghost and Zoro task board with dependencies and acceptance gates.",
    prompt: "Inspect whiteboard",
    accent: "#67FFB5",
    position: [-7.1, 1.72, 3.22],
    rotationY: Math.PI / 2,
    interactionRadius: 2.2,
    previewScale: [2.9, 1.9],
    route: "/office/tasks",
  },
  {
    id: "wireframes",
    districtId: "signal-wall",
    title: "Wireframe Wall",
    summary: "Legacy prototype comparison monitors and current command-center flow.",
    prompt: "Inspect monitor wall",
    accent: "#00F5FF",
    position: [0.15, 2.1, -8.08],
    rotationY: 0,
    interactionRadius: 2.8,
    previewScale: [3.9, 2.1],
    route: "/office/wireframes",
  },
  {
    id: "credits",
    districtId: "market-lane",
    title: "Credits Ops",
    summary: "Live AI spend, provider health, and burn monitoring.",
    prompt: "Open burn monitor",
    accent: "#FF2A4D",
    position: [7.1, 1.62, 3.1],
    rotationY: -Math.PI / 2,
    interactionRadius: 2,
    previewScale: [2.3, 1.5],
    route: "/office/spend",
  },
  {
    id: "commodities",
    districtId: "market-lane",
    title: "Commodity Exchange",
    summary: "Ten S1LKROAD commodities with lore, heat, and volatility.",
    prompt: "Inspect commodity rack",
    accent: "#FFB341",
    position: [6.1, 1.44, 0.8],
    rotationY: -Math.PI / 2.8,
    interactionRadius: 1.9,
    previewScale: [2.6, 1.6],
    route: "/office/brand",
  },
  {
    id: "brand",
    districtId: "creative-vault",
    title: "Brand Vault",
    summary: "Palette, commodity art, hero treatments, and canon rules.",
    prompt: "Open brand vault",
    accent: "#7A5BFF",
    position: [-6.2, 1.52, 1.74],
    rotationY: Math.PI / 2,
    interactionRadius: 2.1,
    previewScale: [2.4, 1.55],
    route: "/office/brand",
  },
  {
    id: "cinema",
    districtId: "creative-vault",
    title: "Cinema Bay",
    summary: "Reels, explainers, and the future cinematic queue.",
    prompt: "Enter cinema bay",
    accent: "#7A5BFF",
    position: [-6.55, 1.38, -4.88],
    rotationY: Math.PI / 3,
    interactionRadius: 2.2,
    previewScale: [2.8, 1.55],
    route: "/office/reel",
  },
  {
    id: "council",
    districtId: "command-deck",
    title: "Council Table",
    summary: "Phase status, roadmap pressure, and high-level decisions.",
    prompt: "Review council table",
    accent: "#00F5FF",
    position: [0.05, 1.45, 0.55],
    rotationY: Math.PI,
    interactionRadius: 2.4,
    previewScale: [2.8, 1.6],
    route: "/office/council",
  },
  {
    id: "status",
    districtId: "command-deck",
    title: "Status Terminal",
    summary: "Blockers, wins, and the current Phase B reality check.",
    prompt: "Inspect status terminal",
    accent: "#67FFB5",
    position: [5.42, 1.52, -0.08],
    rotationY: -Math.PI / 2,
    interactionRadius: 1.7,
    previewScale: [2.1, 1.45],
    route: "/office/status",
  },
  {
    id: "openclaw",
    districtId: "node-core",
    title: "OpenClaw Node",
    summary: "Zara and Zyra operating on zyra-mini over Tailscale.",
    prompt: "Inspect node core",
    accent: "#7A5BFF",
    position: [8.05, 1.72, -4.18],
    rotationY: -Math.PI / 2,
    interactionRadius: 2.1,
    previewScale: [2.3, 1.55],
    route: "/office/team",
  },
];

export const OFFICE_BOUNDS = {
  minX: -8.6,
  maxX: 8.9,
  minZ: -6.95,
  maxZ: 6.35,
};

export const OFFICE_BLOCKERS: OfficeBlocker[] = [
  { minX: -1.8, maxX: 1.8, minZ: -1.25, maxZ: 1.55 },
  { minX: -3.55, maxX: -1.1, minZ: -5.95, maxZ: -3.15 },
  { minX: 3.72, maxX: 5.95, minZ: -3.95, maxZ: -1.7 },
  { minX: 7.38, maxX: 8.95, minZ: -5.7, maxZ: -3.2 },
  { minX: -7.95, maxX: -5.2, minZ: -6.95, maxZ: -4.32 },
];

export const FOUNDER_SPAWNS: Record<FounderSlug, [number, number, number]> = {
  ghost: [1.3, 0, 5.5],
  zoro: [-1.25, 0, 5.35],
};

export const OFFICE_PATROLS: Partial<Record<string, OfficePatrol>> = {
  axiom: {
    speed: 1.18,
    waitMs: 750,
    nodes: [
      [2.5, 0, 2.55],
      [3.8, 0, 1.3],
      [4.2, 0, -0.55],
      [2.4, 0, -0.25],
    ],
  },
  compass: {
    speed: 0.95,
    waitMs: 1250,
    nodes: [
      [0.2, 0, 1.15],
      [-1.1, 0, 2.55],
      [1.35, 0, 2.4],
    ],
  },
  talon: {
    speed: 1.12,
    waitMs: 1000,
    nodes: [
      [7.35, 0, -2.65],
      [7.35, 0, -4.75],
      [5.95, 0, -5.2],
    ],
  },
  hydra: {
    speed: 1.05,
    waitMs: 1100,
    nodes: [
      [1.65, 0, -0.6],
      [0.15, 0, -2.1],
      [-1.4, 0, -0.45],
    ],
  },
  cipher: {
    speed: 0.92,
    waitMs: 1350,
    nodes: [
      [-5.1, 0, 0.72],
      [-4.0, 0, -0.2],
      [-3.75, 0, 1.25],
    ],
  },
};

export const OFFICE_PROP_LAYOUT: OfficePropPlacement[] = [
  {
    id: "floor",
    modelPath: "/GLB_Assets/office_floor_option_2.glb",
    position: [0, -0.02, -0.25],
    rotation: [0, 0, 0],
    scale: 1.06,
  },
  {
    id: "whiteboard",
    modelPath: "/GLB_Assets/furniture_whiteboard.glb",
    position: [-7.26, 0, 3.18],
    rotation: [0, Math.PI / 2, 0],
    scale: 1.6,
    accent: "#67FFB5",
    emissiveBoost: 0.22,
  },
  {
    id: "calendar",
    modelPath: "/GLB_Assets/furniture_wall_calendar.glb",
    position: [-7.45, 1.62, 0.32],
    rotation: [0, Math.PI / 2, 0],
    scale: 1.4,
  },
  {
    id: "wall-computers-main",
    modelPath: "/GLB_Assets/furniture_wall_computer.glb",
    position: [0.1, 1.38, -7.88],
    rotation: [0, 0, 0],
    scale: 2.1,
    accent: "#00F5FF",
    emissiveBoost: 0.16,
  },
  {
    id: "server-rack",
    modelPath: "/GLB_Assets/furniture_server_rack.glb",
    position: [7.98, 0, -4.72],
    rotation: [0, -Math.PI / 2, 0],
    scale: 0.54,
    accent: "#7A5BFF",
    emissiveBoost: 0.08,
  },
  {
    id: "tech-cluster-right",
    modelPath: "/GLB_Assets/furniture_tech.glb",
    position: [5.5, 0, -1.8],
    rotation: [0, -Math.PI / 2, 0],
    scale: 0.38,
    accent: "#00F5FF",
    emissiveBoost: 0.08,
  },
  {
    id: "tech-cluster-left",
    modelPath: "/GLB_Assets/furniture_tech.glb",
    position: [-5.75, 0, 1.75],
    rotation: [0, Math.PI / 2, 0],
    scale: 0.33,
    accent: "#7A5BFF",
    emissiveBoost: 0.09,
  },
  {
    id: "couch",
    modelPath: "/GLB_Assets/furniture_couch.glb",
    position: [-6.25, 0, -5.35],
    rotation: [0, Math.PI / 3.2, 0],
    scale: 0.66,
    accent: "#7A5BFF",
    emissiveBoost: 0.05,
  },
  {
    id: "desk-left",
    modelPath: "/GLB_Assets/furniture_desk.glb",
    position: [-2.3, 0, -4.5],
    rotation: [0, 0, 0],
    scale: 0.28,
    accent: "#00F5FF",
    emissiveBoost: 0.06,
  },
  {
    id: "desk-right",
    modelPath: "/GLB_Assets/furniture_desk.glb",
    position: [2.7, 0, -4.3],
    rotation: [0, 0, 0],
    scale: 0.28,
    accent: "#00F5FF",
    emissiveBoost: 0.06,
  },
  {
    id: "desk-market",
    modelPath: "/GLB_Assets/furniture_desk.glb",
    position: [4.8, 0, -2.4],
    rotation: [0, -Math.PI / 2, 0],
    scale: 0.24,
    accent: "#FF2A4D",
    emissiveBoost: 0.06,
  },
  {
    id: "computer-left",
    modelPath: "/GLB_Assets/furniture_computer%201.glb",
    position: [-2.35, 1.02, -4.3],
    rotation: [0, Math.PI, 0],
    scale: 0.9,
    accent: "#00F5FF",
    emissiveBoost: 0.15,
    animationName: "Scene",
  },
  {
    id: "computer-right",
    modelPath: "/GLB_Assets/furniture_computer_2.glb",
    position: [2.6, 1.05, -4.22],
    rotation: [0, Math.PI, 0],
    scale: 0.62,
    accent: "#67FFB5",
    emissiveBoost: 0.14,
  },
  {
    id: "computer-market",
    modelPath: "/GLB_Assets/furniture_computer_2.glb",
    position: [5.1, 1.04, -2.45],
    rotation: [0, Math.PI / 2, 0],
    scale: 0.54,
    accent: "#FF2A4D",
    emissiveBoost: 0.14,
  },
];
