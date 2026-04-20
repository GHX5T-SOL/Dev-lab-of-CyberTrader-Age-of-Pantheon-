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
 *   - rpmAvatarUrl: Ready Player Me .glb for the 3D scene (optional —
 *     until set, the scene uses a low-poly stand-in in the character's accent)
 *   - voiceSampleUrl: pre-rendered MP3 in /public/voices/<slug>.mp3
 *     (when present, the scene plays this file; when absent, it falls through
 *     to POST /api/voice/speak which streams from ElevenLabs live)
 *
 * Voice IDs are ElevenLabs' stable public "v2" voices. Swap any of them for
 * your own cloned voices by replacing voiceId with the cloned-voice asset id.
 * See: https://api.elevenlabs.io/v1/voices (auth required).
 */

export type DeskPose = "sit" | "stand" | "patrol" | "couch" | "whiteboard" | "terminal";

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
  /** Ready Player Me avatar glTF url. When unset, scene uses stand-in. */
  rpmAvatarUrl?: string;
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
    desk3D: { position: [8, 0, 6], rotationY: -Math.PI / 2, pose: "stand" },
    voiceSampleUrl: "/voices/ghost.mp3",
  },
  {
    slug: "zoro",
    voiceId: "ErXwobaYiN019PkySvjV", // Antoni — warm, grounded, kind
    voiceSettings: { stability: 0.5, similarityBoost: 0.78, style: 0.2, useSpeakerBoost: true },
    signatureLine:
      "I'm Zoro. I take tasks off the whiteboard and push PRs. If it's not on the board, it doesn't exist yet — add it, then we build it.",
    voiceOver:
      "The whiteboard is where the work lives. The Council is where the work gets approved. And Reel cuts an explainer every time we ship something real. Come on — pick up a marker.",
    desk3D: { position: [-6, 0, 4], rotationY: Math.PI / 4, pose: "whiteboard" },
    voiceSampleUrl: "/voices/zoro.mp3",
  },

  // ---- AI agents -----------------------------------------------------------
  {
    slug: "nyx",
    voiceId: "EXAVITQu4vr4xnSDxMaL", // Bella — smooth, analytical
    voiceSettings: { stability: 0.65, similarityBoost: 0.75 },
    signatureLine:
      "Every mechanic begins as a constraint. Tell me what must not happen, and I'll tell you the game you actually want to build.",
    desk3D: { position: [-8, 0, 0], rotationY: Math.PI / 2, pose: "sit" },
  },
  {
    slug: "vex",
    voiceId: "jsCqWAovK2LkecY7zXl4", // Freya — sharp, fast, stylized
    voiceSettings: { stability: 0.45, similarityBoost: 0.7, style: 0.35 },
    signatureLine:
      "Pixel-grid or bust. If it breathes, it's alive. If it's static, it's dead. Diegetic UI — every element belongs to the world.",
    desk3D: { position: [-2, 0, -6], rotationY: 0, pose: "sit" },
  },
  {
    slug: "rune",
    voiceId: "onwK4e9ZLuTAKqWW03F9", // Daniel — clean, calm, technical
    voiceSettings: { stability: 0.7, similarityBoost: 0.75 },
    signatureLine:
      "Portrait-first. Fifty-eight frames per second on a three-year-old Android. If we can't do that, we haven't built it right.",
    desk3D: { position: [2, 0, -6], rotationY: 0, pose: "sit" },
  },
  {
    slug: "kite",
    voiceId: "TxGEqnHWrfWFTfGW9XjX", // Josh — cold, pragmatic
    voiceSettings: { stability: 0.6, similarityBoost: 0.75 },
    signatureLine:
      "Row-level security on every table. Client-side math is a suggestion. The server is the source of truth.",
    desk3D: { position: [8, 0, -6], rotationY: -Math.PI / 2, pose: "terminal" },
  },
  {
    slug: "oracle",
    voiceId: "AZnzlk1HyTAKdt0Isr3o", // Domi — measured, numerical
    voiceSettings: { stability: 0.6, similarityBoost: 0.75, style: 0.15 },
    signatureLine:
      "The price engine is deterministic. Same seed in, same market out. If your simulation drifts, you broke the seed — not the market.",
    desk3D: { position: [8, 0, 0], rotationY: -Math.PI / 2, pose: "terminal" },
  },
  {
    slug: "reel",
    voiceId: "ThT5KcBeYPX3keUQqHPh", // Dorothy — warm, narrative, cinematic
    voiceSettings: { stability: 0.55, similarityBoost: 0.8, style: 0.3 },
    signatureLine:
      "Every shipped feature earns a ninety-second explainer. Remotion cuts them, HeyGen lip-syncs them, Zoro watches them.",
    voiceOver:
      "Chapter one. A neon city at night. A trader with a cyberdeck slung across her back. The S1LKROAD hums beneath her feet. Fade in.",
    desk3D: { position: [-8, 0, -6], rotationY: Math.PI / 3, pose: "couch" },
    voiceSampleUrl: "/voices/reel.mp3",
  },
  {
    slug: "palette",
    voiceId: "VR6AwCw3zZJkcBX1RvTl", // Arnold — confident, crafted
    voiceSettings: { stability: 0.5, similarityBoost: 0.8, style: 0.25 },
    signatureLine:
      "Cyan is structure. Acid is action. Violet is lore — nothing else. If your button glows violet, you broke the contract.",
    desk3D: { position: [-8, 0, -4], rotationY: Math.PI / 2, pose: "sit" },
  },
  {
    slug: "cipher",
    voiceId: "oWAxZDx7w5VEj9dCyTzz", // Grace — curious, archival
    voiceSettings: { stability: 0.65, similarityBoost: 0.75 },
    signatureLine:
      "I don't guess. I fetch. Point me at a library, an API, a claim — I'll read the docs before you ship anything against it.",
    desk3D: { position: [-6, 0, -2], rotationY: Math.PI / 2, pose: "couch" },
  },
  {
    slug: "axiom",
    voiceId: "N2lVS1w4EtoT3dr4eOWO", // Callum — rigid, precise
    voiceSettings: { stability: 0.75, similarityBoost: 0.7 },
    signatureLine:
      "Ten-thousand-seed replay harness. Green at merge, green at ship, or the release does not exit staging.",
    desk3D: { position: [6, 0, 2], rotationY: -Math.PI / 2, pose: "patrol" },
  },
  {
    slug: "compass",
    voiceId: "MF3mGyEYCl7XYWbV9V6O", // Elli — clear, orchestral
    voiceSettings: { stability: 0.7, similarityBoost: 0.75 },
    signatureLine:
      "Phase A: foundation. Phase B: immersion. Phase 1 through 5: the game. Today you're in Phase B — and we're actually on schedule.",
    desk3D: { position: [0, 0, 0], rotationY: 0, pose: "stand" },
    voiceSampleUrl: "/voices/compass.mp3",
  },
  {
    slug: "talon",
    voiceId: "IKne3meq5aSn9XLyUdCD", // Charlie — mechanical, restrained
    voiceSettings: { stability: 0.8, similarityBoost: 0.65 },
    signatureLine:
      "Long-running. Non-blocking. The cron rack is mine. If it needs to run at three AM, it's already armed.",
    desk3D: { position: [6, 0, -6], rotationY: -Math.PI / 2, pose: "terminal" },
  },
  {
    slug: "hydra",
    voiceId: "D38z5RcWu1voky8WS1ja", // Fin — plural, swarm-y, layered
    voiceSettings: { stability: 0.4, similarityBoost: 0.7, style: 0.4 },
    signatureLine:
      "We are eight synthetic traders today. We are also one Hydra. The market simulation is live — step into the mesh, watch the order book breathe.",
    desk3D: { position: [1.5, 0, 0.5], rotationY: Math.PI, pose: "sit" },
  },
];

export const PERFORMER_BY_SLUG: Record<string, PerformerSpec> = Object.fromEntries(
  PERFORMERS.map((p) => [p.slug, p]),
);
