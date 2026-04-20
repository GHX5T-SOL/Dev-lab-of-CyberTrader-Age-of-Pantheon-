/**
 * Remotion entry point — registers the composition root.
 * Invoked via:  npx remotion studio remotion/index.ts
 * or:           npx remotion render remotion/index.ts welcome out/welcome.mp4
 */
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);
