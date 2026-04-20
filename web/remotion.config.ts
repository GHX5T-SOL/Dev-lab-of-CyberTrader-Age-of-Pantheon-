/**
 * Remotion configuration for the Dev Lab explainer reel.
 *
 * Shares /public/voices/ and /public/brand/ with the Next.js site by pointing
 * Remotion's public dir at the site's public dir. staticFile("voices/foo.mp3")
 * resolves to web/public/voices/foo.mp3 from anywhere inside a composition.
 */
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setPublicDir("./public");
Config.setConcurrency("50%");
