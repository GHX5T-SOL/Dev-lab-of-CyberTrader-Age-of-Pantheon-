const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const MODEL = "stabilityai/stable-diffusion-xl-base-1.0";
const PROMPT =
  "dark cyberpunk terminal grid, subtle neon cyan and amber glow lines, black background, 1024x1024, seamless game UI texture, no text, no logo, no characters";

function readToken() {
  if (process.env.HF_TOKEN) {
    return process.env.HF_TOKEN;
  }
  const cacheTokenPath = path.join(os.homedir(), ".cache", "huggingface", "token");
  if (fs.existsSync(cacheTokenPath)) {
    return fs.readFileSync(cacheTokenPath, "utf8").trim();
  }
  return "";
}

async function main() {
  const token = readToken();
  if (!token) {
    throw new Error("Hugging Face token not found. Set HF_TOKEN or run `hf auth login`.");
  }

  const { HfInference } = await import("@huggingface/inference");
  const hf = new HfInference(token);
  const image = await hf.textToImage({
    model: MODEL,
    inputs: PROMPT,
  });
  const buffer = Buffer.from(await image.arrayBuffer());
  const outPath = path.join(process.cwd(), "src", "assets", "ui", "terminal-bg.png");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);
  console.log(`Generated terminal background with ${MODEL}: ${outPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
