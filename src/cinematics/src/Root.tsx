import { Composition } from "remotion";
import { CyberpunkDashboardBg } from "./compositions/CyberpunkDashboardBg";
import { IntroVideoFix } from "./compositions/IntroVideoFix";
import { Phase1Teaser } from "./compositions/Phase1Teaser";

export const Root = () => {
  return (
    <>
      <Composition
        id="CyberpunkDashboardBg"
        component={CyberpunkDashboardBg}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Phase1Teaser"
        component={Phase1Teaser}
        durationInFrames={210}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="IntroVideoFix"
        component={IntroVideoFix}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
