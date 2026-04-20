import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BRAND } from "./brand";

/**
 * Shared cyberpunk backdrop used behind every composition.
 * - Radial neon glows pulse slowly in the background
 * - Scanlines overlay for CRT feel
 * - Subtle grid floor at low opacity
 * - Vignette
 */
export const Backdrop: React.FC<{ hue?: "cyan" | "acid" | "violet" | "heat" }> = ({
  hue = "cyan",
}) => {
  const frame = useCurrentFrame();
  const pulse = 0.85 + 0.15 * Math.sin(frame / 30);
  const primary = BRAND[hue];

  return (
    <AbsoluteFill style={{ background: BRAND.void }}>
      {/* Far glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(1200px 600px at 50% 90%, ${primary}22 0%, transparent 70%)`,
          opacity: pulse,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 500px at 80% 30%, ${BRAND.violet}33 0%, transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 500px at 15% 40%, ${BRAND.heat}22 0%, transparent 70%)`,
        }}
      />

      {/* Grid floor */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(${primary}14 1px, transparent 1px),
            linear-gradient(90deg, ${primary}14 1px, transparent 1px)
          `,
          backgroundSize: "96px 96px",
          backgroundPosition: "-1px -1px",
          opacity: 0.7,
          transform: `perspective(1400px) rotateX(56deg) translateY(38%) scale(1.9)`,
          transformOrigin: "bottom",
          maskImage: "linear-gradient(180deg, transparent 0%, black 40%, black 100%)",
          WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 40%, black 100%)",
        }}
      />

      {/* Scanlines */}
      <AbsoluteFill
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(0,245,255,0.04) 3px, transparent 4px)",
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(1400px 900px at 50% 50%, transparent 60%, rgba(0,0,0,0.7) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
