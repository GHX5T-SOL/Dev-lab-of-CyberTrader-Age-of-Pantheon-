import {
  AbsoluteFill,
  Audio,
  Easing,
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
 * WELCOME — 40s / 1200 frames @ 30fps
 * Narration: voices/narration-welcome.mp3 (Ghost, ~40s)
 *
 * Timeline:
 *   0 → 270    Title reveal (glitch DEV LAB + subtitle)
 *  270 → 540   Skyline pan (neon towers + Neo-Seoul tagline)
 *  540 → 840   Operator grid (14 cards, staggered)
 *  840 → 1080  Workstation carousel (5 stations)
 * 1080 → 1200  Outro slate (WELCOME + URL)
 */

export const WELCOME_FPS = 30;
export const WELCOME_DURATION = 1200;

type Accent = keyof typeof BRAND;

const OPERATORS: { slug: string; name: string; role: string; accent: Accent }[] = [
  { slug: "ghost", name: "GHOST", role: "Founder / Creative Lead", accent: "cyan" },
  { slug: "zoro", name: "ZORO", role: "Co-founder / Build Partner", accent: "acid" },
  { slug: "compass", name: "COMPASS", role: "AI Council Chair", accent: "violet" },
  { slug: "reel", name: "REEL", role: "Cinematic Director", accent: "heat" },
  { slug: "axiom", name: "AXIOM", role: "Market Sim Swarm Lead", accent: "amber" },
  { slug: "hexa", name: "HEXA", role: "Gameplay Systems", accent: "cyan" },
  { slug: "prism", name: "PRISM", role: "UI / UX Architect", accent: "violet" },
  { slug: "echo", name: "ECHO", role: "Motion Designer", accent: "acid" },
  { slug: "forge", name: "FORGE", role: "Repo Executor", accent: "heat" },
  { slug: "mnemo", name: "MNEMO", role: "Context Memory", accent: "amber" },
  { slug: "vector", name: "VECTOR", role: "Economy Engineer", accent: "cyan" },
  { slug: "halo", name: "HALO", role: "Live Ops Guardian", accent: "acid" },
  { slug: "oracle", name: "ORACLE", role: "Lore Steward", accent: "violet" },
  { slug: "signal", name: "SIGNAL", role: "Brand Voice", accent: "heat" },
];

const STATIONS = [
  { id: "council", name: "COUNCIL TABLE", caption: "12 operators. One weekly standup." },
  { id: "floor3d", name: "FLOOR 3D", caption: "Walk the office in R3F. Every rig talks." },
  { id: "reel", name: "REEL BOOTH", caption: "Remotion renders. Narrated explainers." },
  { id: "broadcast", name: "BROADCAST", caption: "HeyGen hyperframes. Talking avatars." },
  { id: "studio", name: "STUDIO TOOLKIT", caption: "ElevenLabs. SpriteCook. Ready Player Me." },
];

// ─────────────────────────────────────────────────────────────────────────────
// Section A — Title reveal (0..270)
// ─────────────────────────────────────────────────────────────────────────────

const TitleReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAppear = spring({ frame: frame - 4, fps, config: { damping: 14, mass: 1.1 } });
  const subAppear = spring({ frame: frame - 40, fps, config: { damping: 20 } });
  const glitch = frame < 70 ? Math.sin(frame / 2.2) * 4 : 0;

  const taglineOpacity = interpolate(
    frame,
    [90, 140, 250, 270],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const sectionFade = interpolate(frame, [0, 20, 250, 270], [0, 1, 1, 0], {
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
        gap: 28,
        opacity: sectionFade,
      }}
    >
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 210,
          fontWeight: 900,
          letterSpacing: -6,
          color: BRAND.chrome,
          transform: `translateX(${glitch}px) scale(${0.92 + titleAppear * 0.08})`,
          opacity: titleAppear,
          textShadow: `
            ${-2 - glitch}px 0 ${BRAND.cyan},
            ${2 + glitch}px 0 ${BRAND.heat},
            0 0 60px ${BRAND.cyan}aa
          `,
        }}
      >
        DEV LAB
      </div>
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 28,
          fontWeight: 500,
          letterSpacing: 8,
          color: BRAND.dust,
          opacity: subAppear,
          transform: `translateY(${(1 - subAppear) * 16}px)`,
        }}
      >
        CYBERTRADER / AGE OF PANTHEON
      </div>
      <div
        style={{
          marginTop: 20,
          fontFamily: FONT_DISPLAY,
          fontSize: 42,
          fontWeight: 600,
          color: BRAND.cyan,
          opacity: taglineOpacity,
        }}
      >
        Where an AI team of 14 runs the studio.
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Section B — Skyline pan (0..270)
// ─────────────────────────────────────────────────────────────────────────────

const SkylineShot: React.FC = () => {
  const frame = useCurrentFrame();
  const pan = interpolate(frame, [0, 270], [0, -1400], {
    easing: Easing.inOut(Easing.cubic),
  });

  const towers = Array.from({ length: 60 }, (_, i) => {
    const r = Math.abs(Math.sin(i * 127.1)) % 1;
    const height = 140 + r * 520;
    const width = 30 + ((r * 46) | 0);
    const x = i * 60;
    const tints = [BRAND.cyan, BRAND.violet, BRAND.heat, BRAND.amber, BRAND.acid];
    const tint = tints[i % tints.length];
    return { x, height, width, tint };
  });

  const sectionFade = interpolate(frame, [0, 20, 250, 270], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: sectionFade }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 180,
          height: 660,
          transform: `translateX(${pan}px)`,
        }}
      >
        {towers.map((t, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: t.x,
              bottom: 0,
              width: t.width,
              height: t.height,
              background: `linear-gradient(180deg, ${t.tint}33 0%, ${t.tint}11 60%, transparent 100%)`,
              border: `1px solid ${t.tint}66`,
              boxShadow: `0 0 30px ${t.tint}44, inset 0 0 20px ${t.tint}22`,
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          top: 150,
          left: 120,
          fontFamily: FONT_MONO,
          fontSize: 24,
          color: BRAND.dust,
          letterSpacing: 6,
          opacity: interpolate(frame, [20, 50], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        NEO-SEOUL / 2077 / S1LKROAD 4.0
      </div>
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 120,
          maxWidth: 1300,
          fontFamily: FONT_DISPLAY,
          fontSize: 76,
          fontWeight: 800,
          color: BRAND.chrome,
          letterSpacing: -2,
          lineHeight: 0.98,
          textShadow: `0 0 40px ${BRAND.cyan}aa`,
          opacity: interpolate(frame, [40, 80], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        A cyberpunk trading sim,
        <br />
        built inside a living lab.
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Section C — Operator grid (0..300)
// ─────────────────────────────────────────────────────────────────────────────

const OperatorGrid: React.FC<{ operators: typeof OPERATORS }> = ({ operators }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sectionFade = interpolate(frame, [0, 20, 280, 300], [0, 1, 1, 0], {
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
        gap: 32,
        padding: 60,
        opacity: sectionFade,
      }}
    >
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 24,
          letterSpacing: 8,
          color: BRAND.dust,
          opacity: spring({ frame, fps, config: { damping: 18 } }),
        }}
      >
        THE ROSTER
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 18,
          maxWidth: 1700,
        }}
      >
        {operators.map((op, i) => {
          const delay = 8 + i * 4;
          const appear = spring({ frame: frame - delay, fps, config: { damping: 14 } });
          const accent = BRAND[op.accent];
          return (
            <div
              key={op.slug}
              style={{
                opacity: appear,
                transform: `translateY(${(1 - appear) * 24}px) scale(${0.92 + appear * 0.08})`,
                padding: "22px 16px",
                borderRadius: 14,
                background: `linear-gradient(160deg, ${accent}22 0%, ${BRAND.ink} 100%)`,
                border: `1px solid ${accent}66`,
                boxShadow: `0 0 28px ${accent}33, inset 0 0 18px ${accent}11`,
                minHeight: 170,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 14,
                  letterSpacing: 2,
                  color: accent,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 32,
                  fontWeight: 800,
                  color: BRAND.chrome,
                  letterSpacing: -1,
                  lineHeight: 1,
                }}
              >
                {op.name}
              </div>
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 13,
                  color: BRAND.dust,
                  lineHeight: 1.3,
                }}
              >
                {op.role}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Section D — Station carousel (0..240)
// ─────────────────────────────────────────────────────────────────────────────

const StationCarousel: React.FC<{ stations: typeof STATIONS }> = ({ stations }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sectionFade = interpolate(frame, [0, 20, 220, 240], [0, 1, 1, 0], {
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
        gap: 24,
        padding: 60,
        opacity: sectionFade,
      }}
    >
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 24,
          letterSpacing: 8,
          color: BRAND.dust,
          opacity: spring({ frame, fps, config: { damping: 18 } }),
        }}
      >
        THE FLOOR
      </div>
      <div style={{ display: "flex", gap: 20, maxWidth: 1800, width: "100%", justifyContent: "center" }}>
        {stations.map((s, i) => {
          const delay = 10 + i * 12;
          const appear = spring({ frame: frame - delay, fps, config: { damping: 14 } });
          return (
            <div
              key={s.id}
              style={{
                opacity: appear,
                transform: `translateY(${(1 - appear) * 40}px)`,
                flex: 1,
                padding: 28,
                borderRadius: 18,
                background: `linear-gradient(160deg, ${BRAND.cyan}14 0%, ${BRAND.ink} 100%)`,
                border: `1px solid ${BRAND.cyan}55`,
                boxShadow: `0 0 30px ${BRAND.cyan}33`,
                minHeight: 380,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 18,
              }}
            >
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 15,
                  letterSpacing: 4,
                  color: BRAND.cyan,
                }}
              >
                STATION {String(i + 1).padStart(2, "0")}
              </div>
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 42,
                  fontWeight: 800,
                  color: BRAND.chrome,
                  letterSpacing: -1,
                  lineHeight: 1,
                }}
              >
                {s.name}
              </div>
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 22,
                  color: BRAND.dust,
                  lineHeight: 1.3,
                }}
              >
                {s.caption}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Section E — Outro slate (0..120)
// ─────────────────────────────────────────────────────────────────────────────

const OutroSlate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({ frame, fps, config: { damping: 18 } });
  const urlAppear = spring({ frame: frame - 14, fps, config: { damping: 20 } });
  const badgeAppear = spring({ frame: frame - 30, fps, config: { damping: 22 } });

  const outFade = interpolate(frame, [90, 120], [1, 0.2], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 30,
        opacity: outFade,
      }}
    >
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 160,
          fontWeight: 900,
          color: BRAND.cyan,
          letterSpacing: -6,
          opacity: appear,
          transform: `scale(${0.92 + appear * 0.08})`,
          textShadow: `0 0 60px ${BRAND.cyan}aa`,
        }}
      >
        WELCOME
      </div>
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 36,
          letterSpacing: 6,
          color: BRAND.chrome,
          opacity: urlAppear,
        }}
      >
        cybertrader.app / office
      </div>
      <div
        style={{
          marginTop: 10,
          fontFamily: FONT_MONO,
          fontSize: 18,
          letterSpacing: 3,
          color: BRAND.dust,
          opacity: badgeAppear,
        }}
      >
        BUILT BY GHOST + ZORO + 12 AI OPERATORS
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Root composition
// ─────────────────────────────────────────────────────────────────────────────

export const Welcome: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BRAND.void }}>
      <Backdrop hue="cyan" />
      <Audio src={staticFile("voices/narration-welcome.mp3")} />

      <Sequence from={0} durationInFrames={270}>
        <TitleReveal />
      </Sequence>
      <Sequence from={270} durationInFrames={270}>
        <SkylineShot />
      </Sequence>
      <Sequence from={540} durationInFrames={300}>
        <OperatorGrid operators={OPERATORS} />
      </Sequence>
      <Sequence from={840} durationInFrames={240}>
        <StationCarousel stations={STATIONS} />
      </Sequence>
      <Sequence from={1080} durationInFrames={120}>
        <OutroSlate />
      </Sequence>
    </AbsoluteFill>
  );
};
