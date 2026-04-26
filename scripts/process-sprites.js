#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const childProcess = require("node:child_process");
const {
  COMMODITIES,
  ROOT,
  UI_DIR,
  createCanvas,
  drawBorder,
  drawCommodity,
  drawTerminalBg,
  writePng,
} = require("./generate-commodity-art");

const COMMODITY_DIR = path.join(ROOT, "src", "assets", "commodities");
const MANIFEST_PATH = path.join(ROOT, "spritecook-assets.json");

function commandExists(command) {
  try {
    childProcess.execFileSync(process.platform === "win32" ? "where.exe" : "which", [command], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function packageExists(packageName) {
  try {
    require.resolve(`${packageName}/package.json`, { paths: [ROOT] });
    return true;
  } catch {
    return false;
  }
}

function sha12(filePath) {
  const crypto = require("node:crypto");
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex").slice(0, 12);
}

function processLocalSprites() {
  fs.mkdirSync(COMMODITY_DIR, { recursive: true });
  fs.mkdirSync(UI_DIR, { recursive: true });
  const manifest = [];

  for (const item of COMMODITIES) {
    const canvas = createCanvas(256);
    drawCommodity(canvas, item, true);
    const outPath = path.join(COMMODITY_DIR, `${item.slug}.png`);
    writePng(outPath, 256, 256, canvas.pixels);
    manifest.push({
      label: item.ticker,
      file: path.relative(ROOT, outPath).replace(/\\/g, "/"),
      sha12: sha12(outPath),
      source: "local-procedural-fallback",
    });
  }

  const bgPath = path.join(UI_DIR, "terminal-bg.png");
  const borderPath = path.join(UI_DIR, "neon-border.png");
  drawTerminalBg(bgPath);
  drawBorder(borderPath);
  manifest.push({
    label: "terminal-bg",
    file: path.relative(ROOT, bgPath).replace(/\\/g, "/"),
    sha12: sha12(bgPath),
    source: "local-procedural-fallback",
  });
  manifest.push({
    label: "neon-border",
    file: path.relative(ROOT, borderPath).replace(/\\/g, "/"),
    sha12: sha12(borderPath),
    source: "local-procedural-fallback",
  });

  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify({ generatedAt: new Date().toISOString(), assets: manifest }, null, 2)}\n`);
}

function main() {
  const hasSpriteCook = commandExists("spritecook");
  const hasSpriteCookMcp = packageExists("spritecook-mcp");
  if (!hasSpriteCook && !hasSpriteCookMcp) {
    process.stderr.write("SpriteCook tooling not found locally. Run npm install, then npm run spritecook:setup. Using built-in deterministic sprite processor.\n");
  } else if (hasSpriteCookMcp) {
    process.stderr.write("SpriteCook MCP package detected. Run npm run spritecook:setup to authenticate generation; deterministic processor normalizes final Expo assets for CI.\n");
  } else {
    process.stderr.write("SpriteCook CLI detected. Built-in processor still normalizes final Expo assets for deterministic CI output.\n");
  }
  processLocalSprites();
  process.stdout.write(`Processed sprites into ${COMMODITY_DIR}\n`);
  process.stdout.write(`Processed UI sprites into ${UI_DIR}\n`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exitCode = 1;
  }
}
