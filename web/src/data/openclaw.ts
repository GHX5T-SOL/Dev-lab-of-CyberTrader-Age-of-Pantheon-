export interface OpenClawNode {
  id: string;
  label: string;
  ssh: string;
  host: string;
  verifiedAt: string;
  verifiedState: "reachable" | "partial" | "offline";
  note: string;
}

export interface OpenClawAgentStatus {
  slug: "zara" | "zyra";
  name: string;
  role: string;
  node: string;
  state: "live" | "standby" | "needs-setup";
  heartbeat: string;
  responsibilities: string[];
}

export const OPENCLAW_NODE: OpenClawNode = {
  id: "zyra-mini",
  label: "OpenClaw Node: zyra-mini",
  ssh: "ssh zyra-mini",
  host: "Bruces-Mac-mini.local",
  verifiedAt: "2026-04-21",
  verifiedState: "partial",
  note:
    "SSH resolves over Tailscale to the Mac mini. The remote home has ~/.openclaw state, but tailscale/openclaw CLIs were not on PATH during verification.",
};

export const OPENCLAW_AGENT_STATUS: OpenClawAgentStatus[] = [
  {
    slug: "zara",
    name: "Zara",
    role: "Asset ops / Blender queue",
    node: "zyra-mini",
    state: "standby",
    heartbeat: "asset queue staged",
    responsibilities: [
      "persistent SSH key auth",
      "GLB compression and LOD generation",
      "local Blender retargeting runs",
      "large-file cleanup and manifest updates",
    ],
  },
  {
    slug: "zyra",
    name: "Zyra",
    role: "Node watch / preview sync",
    node: "zyra-mini",
    state: "standby",
    heartbeat: "heartbeat cron requires final enable",
    responsibilities: [
      "watch web/public/GLB_Assets for changes",
      "trigger preview sync readiness checks",
      "monitor SSH/Tailscale health",
      "queue long-running 3D renders for future reels",
    ],
  },
];
