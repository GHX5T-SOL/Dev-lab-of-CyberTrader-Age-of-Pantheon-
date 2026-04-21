/**
 * Avatar generation spec per character.
 *
 * We have two generation paths:
 *
 *   1. SpriteCook MCP (Phase A/B, fastest, deterministic).
 *      - Produces a 1024×1536 portrait PNG on a transparent background.
 *      - Style: hyperrealistic anime / cyberpunk penthouse residents.
 *      - Output path: /web/public/brand/avatars/<slug>.png
 *
 *   2. Local GLB + React Three Fiber (Phase B+, true 3D, animated).
 *      - Phase B uses local .glb files from /public/GLB_Assets.
 *      - Idle loops + ambient gestures are procedural until retargeted clips land.
 *
 * For Phase A the UI falls back to initial-block placeholders when the PNG
 * is missing. No broken images.
 */

export interface AvatarSpec {
  slug: string;
  displayName: string;
  /** Short, on-brand prompt handed to SpriteCook.generate_game_art. */
  spriteCookPrompt: string;
  /** Phase B animation rig pose name (from the R3F scene). */
  animPose: "standing" | "sitting_desk" | "whiteboard" | "terminal" | "patrol" | "couch";
  /** What station in the office this character is anchored to. */
  anchor:
    | "entry"
    | "whiteboard"
    | "calendar"
    | "monitor_wall"
    | "brand_vault"
    | "terminal"
    | "library"
    | "couch"
    | "server_room"
    | "balcony"
    | "council_table";
}

export const AVATAR_SPECS: AvatarSpec[] = [
  {
    slug: "ghost",
    displayName: "Ghost",
    spriteCookPrompt:
      "Hyperrealistic anime portrait, cyberpunk penthouse resident. Male figure in black hoodie with neon-cyan reactive piping. Face hidden behind a sleek skull-mask face-plate — matte black with subtle holographic etchings, no visible eyes. A slung futuristic rifle across the back, carbon-fibre stock. Posture: relaxed, hands in hoodie pockets. Lighting: cyan rim-light from left, violet ambient from behind. Background: transparent. Half-body, centred, head room at top. 2077 neo-Tokyo palette. No external IP.",
    animPose: "standing",
    anchor: "entry",
  },
  {
    slug: "zoro",
    displayName: "Zoro",
    spriteCookPrompt:
      "Hyperrealistic anime portrait, cyberpunk neo-hacker swordsman. Male figure, green head-wrap covering hair, short utilitarian black jacket with acid-green seams, wired gloves. Cyber-katana sheathed across the back — chrome scabbard with a pulse-cyan handguard. Posture: confident, one hand resting on the katana grip. Expression: alert, direct. Lighting: acid-green rim from right, warm amber from below. Background: transparent. Half-body, centred. No external IP.",
    animPose: "whiteboard",
    anchor: "whiteboard",
  },
  {
    slug: "zara",
    displayName: "Zara",
    spriteCookPrompt:
      "Hyperrealistic anime portrait, OpenClaw asset-ops agent. Female cyberpunk operator in matte carbon gear, violet signal cable looped around one arm, standing beside a local server rack and GLB asset queue. Expression: calm, precise. Lighting: violet rim with cyan diagnostic glow. Background: transparent. Half-body, centered. No external IP.",
    animPose: "terminal",
    anchor: "server_room",
  },
  {
    slug: "zyra",
    displayName: "Zyra",
    spriteCookPrompt:
      "Hyperrealistic anime portrait, OpenClaw node-watch agent. Female holographic operations specialist with acid-green diagnostic panels orbiting her shoulders, one hand over a heartbeat monitor. Expression: alert and focused. Lighting: acid-green rim, cyan fill, violet backlight. Background: transparent. Half-body, centered. No external IP.",
    animPose: "terminal",
    anchor: "server_room",
  },
  {
    slug: "nyx",
    displayName: "Nyx",
    spriteCookPrompt:
      "Hyperrealistic anime portrait, game-designer operator. Androgynous, silver-white chin-length hair, mirror-silver contact lenses. Simple graphite turtleneck, a single glowing rule-card spinning in the air beside their right shoulder (like a projected UI card). Background: transparent. Lighting: violet top, cool cyan fill. Expression: analytical, half-smile. Half-body.",
    animPose: "sitting_desk",
    anchor: "library",
  },
  {
    slug: "vex",
    displayName: "Vex",
    spriteCookPrompt:
      "Hyperrealistic anime portrait, UI/UX punk designer. Female figure, dark hair with hot-pink and cyan tipped braids, cybernetic forearm rig ending in a wired stylus. Three faint holographic canvases floating around her. Wearing a cropped utility vest over a mesh top. Lighting: heat-red rim left, cyan fill right. Background: transparent. Half-body.",
    animPose: "sitting_desk",
    anchor: "monitor_wall",
  },
  {
    slug: "rune",
    displayName: "Rune",
    spriteCookPrompt:
      "Hyperrealistic anime portrait, mobile-frontend engineer. Non-binary, minimalist black tech-wear with a pocket holo-tablet clipped to the chest. Short dark hair, concentrated expression. Sleeve rolled up showing an unobtrusive circuit-tattoo. Background: transparent. Lighting: cyan fill, low warm rim. Half-body.",
    animPose: "sitting_desk",
    anchor: "monitor_wall",
  },
  {
    slug: "kite",
    displayName: "Kite",
    spriteCookPrompt:
      "Hyperrealistic anime portrait, backend + web3 engineer. Male figure, leather jacket with solana-motif metallic stamps on the lapels, short beard, chrome ring on index finger. Cold pragmatic expression. RLS-policy sticky notes visible as faint holograms in the background. Lighting: acid-green rim, cool fill. Background: transparent. Half-body.",
    animPose: "terminal",
    anchor: "server_room",
  },
  {
    slug: "oracle",
    displayName: "Oracle",
    spriteCookPrompt:
      "Hyperrealistic anime portrait, economy + market-sim operator. Female figure, one forearm covered in inked candlestick charts (tattoo style), black fitted tech-shirt. A holographic price graph wraps her shoulder. Expression: focused, calm. Background: transparent. Lighting: amber top, violet fill. Half-body.",
    animPose: "terminal",
    anchor: "terminal",
  },
  {
    slug: "reel",
    displayName: "Reel",
    spriteCookPrompt:
      "Hyperrealistic anime portrait, cinematic animator. Non-binary, vintage film-loader pendant around the neck, worn bomber jacket with paint marks. Storyboard frames drawn in the air around them. Background: transparent. Lighting: violet rim, cyan fill. Half-body.",
    animPose: "couch",
    anchor: "couch",
  },
  {
    slug: "palette",
    displayName: "Palette",
    spriteCookPrompt:
      "Hyperrealistic anime portrait, brand and asset lead. Male figure, paint-stained gloves, three spray-can holsters on the belt, a tag-book on a carabiner at the hip. Short dreaded hair, wearing a utility apron over tech-wear. Expression: focused, one eyebrow up. Background: transparent. Lighting: heat-red rim, acid-green fill. Half-body.",
    animPose: "sitting_desk",
    anchor: "brand_vault",
  },
  {
    slug: "cipher",
    displayName: "Cipher",
    spriteCookPrompt:
      "Hyperrealistic anime portrait, research operator. Female figure, round tinted glasses, shoulder bag full of zine-like field manuals, stack of open tabs visible as faint holograms behind her. Simple dark hoodie. Expression: curious, mid-read. Background: transparent. Lighting: amber fill, cyan accent. Half-body.",
    animPose: "couch",
    anchor: "library",
  },
  {
    slug: "axiom",
    displayName: "Axiom",
    spriteCookPrompt:
      "Hyperrealistic anime portrait, QA operator. Male figure, stopwatch tattoo on the wrist, high-contrast black-and-white tech-wear, thin-framed glasses. Posture: rigid, hands clasped. Faint grid lines on the floor suggesting his 45-degree movement pattern. Background: transparent. Lighting: cool cyan, low heat fill. Half-body.",
    animPose: "patrol",
    anchor: "terminal",
  },
  {
    slug: "compass",
    displayName: "Compass",
    spriteCookPrompt:
      "Hyperrealistic anime portrait, project manager. Female figure, antique-looking brass pocket-watch clipped to the belt, laser-pointer staff held casually, a clipboard with swim-lane diagrams. Calm authority. Short dark hair, minimalist earrings. Background: transparent. Lighting: cyan rim, warm fill. Half-body.",
    animPose: "whiteboard",
    anchor: "council_table",
  },
  {
    slug: "talon",
    displayName: "Talon",
    spriteCookPrompt:
      "Hyperrealistic anime portrait, OpenClaw long-running executor. Heavy-build figure, right arm is a claw-glove rig with extra actuators, single indicator LED on the shoulder. Hooded jumpsuit in matte black. Expression: impassive. Background: transparent. Lighting: amber LED pulse, cool fill. Half-body.",
    animPose: "terminal",
    anchor: "server_room",
  },
  {
    slug: "hydra",
    displayName: "Hydra",
    spriteCookPrompt:
      "Hyperrealistic anime portrait, ElizaOS swarm operator. Figure partially obscured — a five-head holographic projection floats around a single seated operator. Each holo-head has a distinct accessory (trader's visor, analyst's glasses, etc.). Operator wears a simple dark tech-hood. Background: transparent. Lighting: violet cascade, cool fill. Half-body.",
    animPose: "sitting_desk",
    anchor: "council_table",
  },
];

/** For the Phase B R3F scene — which pose idles at which anchor. */
export const ANCHOR_POSITIONS: Record<AvatarSpec["anchor"], [number, number, number]> = {
  entry: [0, 0, 4],
  whiteboard: [-3, 0, 0],
  calendar: [3, 0, 0],
  monitor_wall: [0, 0, -4],
  brand_vault: [-5, 0, -2],
  terminal: [5, 0, -2],
  library: [-4, 0, 3],
  couch: [2, 0, 3],
  server_room: [6, 0, -4],
  balcony: [0, 0, 6],
  council_table: [0, 0, -2],
};
