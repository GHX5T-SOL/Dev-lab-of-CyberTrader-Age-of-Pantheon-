import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop } from "../shared/Backdrop";
import { BRAND, FONT_DISPLAY, FONT_MONO } from "../shared/brand";

/**
 * AI COUNCIL — 26s / 780 frames @ 30fps
 * Narration: voices/narration-council.mp3 (Compass, ~26s)
 *
 * Timeline:
 *   0 → 90     Title ("THE COUNCIL")
 *  90 → 390    Rotating circle of 12 operators
 * 390 → 630    Flow diagram (Ghost+Zoro → Council → Outputs)
 * 630 → 780    Three non-negotiable principles + URL
 */

export const COUNCIL_FPS = 30;
export const COUNCIL_DURATION = 780;

const MEMBERS: { slug: string; name: string; role: string; rune: string }[] = [
  { slug: "compass", name: "COMPASS", role: "Chair", rune: "⚓" },
  { slug: "axiom", name: "AXIOM", role: "Markets", rune: "◇" },
  { slug: "hexa", name: "HEXA", role: "Systems", rune: "◎" },
  { slug: "prism", name: "PRISM", role: "UI/UX", rune: "△" },
  { slug: "echo", name: "ECHO", role: "Motion", rune: "≈" },
  { slug: "forge", name: "FORGE", role: "Repo", rune: "⚒" },
  { slug: "mnemo", name: "MNEMO", role: "Memory", rune: "∞" },
  { slug: "vector", name: "VECTOR", role: "Economy", rune: "→" },
  { slug: "halo", name: "HALO", role: "Live Ops", rune: "○" },
  { slug: "oracle", name: "ORACLE", role: "Lore", rune: "◉" },
  { slug: "signal", name: "SIGNAL", role: "Brand", rune: "♆" },
  { slug: "reel", name: "REEL", role: "Cinema", rune: "▷" },
];

const PRINCIPLES = [
  "Consult first. Ship second.",
  "Verify before risky moves.",
  "Newbie-friendly, pro-quality.",
];

// ─────────────────────────────────────────────────────────────────────────────
// Section A — Title (0..90)
// ─────────────────────────────────────────────────────────────────────────────

const CouncilTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = spring({ frame: frame - 4, fps, config: { damping: 14 } });
  const subAppear = spring({ frame: frame - 26, fps, config: { damping: 18 } });
  const taglineAppear = spring({ frame: frame - 40, fps, config: { damping: 22 } });

  const sectionFade = interpolate(frame, [0, 15, 70, 90], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 22,
        opacity: sectionFade,
      }}
    >
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 26,
          letterSpacing: 10,
          color: BRAND.violet,
          opacity: subAppear,
        }}
      >
        CHAPTER 01
      </div>
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 180,
          fontWeight: 900,
          color: BRAND.chrome,
          letterSpacing: -6,
          opacity: appear,
          transform: `scale(${0.9 + appear * 0.1})`,
          textShadow: `0 0 60px ${BRAND.violet}aa, 0 0 20px ${BRAND.cyan}55`,
        }}
      >
        THE COUNCIL
      </div>
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 34,
          color: BRAND.dust,
          opacity: taglineAppear,
        }}
      >
        Twelve operators. One chair. One mission.
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Section B — Circle of Twelve (0..300)
// ─────────────────────────────────────────────────────────────────────────────

const CircleOfTwelve: React.FC<{ members: typeof MEMBERS }> = ({ members }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const zoom = interpolate(frame, [0, 70], [0.55, 1], { extrapolateRight: "clamp" });
  const rot = interpolate(frame, [0, 300], [0, 0.85]);

  const sectionFade = interpolate(frame, [0, 20, 280, 300], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cx = 960;
  const cy = 540;
  const r = 340;

  return (
    <AbsoluteFill style={{ opacity: sectionFade }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1920,
          height: 1080,
          transform: `scale(${zoom})`,
          transformOrigin: "center",
        }}
      >
        {/* center emblem */}
        <div
          style={{
            position: "absolute",
            left: cx - 110,
            top: cy - 110,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${BRAND.violet}55 0%, transparent 70%)`,
            border: `2px solid ${BRAND.violet}aa`,
            boxShadow: `0 0 80px ${BRAND.violet}88, inset 0 0 40px ${BRAND.violet}44`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 13,
              letterSpacing: 6,
              color: BRAND.cyan,
            }}
          >
            QUORUM
          </div>
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 56,
              fontWeight: 900,
              color: BRAND.chrome,
              letterSpacing: -2,
            }}
          >
            12 / 12
          </div>
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 12,
              letterSpacing: 4,
              color: BRAND.dust,
            }}
          >
            AI COUNCIL
          </div>
        </div>

        {members.map((m, i) => {
          const angle = (i / members.length) * Math.PI * 2 + rot + Math.PI / 2;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          const delay = 20 + i * 4;
          const appear = spring({ frame: frame - delay, fps, config: { damping: 16 } });
          return (
            <div
              key={m.slug}
              style={{
                position: "absolute",
                left: x - 82,
                top: y - 82,
                width: 164,
                height: 164,
                opacity: appear,
                transform: `scale(${0.4 + appear * 0.6})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 14,
                background: `linear-gradient(160deg, ${BRAND.violet}2a 0%, ${BRAND.ink} 100%)`,
                border: `1px solid ${BRAND.violet}88`,
                boxShadow: `0 0 24px ${BRAND.violet}44`,
                gap: 4,
              }}
            >
              <div
                style={{
                  fontSize: 34,
                  color: BRAND.cyan,
                  fontFamily: FONT_DISPLAY,
                  lineHeight: 1,
                }}
              >
                {m.rune}
              </div>
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 22,
                  fontWeight: 800,
                  color: BRAND.chrome,
                  letterSpacing: -0.5,
                }}
              >
                {m.name}
              </div>
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 12,
                  letterSpacing: 2,
                  color: BRAND.dust,
                }}
              >
                {m.role}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Section C — Flow diagram (0..240)
// ─────────────────────────────────────────────────────────────────────────────

const FlowDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const nodes = [
    { x: 300, y: 540, label: "GHOST + ZORO", color: BRAND.cyan, delay: 0 },
    { x: 780, y: 540, label: "AI COUNCIL", color: BRAND.violet, delay: 30 },
    { x: 1360, y: 300, label: "12 OPERATORS", color: BRAND.amber, delay: 60 },
    { x: 1360, y: 540, label: "SHIP COMMITS", color: BRAND.acid, delay: 75 },
    { x: 1360, y: 780, label: "LIVE OPS", color: BRAND.heat, delay: 90 },
  ];

  const sectionFade = interpolate(frame, [0, 20, 220, 240], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: sectionFade }}>
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT_MONO,
          fontSize: 22,
          letterSpacing: 8,
          color: BRAND.dust,
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        HOW WORK FLOWS
      </div>

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line
          x1={440}
          y1={540}
          x2={640}
          y2={540}
          stroke={BRAND.violet}
          strokeWidth={2}
          strokeDasharray="6 6"
          opacity={interpolate(frame, [20, 50], [0, 0.9], { extrapolateRight: "clamp" })}
        />
        <line
          x1={920}
          y1={540}
          x2={1220}
          y2={300}
          stroke={BRAND.amber}
          strokeWidth={2}
          strokeDasharray="6 6"
          opacity={interpolate(frame, [50, 80], [0, 0.9], { extrapolateRight: "clamp" })}
        />
        <line
          x1={920}
          y1={540}
          x2={1220}
          y2={540}
          stroke={BRAND.acid}
          strokeWidth={2}
          strokeDasharray="6 6"
          opacity={interpolate(frame, [65, 95], [0, 0.9], { extrapolateRight: "clamp" })}
        />
        <line
          x1={920}
          y1={540}
          x2={1220}
          y2={780}
          stroke={BRAND.heat}
          strokeWidth={2}
          strokeDasharray="6 6"
          opacity={interpolate(frame, [80, 110], [0, 0.9], { extrapolateRight: "clamp" })}
        />
      </svg>

      {nodes.map((n) => {
        const appear = spring({ frame: frame - n.delay, fps, config: { damping: 16 } });
        return (
          <div
            key={n.label}
            style={{
              position: "absolute",
              left: n.x - 140,
              top: n.y - 50,
              width: 280,
              height: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: appear,
              transform: `scale(${0.8 + appear * 0.2})`,
              borderRadius: 14,
              background: `linear-gradient(160deg, ${n.color}22 0%, ${BRAND.ink} 100%)`,
              border: `1.5px solid ${n.color}aa`,
              boxShadow: `0 0 30px ${n.color}55`,
              fontFamily: FONT_DISPLAY,
              fontSize: 24,
              fontWeight: 800,
              color: BRAND.chrome,
              letterSpacing: 0.5,
              textAlign: "center",
            }}
          >
            {n.label}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Section D — Principles + outro (0..150)
// ─────────────────────────────────────────────────────────────────────────────

const PrinciplesOutro: React.FC<{ principles: typeof PRINCIPLES }> = ({ principles }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerAppear = spring({ frame, fps, config: { damping: 18 } });
  const urlOpacity = interpolate(frame, [100, 130], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 30,
      }}
    >
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 22,
          letterSpacing: 8,
          color: BRAND.violet,
          opacity: headerAppear,
        }}
      >
        THREE NON-NEGOTIABLES
      </div>
      {principles.map((p, i) => {
        const delay = 8 + i * 22;
        const appear = spring({ frame: frame - delay, fps, config: { damping: 16 } });
        return (
          <div
            key={i}
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 60,
              fontWeight: 700,
              color: BRAND.chrome,
              letterSpacing: -1,
              opacity: appear,
              transform: `translateY(${(1 - appear) * 20}px)`,
              textShadow: `0 0 20px ${BRAND.cyan}33`,
            }}
          >
            {p}
          </div>
        );
      })}
      <div
        style={{
          marginTop: 30,
          fontFamily: FONT_MONO,
          fontSize: 20,
          letterSpacing: 6,
          color: BRAND.dust,
          opacity: urlOpacity,
        }}
      >
        cybertrader.app / council
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Root composition
// ─────────────────────────────────────────────────────────────────────────────

export const AICouncil: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BRAND.void }}>
      <Backdrop hue="violet" />
      <Audio src={staticFile("voices/narration-council.mp3")} />

      <Sequence from={0} durationInFrames={90}>
        <CouncilTitle />
      </Sequence>
      <Sequence from={90} durationInFrames={300}>
        <CircleOfTwelve members={MEMBERS} />
      </Sequence>
      <Sequence from={390} durationInFrames={240}>
        <FlowDiagram />
      </Sequence>
      <Sequence from={630} durationInFrames={150}>
        <PrinciplesOutro principles={PRINCIPLES} />
      </Sequence>
    </AbsoluteFill>
  );
};
