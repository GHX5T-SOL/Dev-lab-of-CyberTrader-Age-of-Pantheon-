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
 * FIRST DAY — 25s / 750 frames @ 30fps
 * Narration: voices/narration-firstday.mp3 (Zoro, ~25s)
 *
 * Timeline:
 *   0 → 90     Title ("FIRST DAY")
 *  90 → 300    Whiteboard with 4 tickets
 * 300 → 540    Three steps carousel
 * 540 → 690    CTA slate
 * 690 → 750    Outro signoff
 */

export const FIRSTDAY_FPS = 30;
export const FIRSTDAY_DURATION = 750;

type Accent = keyof typeof BRAND;

const TICKETS: { code: string; title: string; owner: string; color: Accent }[] = [
  { code: "DEV-101", title: "Spin up the 3D floor", owner: "ZORO", color: "cyan" },
  { code: "DEV-102", title: "Record narration sample", owner: "REEL", color: "acid" },
  { code: "DEV-103", title: "Commission operator portraits", owner: "PRISM", color: "amber" },
  { code: "DEV-104", title: "Ship a reel on /office", owner: "GHOST", color: "heat" },
];

const STEPS = [
  {
    step: "01",
    title: "Walk the floor",
    body: "Open /office/floor-3d. Click any operator. They speak.",
  },
  {
    step: "02",
    title: "Pull a scenario brief",
    body: "Head to /office/agents. Every desk ships a one-pager.",
  },
  {
    step: "03",
    title: "Join the Council channel",
    body: "Compass threads go live Monday 09:00 UTC in the Council room.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Section A — Title (0..90)
// ─────────────────────────────────────────────────────────────────────────────

const DayTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = spring({ frame: frame - 4, fps, config: { damping: 14 } });
  const subAppear = spring({ frame: frame - 28, fps, config: { damping: 18 } });
  const taglineAppear = spring({ frame: frame - 42, fps, config: { damping: 22 } });

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
        gap: 20,
        opacity: sectionFade,
      }}
    >
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 26,
          letterSpacing: 10,
          color: BRAND.acid,
          opacity: subAppear,
        }}
      >
        CHAPTER 02
      </div>
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 170,
          fontWeight: 900,
          color: BRAND.chrome,
          letterSpacing: -5,
          opacity: appear,
          transform: `scale(${0.9 + appear * 0.1})`,
          textShadow: `0 0 50px ${BRAND.acid}aa, 0 0 20px ${BRAND.cyan}55`,
        }}
      >
        FIRST DAY
      </div>
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 32,
          color: BRAND.dust,
          opacity: taglineAppear,
        }}
      >
        Three moves to feel at home in the Lab.
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Section B — Whiteboard (0..210)
// ─────────────────────────────────────────────────────────────────────────────

const Whiteboard: React.FC<{ tickets: typeof TICKETS }> = ({ tickets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const boardAppear = spring({ frame, fps, config: { damping: 18 } });
  const sectionFade = interpolate(frame, [0, 20, 190, 210], [0, 1, 1, 0], {
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
          fontFamily: FONT_MONO,
          fontSize: 22,
          letterSpacing: 8,
          color: BRAND.dust,
          opacity: boardAppear,
        }}
      >
        WHITEBOARD // SPRINT 01
      </div>
      <div
        style={{
          width: 1420,
          minHeight: 520,
          opacity: boardAppear,
          transform: `translateY(${(1 - boardAppear) * 20}px)`,
          padding: 48,
          borderRadius: 18,
          background: `linear-gradient(160deg, ${BRAND.ink} 0%, ${BRAND.void} 100%)`,
          border: `1.5px solid ${BRAND.acid}66`,
          boxShadow: `0 0 50px ${BRAND.acid}22, inset 0 0 30px ${BRAND.acid}11`,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
        }}
      >
        {tickets.map((t, i) => {
          const delay = 16 + i * 14;
          const appear = spring({ frame: frame - delay, fps, config: { damping: 16 } });
          const accent = BRAND[t.color];
          const tilt = i % 2 === 0 ? -0.5 : 0.5;
          return (
            <div
              key={t.code}
              style={{
                opacity: appear,
                transform: `translateY(${(1 - appear) * 20}px) rotate(${tilt}deg)`,
                padding: "22px 28px",
                background: `${accent}1e`,
                borderLeft: `4px solid ${accent}`,
                borderRadius: 8,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                boxShadow: `0 10px 28px rgba(0,0,0,0.4)`,
              }}
            >
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 13,
                  letterSpacing: 3,
                  color: accent,
                }}
              >
                {t.code} · {t.owner}
              </div>
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 30,
                  fontWeight: 700,
                  color: BRAND.chrome,
                  letterSpacing: -0.5,
                  lineHeight: 1.1,
                }}
              >
                {t.title}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Section C — Steps carousel (0..240)
// ─────────────────────────────────────────────────────────────────────────────

const StepsCarousel: React.FC<{ steps: typeof STEPS }> = ({ steps }) => {
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
        gap: 28,
        opacity: sectionFade,
      }}
    >
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 22,
          letterSpacing: 8,
          color: BRAND.acid,
          opacity: spring({ frame, fps, config: { damping: 18 } }),
        }}
      >
        YOUR RUN-BOOK
      </div>
      <div style={{ display: "flex", gap: 24, maxWidth: 1700 }}>
        {steps.map((s, i) => {
          const delay = 14 + i * 40;
          const appear = spring({ frame: frame - delay, fps, config: { damping: 15 } });
          return (
            <div
              key={s.step}
              style={{
                width: 520,
                minHeight: 460,
                opacity: appear,
                transform: `translateY(${(1 - appear) * 40}px)`,
                padding: 36,
                borderRadius: 18,
                background: `linear-gradient(160deg, ${BRAND.acid}18 0%, ${BRAND.ink} 100%)`,
                border: `1px solid ${BRAND.acid}55`,
                boxShadow: `0 0 32px ${BRAND.acid}22`,
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 96,
                  fontWeight: 900,
                  color: BRAND.acid,
                  letterSpacing: -4,
                  lineHeight: 0.9,
                  textShadow: `0 0 30px ${BRAND.acid}66`,
                }}
              >
                {s.step}
              </div>
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 40,
                  fontWeight: 800,
                  color: BRAND.chrome,
                  letterSpacing: -1,
                  lineHeight: 1.05,
                }}
              >
                {s.title}
              </div>
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 24,
                  color: BRAND.dust,
                  lineHeight: 1.35,
                }}
              >
                {s.body}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Section D — CTA (0..150)
// ─────────────────────────────────────────────────────────────────────────────

const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = spring({ frame, fps, config: { damping: 14 } });
  const badge = spring({ frame: frame - 20, fps, config: { damping: 18 } });
  const sectionFade = interpolate(frame, [0, 20, 130, 150], [0, 1, 1, 0], {
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
        gap: 40,
        opacity: sectionFade,
      }}
    >
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 130,
          fontWeight: 900,
          color: BRAND.chrome,
          letterSpacing: -4,
          lineHeight: 0.95,
          opacity: appear,
          transform: `scale(${0.9 + appear * 0.1})`,
          textShadow: `0 0 50px ${BRAND.acid}aa`,
          textAlign: "center",
        }}
      >
        SEE YOU
        <br />
        ON THE FLOOR
      </div>
      <div
        style={{
          opacity: badge,
          transform: `translateY(${(1 - badge) * 20}px)`,
          padding: "16px 40px",
          borderRadius: 999,
          background: `${BRAND.acid}22`,
          border: `1.5px solid ${BRAND.acid}aa`,
          fontFamily: FONT_MONO,
          fontSize: 24,
          letterSpacing: 6,
          color: BRAND.chrome,
        }}
      >
        cybertrader.app / office / floor-3d
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Section E — Outro signoff (0..60)
// ─────────────────────────────────────────────────────────────────────────────

const OutroSlate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({ frame, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 18,
        opacity: appear,
      }}
    >
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 22,
          letterSpacing: 10,
          color: BRAND.dust,
        }}
      >
        CYBERTRADER / AGE OF PANTHEON
      </div>
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 42,
          fontWeight: 800,
          color: BRAND.cyan,
          letterSpacing: -1,
        }}
      >
        Built by Ghost + Zoro + 12 AI operators.
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Root composition
// ─────────────────────────────────────────────────────────────────────────────

export const FirstDay: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BRAND.void }}>
      <Backdrop hue="acid" />
      <Audio src={staticFile("voices/narration-firstday.mp3")} />

      <Sequence from={0} durationInFrames={90}>
        <DayTitle />
      </Sequence>
      <Sequence from={90} durationInFrames={210}>
        <Whiteboard tickets={TICKETS} />
      </Sequence>
      <Sequence from={300} durationInFrames={240}>
        <StepsCarousel steps={STEPS} />
      </Sequence>
      <Sequence from={540} durationInFrames={150}>
        <CTA />
      </Sequence>
      <Sequence from={690} durationInFrames={60}>
        <OutroSlate />
      </Sequence>
    </AbsoluteFill>
  );
};
