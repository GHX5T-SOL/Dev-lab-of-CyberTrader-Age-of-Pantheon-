import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";

export const IntroVideoFix = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", alignItems: "center", justifyContent: "center" }}>
      <OffthreadVideo
        src={staticFile("intro-cinematic.mp4")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          backgroundColor: "#000",
        }}
        muted
      />
    </AbsoluteFill>
  );
};
