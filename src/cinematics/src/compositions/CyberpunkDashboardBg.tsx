import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";

const skylineBars = [
  { left: 0, width: 90, height: 420, color: "rgba(0,229,255,0.18)" },
  { left: 92, width: 124, height: 560, color: "rgba(138,124,255,0.18)" },
  { left: 222, width: 80, height: 360, color: "rgba(255,200,87,0.12)" },
  { left: 314, width: 152, height: 650, color: "rgba(0,229,255,0.12)" },
  { left: 486, width: 94, height: 450, color: "rgba(255,59,59,0.1)" },
  { left: 604, width: 170, height: 720, color: "rgba(138,124,255,0.16)" },
  { left: 790, width: 112, height: 520, color: "rgba(0,255,178,0.12)" },
  { left: 930, width: 150, height: 610, color: "rgba(0,229,255,0.16)" },
];

export const CyberpunkDashboardBg: React.FC = () => {
  const frame = useCurrentFrame();
  const pan = interpolate(frame, [0, 120], [-18, 18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#05070D", overflow: "hidden" }}>
      <Img
        src={staticFile("cyberpunk-city-source.png")}
        style={{
          position: "absolute",
          width: "112%",
          height: "112%",
          left: "-6%",
          top: "-6%",
          objectFit: "cover",
          filter: "blur(8px) saturate(1.18) contrast(1.18)",
          transform: `translateX(${pan}px)`,
          opacity: 0.74,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, #05070D 0%, rgba(5,7,13,0.48) 36%, #05070D 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 22% 24%, rgba(0,229,255,0.34), transparent 28%), radial-gradient(circle at 82% 16%, rgba(138,124,255,0.28), transparent 30%), radial-gradient(circle at 56% 62%, rgba(255,200,87,0.12), transparent 34%)",
          opacity: 0.9,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 760,
          opacity: 0.44,
        }}
      >
        {skylineBars.map((bar, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: bar.left,
              bottom: 0,
              width: bar.width,
              height: bar.height,
              background:
                "linear-gradient(180deg, rgba(5,7,13,0.12), rgba(5,7,13,0.9))",
              borderLeft: `2px solid ${bar.color}`,
              boxShadow: `0 0 30px ${bar.color}`,
            }}
          >
            {Array.from({ length: 18 }).map((_, windowIndex) => (
              <span
                key={windowIndex}
                style={{
                  position: "absolute",
                  left: 14 + (windowIndex % 4) * 22,
                  top: 30 + Math.floor(windowIndex / 4) * 58,
                  width: 10,
                  height: 18,
                  backgroundColor:
                    windowIndex % 5 === 0 ? "#FFC857" : windowIndex % 2 === 0 ? "#00E5FF" : "#8A7CFF",
                  opacity: 0.46,
                  boxShadow: "0 0 10px currentColor",
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 4px)",
          opacity: 0.24,
        }}
      />
    </AbsoluteFill>
  );
};
