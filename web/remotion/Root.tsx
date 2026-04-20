import { Composition } from "remotion";
import { Welcome, WELCOME_FPS, WELCOME_DURATION } from "./compositions/Welcome";
import { AICouncil, COUNCIL_FPS, COUNCIL_DURATION } from "./compositions/AICouncil";
import { FirstDay, FIRSTDAY_FPS, FIRSTDAY_DURATION } from "./compositions/FirstDay";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="welcome"
        component={Welcome}
        durationInFrames={WELCOME_DURATION}
        fps={WELCOME_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="ai-council"
        component={AICouncil}
        durationInFrames={COUNCIL_DURATION}
        fps={COUNCIL_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="first-day"
        component={FirstDay}
        durationInFrames={FIRSTDAY_DURATION}
        fps={FIRSTDAY_FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
