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
  ssh: "ssh brucewayne@100.117.148.52",
  host: "Bruces-Mac-mini.local",
  verifiedAt: "2026-04-28",
  verifiedState: "reachable",
  note:
    "SSH resolves over Tailscale to the Mac mini. OpenClaw 2026.4.26 is running, gateway /ready is healthy, and Zara/Zyra use external launchd runners plus a 15-minute self-healing watchdog under ~/.openclaw/cybertrader-runners.",
};

export const OPENCLAW_AGENT_STATUS: OpenClawAgentStatus[] = [
  {
    slug: "zara",
    name: "Zara",
    role: "Implementation scout / asset ops",
    node: "zyra-mini",
    state: "live",
    heartbeat: "launchd job ai.cybertrader.zara.autonomous runs every 2 hours; watchdog restarts only if missing or exited",
    responsibilities: [
      "pull Dev Lab and v6 before work",
      "select scoped v6 P0/P1 implementation tasks",
      "run relevant checks before direct pushes",
      "queue asset optimization work only when it supports v6 store readiness",
    ],
  },
  {
    slug: "zyra",
    name: "Zyra",
    role: "Node watch / QA task sync",
    node: "zyra-mini",
    state: "live",
    heartbeat: "launchd job ai.cybertrader.zyra.autonomous runs every 1 hour; watchdog restarts only if missing or exited",
    responsibilities: [
      "check v6 live deployment and local health",
      "keep Dev Lab task/status docs current",
      "monitor SSH/Tailscale health",
      "maintain autonomous run logs and escalate blockers",
    ],
  },
];
