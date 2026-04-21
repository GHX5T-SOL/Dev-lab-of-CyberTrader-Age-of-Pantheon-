/**
 * Performer registry — the "casting sheet" for the Dev Lab.
 *
 * TEAM (team.ts) is the identity bible: who each character is, what they do.
 * AVATAR_SPECS (avatars.ts) is the visual brief: how to draw / rig them.
 *
 * This file is the performance layer:
 *   - voice: which ElevenLabs voice they speak with + tuning
 *   - signatureLine: what they'd say when you walk up to their desk
 *   - desk3D: where they stand in the R3F office, facing where, doing what
 *   - glbModelPath: local .glb in /public/GLB_Assets for the Phase B scene
 *   - voiceSampleUrl: pre-rendered MP3 in /public/voices/<slug>.mp3
 *     (when present, the scene plays this file; when absent, it falls through
 *     to POST /api/voice/speak which streams from ElevenLabs live)
 *
 * Voice IDs are ElevenLabs' stable public "v2" voices. Swap any of them for
 * your own cloned voices by replacing voiceId with the cloned-voice asset id.
 * See: https://api.elevenlabs.io/v1/voices (auth required).
 */

export type DeskPose = "sit" | "stand" | "patrol" | "couch" | "whiteboard" | "terminal";
export type PerformerBehavior = "idle" | "walk" | "typing" | "whiteboard" | "council" | "node_watch";

export interface PerformerSpec {
  slug: string;
  /** ElevenLabs voice_id. Swap for a cloned voice any time. */
  voiceId: string;
  /** TTS fine-tuning per ElevenLabs docs. 0.5/0.75 is a safe default. */
  voiceSettings: {
    stability: number;
    similarityBoost: number;
    style?: number;
    useSpeakerBoost?: boolean;
  };
  /** First-line greeting said when the camera focuses on them. */
  signatureLine: string;
  /** Longer second beat (used for the reel / video overs). */
  voiceOver?: string;
  /** Local Phase B GLB path under /public. */
  glbModelPath: string;
  /** Scale correction for the source GLB. Most exports are meter-scale; some are centimeter-scale. */
  modelScale?: number;
  /** Procedural behavior layer used when the GLB has no embedded animation. */
  behavior: PerformerBehavior;
  /** 3D coords in the R3F office, units ≈ meters. y=0 is the floor. */
  desk3D: {
    position: [number, number, number];
    /** Rotation around Y axis in radians — which way they face. */
    rotationY: number;
    pose: DeskPose;
  };
  /** When Reel has pre-rendered a voice sample, it lives here. */
  voiceSampleUrl?: string;
}

/**
 * Room layout (top-down, +Z is "back of room", -Z is "entry"):
 *
 *                         +Z (back wall / windows)
 *     server_rack       monitor_wall        brand_vault
 *   [Kite,Talon]        [Vex,Rune]         [Palette]
 *        +8                  0                  -8
 *        |                   |                   |
 *  ------+-------------------+-------------------+------ X
 *        |                   |                   |
 *    terminal            COUNCIL              library
 *    [Oracle,Axiom]      [Compass,Hydra]     [Nyx,Cipher]
 *        +8                  0                  -8
 *        |                   |                   |
 *  ------+-------------------+-------------------+------
 *        |                   |                   |
 *     balcony             entry               couch
 *    [Ghost]             (door)              [Reel]
 *        +8                  0                  -8
 *                         -Z (door / scanlines)
 */
export const PERFORMERS: PerformerSpec[] = [
  // ---- Founders ------------------------------------------------------------
  {
    slug: "ghost",
    voiceId: "pNInz6obpgDQGcFmaJgB", // Adam — deep, measured, authoritative
    voiceSettings: { stability: 0.55, similarityBoost: 0.8, style: 0.1, useSpeakerBoost: true },
    signatureLine:
      "Dev Lab is online. Every decision routes through the Council. Every ship date routes through me. Let's get to work.",
    voiceOver:
      "This is CyberTrader: Age of Pantheon. A cyberpunk trading simulator. Built by two humans and twelve AI operators. Welcome to the lab.",
    glbModelPath: "/GLB_Assets/Avatar_ghost.glb",
    behavior: "idle",
    desk3D: { position: [6.5, 0, 4.5], rotationY: -Math.PI / 2, pose: "stand" },
    voiceSampleUrl: "/voices/ghost.mp3",
  },
  {
    slug: "zoro",
    voiceId: "ErXwobaYiN019PkySvjV", // Antoni — warm, grounded, kind
    voiceSettings: { stability: 0.5, similarityBoost: 0.78, style: 0.2, useSpeakerBoost: true },
    signatureLine:
      "I'm Zoro. I shape the signal until it feels right. If the office doesn't hum like the game, we keep cutting.",
    voiceOver:
      "The whiteboard is where the work lives. The Council is where the work gets approved. And Reel cuts an explainer every time we ship something real. Come on — pick up a marker.",
    glbModelPath: "/GLB_Assets/Avatar_zoro.glb",
    behavior: "whiteboard",
    desk3D: { position: [-5.8, 0, 3.4], rotationY: Math.PI / 4, pose: "whiteboard" },
    voiceSampleUrl: "/voices/zoro.mp3",
  },

  // ---- OpenClaw living agents --------------------------------------------
  {
    slug: "zara",
    voiceId: "EXAVITQu4vr4xnSDxMaL",
    voiceSettings: { stability: 0.62, similarityBoost: 0.76, style: 0.18, useSpeakerBoost: true },
    signatureLine:
      "Zara on zyra-mini. Asset queue is local, persistent, and ready for Blender or GLB compression jobs.",
    voiceOver:
      "I handle the heavy local work: mesh cleanup, LOD passes, render queues, and long-running file operations outside the chat window.",
    glbModelPath: "/GLB_Assets/Avatar_zara.glb",
    behavior: "node_watch",
    desk3D: { position: [6.8, 0, -4.6], rotationY: -Math.PI / 2, pose: "terminal" },
  },
  {
    slug: "zyra",
    voiceId: "AZnzlk1HyTAKdt0Isr3o",
    voiceSettings: { stability: 0.58, similarityBoost: 0.77, style: 0.2, useSpeakerBoost: true },
    signatureLine:
      "Zyra online. Heartbeat watchers are staged; Tailscale route resolves through ssh zyra-mini.",
    voiceOver:
      "I watch the node, the crons, the asset folder, and the preview sync path. If the lab keeps breathing, I am in the loop.",
    glbModelPath: "/GLB_Assets/Avatar_Zyra.glb",
    behavior: "node_watch",
    desk3D: { position: [5.6, 0, -5.6], rotationY: -Math.PI / 2, pose: "terminal" },
  },

  // ---- AI agents -----------------------------------------------------------
  {
    slug: "nyx",
    voiceId: "EXAVITQu4vr4xnSDxMaL", // Bella — smooth, analytical
    voiceSettings: { stability: 0.65, similarityBoost: 0.75 },
    signatureLine:
      "Every mechanic begins as a constraint. Tell me what must not happen, and I'll tell you the game you actually want to build.",
    glbModelPath: "/GLB_Assets/Avatar_1.glb",
    modelScale: 0.011,
    behavior: "council",
    desk3D: { position: [-6.5, 0, -0.6], rotationY: Math.PI / 2, pose: "sit" },
  },
  {
    slug: "vex",
    voiceId: "jsCqWAovK2LkecY7zXl4", // Freya — sharp, fast, stylized
    voiceSettings: { stability: 0.45, similarityBoost: 0.7, style: 0.35 },
    signatureLine:
      "Pixel-grid or bust. If it breathes, it's alive. If it's static, it's dead. Diegetic UI — every element belongs to the world.",
    glbModelPath: "/GLB_Assets/Avatar_2.glb",
    behavior: "typing",
    desk3D: { position: [-2.2, 0, -4.9], rotationY: 0, pose: "sit" },
  },
  {
    slug: "rune",
    voiceId: "onwK4e9ZLuTAKqWW03F9", // Daniel — clean, calm, technical
    voiceSettings: { stability: 0.7, similarityBoost: 0.75 },
    signatureLine:
      "Portrait-first. Fifty-eight frames per second on a three-year-old Android. If we can't do that, we haven't built it right.",
    glbModelPath: "/GLB_Assets/Avatar_3.glb",
    modelScale: 0.011,
    behavior: "typing",
    desk3D: { position: [1.7, 0, -5.1], rotationY: 0, pose: "sit" },
  },
  {
    slug: "kite",
    voiceId: "TxGEqnHWrfWFTfGW9XjX", // Josh — cold, pragmatic
    voiceSettings: { stability: 0.6, similarityBoost: 0.75 },
    signatureLine:
      "Row-level security on every table. Client-side math is a suggestion. The server is the source of truth.",
    glbModelPath: "/GLB_Assets/Avatar_4.glb",
    behavior: "typing",
    desk3D: { position: [4.8, 0, -3.2], rotationY: -Math.PI / 2, pose: "terminal" },
  },
  {
    slug: "oracle",
    voiceId: "AZnzlk1HyTAKdt0Isr3o", // Domi — measured, numerical
    voiceSettings: { stability: 0.6, similarityBoost: 0.75, style: 0.15 },
    signatureLine:
      "The price engine is deterministic. Same seed in, same market out. If your simulation drifts, you broke the seed — not the market.",
    glbModelPath: "/GLB_Assets/Avatar_5.glb",
    behavior: "typing",
    desk3D: { position: [5.4, 0, 0.2], rotationY: -Math.PI / 2, pose: "terminal" },
  },
  {
    slug: "reel",
    voiceId: "ThT5KcBeYPX3keUQqHPh", // Dorothy — warm, narrative, cinematic
    voiceSettings: { stability: 0.55, similarityBoost: 0.8, style: 0.3 },
    signatureLine:
      "Every shipped feature earns a ninety-second explainer. Remotion cuts them, HeyGen lip-syncs them, Zoro watches them.",
    voiceOver:
      "Chapter one. A neon city at night. A trader with a cyberdeck slung across her back. The S1LKROAD hums beneath her feet. Fade in.",
    glbModelPath: "/GLB_Assets/Avatar_6.glb",
    behavior: "idle",
    desk3D: { position: [-5.8, 0, -4.8], rotationY: Math.PI / 3, pose: "couch" },
    voiceSampleUrl: "/voices/reel.mp3",
  },
  {
    slug: "palette",
    voiceId: "VR6AwCw3zZJkcBX1RvTl", // Arnold — confident, crafted
    voiceSettings: { stability: 0.5, similarityBoost: 0.8, style: 0.25 },
    signatureLine:
      "Cyan is structure. Acid is action. Violet is lore — nothing else. If your button glows violet, you broke the contract.",
    glbModelPath: "/GLB_Assets/Avatar_7.glb",
    behavior: "typing",
    desk3D: { position: [-6.2, 0, 2.2], rotationY: Math.PI / 2, pose: "sit" },
  },
  {
    slug: "cipher",
    voiceId: "oWAxZDx7w5VEj9dCyTzz", // Grace — curious, archival
    voiceSettings: { stability: 0.65, similarityBoost: 0.75 },
    signatureLine:
      "I don't guess. I fetch. Point me at a library, an API, a claim — I'll read the docs before you ship anything against it.",
    glbModelPath: "/GLB_Assets/Avatar_8.glb",
    behavior: "council",
    desk3D: { position: [-5.2, 0, 0.7], rotationY: Math.PI / 2, pose: "couch" },
  },
  {
    slug: "axiom",
    voiceId: "N2lVS1w4EtoT3dr4eOWO", // Callum — rigid, precise
    voiceSettings: { stability: 0.75, similarityBoost: 0.7 },
    signatureLine:
      "Ten-thousand-seed replay harness. Green at merge, green at ship, or the release does not exit staging.",
    glbModelPath: "/GLB_Assets/Avatar_9.glb",
    behavior: "walk",
    desk3D: { position: [2.4, 0, 2.5], rotationY: -Math.PI / 2, pose: "patrol" },
  },
  {
    slug: "compass",
    voiceId: "MF3mGyEYCl7XYWbV9V6O", // Elli — clear, orchestral
    voiceSettings: { stability: 0.7, similarityBoost: 0.75 },
    signatureLine:
      "Phase A: foundation. Phase B: immersion. Phase 1 through 5: the game. Today you're in Phase B — and we're actually on schedule.",
    glbModelPath: "/GLB_Assets/Avatar_10.glb",
    behavior: "council",
    desk3D: { position: [0, 0, 1.2], rotationY: 0, pose: "stand" },
    voiceSampleUrl: "/voices/compass.mp3",
  },
  {
    slug: "talon",
    voiceId: "IKne3meq5aSn9XLyUdCD", // Charlie — mechanical, restrained
    voiceSettings: { stability: 0.8, similarityBoost: 0.65 },
    signatureLine:
      "Long-running. Non-blocking. The cron rack is mine. If it needs to run at three AM, it's already armed.",
    glbModelPath: "/GLB_Assets/Avatar_11.glb",
    behavior: "node_watch",
    desk3D: { position: [7.4, 0, -2.6], rotationY: -Math.PI / 2, pose: "terminal" },
  },
  {
    slug: "hydra",
    voiceId: "D38z5RcWu1voky8WS1ja", // Fin — plural, swarm-y, layered
    voiceSettings: { stability: 0.4, similarityBoost: 0.7, style: 0.4 },
    signatureLine:
      "We are eight synthetic traders today. We are also one Hydra. The market simulation is live — step into the mesh, watch the order book breathe.",
    glbModelPath: "/GLB_Assets/Avatar_1.glb",
    modelScale: 0.011,
    behavior: "council",
    desk3D: { position: [1.6, 0, -0.6], rotationY: Math.PI, pose: "sit" },
  },
];

export const PERFORMER_BY_SLUG: Record<string, PerformerSpec> = Object.fromEntries(
  PERFORMERS.map((p) => [p.slug, p]),
);
