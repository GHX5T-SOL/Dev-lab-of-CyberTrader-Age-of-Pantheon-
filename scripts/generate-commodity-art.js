#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const ROOT = path.resolve(__dirname, "..");
const RAW_DIR = path.join(ROOT, "scripts", "output", "raw");
const UI_DIR = path.join(ROOT, "src", "assets", "ui");

const COMMODITIES = [
  {
    ticker: "FDST",
    slug: "fractal_dust",
    name: "Fractal Dust",
    accent: [0, 240, 255],
    secondary: [170, 64, 255],
    prompt: "A small vial of glowing crystalline fractal dust, neon cyan and violet particles, dark transparent background, cyberpunk contraband game item icon, centered, sharp silhouette",
  },
  {
    ticker: "PGAS",
    slug: "plutonion_gas",
    name: "Plutonion Gas",
    accent: [57, 255, 20],
    secondary: [0, 240, 255],
    prompt: "A compact canister of unstable plutonion gas with luminous green vapor vents, cyberpunk industrial game item icon, centered, dark transparent background",
  },
  {
    ticker: "NGLS",
    slug: "neon_glass",
    name: "Neon Glass",
    accent: [0, 240, 255],
    secondary: [255, 184, 0],
    prompt: "A shard cluster of neon glass containing archived memory glyphs, cyan reflections, black-market cyberpunk item icon, centered, transparent background",
  },
  {
    ticker: "HXMD",
    slug: "helix_mud",
    name: "Helix Mud",
    accent: [255, 184, 0],
    secondary: [255, 49, 49],
    prompt: "A sealed biohack vial of helix mud with amber DNA spiral sediment, dark biotech cyberpunk game item icon, centered, transparent background",
  },
  {
    ticker: "VBLM",
    slug: "void_bloom",
    name: "Void Bloom",
    accent: [170, 64, 255],
    secondary: [0, 240, 255],
    prompt: "A luminous void bloom flower grown in illegal data soil, violet petals with cyan core, cyberpunk starter commodity icon, centered, transparent background",
  },
  {
    ticker: "ORRS",
    slug: "oracle_resin",
    name: "Oracle Resin",
    accent: [255, 184, 0],
    secondary: [0, 240, 255],
    prompt: "A golden oracle resin droplet with predictive circuit veins and a tiny eye-like glow, cyberpunk market signal item icon, centered, transparent background",
  },
  {
    ticker: "SNPS",
    slug: "synapse_silk",
    name: "Synapse Silk",
    accent: [255, 49, 255],
    secondary: [0, 240, 255],
    prompt: "A spool of synapse silk fiber optic thread, magenta and cyan strands, faction courier cyberpunk game item icon, centered, transparent background",
  },
  {
    ticker: "MTRX",
    slug: "matrix_salt",
    name: "Matrix Salt",
    accent: [200, 214, 229],
    secondary: [0, 240, 255],
    prompt: "A crystalline cube of matrix salt with lattice glyphs and cyan edges, cyberpunk unlock material game item icon, centered, transparent background",
  },
  {
    ticker: "AETH",
    slug: "aether_tabs",
    name: "Aether Tabs",
    accent: [0, 240, 255],
    secondary: [255, 49, 49],
    prompt: "A blister strip of glowing aether tabs, cyan capsules with warning red scan marks, cyberpunk rumor-market item icon, centered, transparent background",
  },
  {
    ticker: "BLCK",
    slug: "blacklight_serum",
    name: "Blacklight Serum",
    accent: [255, 49, 49],
    secondary: [0, 240, 255],
    prompt: "A blacklight serum injector filled with dangerous red-black liquid, contraband cyberpunk game item icon, centered, transparent background",
  },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readFirstExistingFile(candidates) {
  for (const filePath of candidates) {
    try {
      if (filePath && fs.existsSync(filePath)) {
        const value = fs.readFileSync(filePath, "utf8").trim();
        if (value) {
          return value;
        }
      }
    } catch {
      // Ignore unreadable token files and continue to the next standard location.
    }
  }
  return "";
}

function resolveHuggingFaceToken() {
  if (process.env.HF_TOKEN) {
    return process.env.HF_TOKEN;
  }
  if (process.env.HUGGINGFACE_API_TOKEN) {
    return process.env.HUGGINGFACE_API_TOKEN;
  }
  if (process.env.HUGGINGFACEHUB_API_TOKEN) {
    return process.env.HUGGINGFACEHUB_API_TOKEN;
  }

  const home = process.env.USERPROFILE || process.env.HOME || "";
  const hfHome = process.env.HF_HOME || (home ? path.join(home, ".cache", "huggingface") : "");
  const xdgCache = process.env.XDG_CACHE_HOME ? path.join(process.env.XDG_CACHE_HOME, "huggingface") : "";
  return readFirstExistingFile([
    path.join(hfHome, "token"),
    xdgCache ? path.join(xdgCache, "token") : "",
    home ? path.join(home, ".huggingface", "token") : "",
  ]);
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function writePng(filePath, width, height, pixels) {
  const rows = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const rowStart = y * (width * 4 + 1);
    rows[rowStart] = 0;
    pixels.copy(rows, rowStart + 1, y * width * 4, (y + 1) * width * 4);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;

  ensureDir(path.dirname(filePath));
  fs.writeFileSync(
    filePath,
    Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      pngChunk("IHDR", ihdr),
      pngChunk("IDAT", zlib.deflateSync(rows, { level: 9 })),
      pngChunk("IEND", Buffer.alloc(0)),
    ]),
  );
}

function createCanvas(size) {
  return {
    size,
    pixels: Buffer.alloc(size * size * 4),
  };
}

function blendPixel(canvas, x, y, color, alpha = 255) {
  const px = Math.round(x);
  const py = Math.round(y);
  if (px < 0 || py < 0 || px >= canvas.size || py >= canvas.size) {
    return;
  }
  const index = (py * canvas.size + px) * 4;
  const srcA = Math.max(0, Math.min(255, alpha)) / 255;
  const dstA = canvas.pixels[index + 3] / 255;
  const outA = srcA + dstA * (1 - srcA);
  if (outA <= 0) {
    return;
  }
  for (let i = 0; i < 3; i += 1) {
    canvas.pixels[index + i] = Math.round((color[i] * srcA + canvas.pixels[index + i] * dstA * (1 - srcA)) / outA);
  }
  canvas.pixels[index + 3] = Math.round(outA * 255);
}

function fillCircle(canvas, cx, cy, radius, color, alpha = 255) {
  const r2 = radius * radius;
  for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y += 1) {
    for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x += 1) {
      const dx = x - cx;
      const dy = y - cy;
      const d2 = dx * dx + dy * dy;
      if (d2 <= r2) {
        const edge = Math.max(0, 1 - d2 / r2);
        blendPixel(canvas, x, y, color, alpha * Math.min(1, 0.35 + edge));
      }
    }
  }
}

function strokeLine(canvas, x1, y1, x2, y2, color, alpha = 255, width = 4) {
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) * 2;
  for (let i = 0; i <= steps; i += 1) {
    const t = steps ? i / steps : 0;
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    fillCircle(canvas, x, y, width / 2, color, alpha);
  }
}

function fillRect(canvas, x, y, width, height, color, alpha = 255) {
  for (let py = Math.floor(y); py < Math.ceil(y + height); py += 1) {
    for (let px = Math.floor(x); px < Math.ceil(x + width); px += 1) {
      blendPixel(canvas, px, py, color, alpha);
    }
  }
}

function strokeRect(canvas, x, y, width, height, color, alpha = 255, lineWidth = 2) {
  fillRect(canvas, x, y, width, lineWidth, color, alpha);
  fillRect(canvas, x, y + height - lineWidth, width, lineWidth, color, alpha);
  fillRect(canvas, x, y, lineWidth, height, color, alpha);
  fillRect(canvas, x + width - lineWidth, y, lineWidth, height, color, alpha);
}

function glow(canvas, cx, cy, radius, color) {
  for (let r = radius; r > 0; r -= Math.max(2, radius / 18)) {
    fillCircle(canvas, cx, cy, r, color, Math.max(4, (radius - r + 1) * 1.2));
  }
}

function drawVial(canvas, item, x, y, w, h) {
  glow(canvas, x + w * 0.5, y + h * 0.48, w * 0.55, item.accent);
  fillRect(canvas, x + w * 0.22, y + h * 0.18, w * 0.56, h * 0.68, [8, 16, 22], 220);
  strokeRect(canvas, x + w * 0.22, y + h * 0.18, w * 0.56, h * 0.68, item.accent, 220, Math.max(2, canvas.size / 80));
  fillRect(canvas, x + w * 0.33, y + h * 0.08, w * 0.34, h * 0.12, item.secondary, 190);
  for (let i = 0; i < 22; i += 1) {
    const px = x + w * (0.3 + ((i * 37) % 42) / 100);
    const py = y + h * (0.35 + ((i * 53) % 38) / 100);
    fillCircle(canvas, px, py, Math.max(2, canvas.size / 120), i % 2 ? item.accent : item.secondary, 230);
  }
}

function drawShard(canvas, item, x, y, w, h) {
  glow(canvas, x + w * 0.5, y + h * 0.5, w * 0.55, item.accent);
  const points = [
    [x + w * 0.5, y + h * 0.08],
    [x + w * 0.76, y + h * 0.42],
    [x + w * 0.58, y + h * 0.9],
    [x + w * 0.28, y + h * 0.58],
  ];
  for (let i = 0; i < points.length; i += 1) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % points.length];
    strokeLine(canvas, x1, y1, x2, y2, item.accent, 240, canvas.size / 45);
  }
  strokeLine(canvas, points[0][0], points[0][1], points[2][0], points[2][1], item.secondary, 180, canvas.size / 80);
  strokeLine(canvas, points[1][0], points[1][1], points[3][0], points[3][1], item.secondary, 130, canvas.size / 90);
}

function drawBloom(canvas, item, x, y, w, h) {
  glow(canvas, x + w * 0.5, y + h * 0.48, w * 0.58, item.secondary);
  for (let i = 0; i < 8; i += 1) {
    const angle = (Math.PI * 2 * i) / 8;
    const px = x + w * 0.5 + Math.cos(angle) * w * 0.22;
    const py = y + h * 0.52 + Math.sin(angle) * h * 0.22;
    fillCircle(canvas, px, py, w * 0.16, item.accent, 165);
    strokeLine(canvas, x + w * 0.5, y + h * 0.52, px, py, item.secondary, 210, canvas.size / 65);
  }
  fillCircle(canvas, x + w * 0.5, y + h * 0.52, w * 0.13, item.secondary, 245);
}

function drawThreads(canvas, item, x, y, w, h) {
  glow(canvas, x + w * 0.5, y + h * 0.55, w * 0.55, item.accent);
  for (let i = 0; i < 8; i += 1) {
    const offset = i * h * 0.07;
    strokeLine(canvas, x + w * 0.18, y + h * 0.25 + offset, x + w * 0.82, y + h * 0.2 + offset * 0.8, i % 2 ? item.accent : item.secondary, 230, canvas.size / 65);
  }
  fillCircle(canvas, x + w * 0.5, y + h * 0.55, w * 0.24, [10, 10, 16], 220);
  strokeRect(canvas, x + w * 0.34, y + h * 0.38, w * 0.32, h * 0.34, item.secondary, 190, canvas.size / 70);
}

function drawHelix(canvas, item, x, y, w, h) {
  glow(canvas, x + w * 0.52, y + h * 0.5, w * 0.54, item.secondary);
  for (let i = 0; i < 26; i += 1) {
    const t = i / 25;
    const yy = y + h * (0.15 + t * 0.7);
    const sx = Math.sin(t * Math.PI * 5);
    fillCircle(canvas, x + w * (0.5 + sx * 0.18), yy, w * 0.035, item.accent, 230);
    fillCircle(canvas, x + w * (0.5 - sx * 0.18), yy, w * 0.035, item.secondary, 220);
    if (i % 3 === 0) {
      strokeLine(canvas, x + w * (0.5 + sx * 0.18), yy, x + w * (0.5 - sx * 0.18), yy, [200, 214, 229], 120, canvas.size / 100);
    }
  }
}

function drawCommodity(canvas, item, processed = false) {
  const s = canvas.size;
  const inset = processed ? s * 0.09 : s * 0.08;
  fillCircle(canvas, s / 2, s / 2, s * 0.42, [8, 10, 16], 205);
  glow(canvas, s / 2, s / 2, s * 0.34, item.accent);
  strokeRect(canvas, s * 0.08, s * 0.08, s * 0.84, s * 0.84, item.accent, processed ? 255 : 160, Math.max(1, s / 128));
  const x = inset;
  const y = inset;
  const w = s - inset * 2;
  const h = s - inset * 2;

  if (item.ticker === "VBLM") {
    drawBloom(canvas, item, x, y, w, h);
  } else if (item.ticker === "NGLS" || item.ticker === "MTRX") {
    drawShard(canvas, item, x, y, w, h);
  } else if (item.ticker === "SNPS") {
    drawThreads(canvas, item, x, y, w, h);
  } else if (item.ticker === "HXMD") {
    drawHelix(canvas, item, x, y, w, h);
  } else {
    drawVial(canvas, item, x, y, w, h);
  }
}

function drawTerminalBg(filePath) {
  const width = 1024;
  const height = 1024;
  const pixels = Buffer.alloc(width * height * 4);
  const canvas = { size: width, pixels };
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const grid = x % 64 === 0 || y % 64 === 0 ? 22 : x % 16 === 0 || y % 16 === 0 ? 8 : 0;
      const noise = ((x * 13 + y * 17) % 11) - 5;
      pixels[index] = Math.max(0, 7 + grid + noise);
      pixels[index + 1] = Math.max(0, 11 + grid + noise);
      pixels[index + 2] = Math.max(0, 18 + grid * 2 + noise);
      pixels[index + 3] = 255;
    }
  }
  for (let i = 0; i < 18; i += 1) {
    strokeLine(canvas, (i * 83) % width, 0, (i * 83 + 420) % width, height, [0, 240, 255], 24, 2);
  }
  writePng(filePath, width, height, pixels);
}

function drawBorder(filePath) {
  const width = 256;
  const height = 64;
  const pixels = Buffer.alloc(width * height * 4);
  const canvas = { size: width, pixels };
  strokeRect(canvas, 8, 8, width - 16, height - 16, [0, 240, 255], 255, 2);
  strokeRect(canvas, 5, 5, width - 10, height - 10, [0, 160, 204], 90, 3);
  writePng(filePath, width, height, pixels);
}

async function fetchHuggingFaceImage(item) {
  const token = resolveHuggingFaceToken();
  if (!token) {
    return null;
  }
  const model = process.env.HF_IMAGE_MODEL || "stabilityai/stable-diffusion-2-1";
  const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "image/png",
    },
    body: JSON.stringify({
      inputs: item.prompt,
      parameters: {
        width: 512,
        height: 512,
        guidance_scale: 7.5,
        num_inference_steps: 30,
      },
    }),
  });
  if (!response.ok) {
    throw new Error(`Hugging Face ${response.status} for ${item.ticker}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function generateRaw() {
  ensureDir(RAW_DIR);
  ensureDir(UI_DIR);
  const localOnly = process.argv.includes("--local-only");
  const liveOnly = process.argv.includes("--live-only");
  for (const item of COMMODITIES) {
    const rawPath = path.join(RAW_DIR, `${item.slug}.png`);
    let image = null;
    if (!localOnly) {
      try {
        image = await fetchHuggingFaceImage(item);
      } catch (error) {
        process.stderr.write(`${error.message}; using local procedural art\n`);
      }
    }
    if (image) {
      fs.writeFileSync(rawPath, image);
    } else if (liveOnly) {
      throw new Error(`Hugging Face live generation required but no image was returned for ${item.ticker}. Run npm run hf:login or set HF_TOKEN.`);
    } else {
      const canvas = createCanvas(512);
      drawCommodity(canvas, item, false);
      writePng(rawPath, 512, 512, canvas.pixels);
    }
  }
  drawTerminalBg(path.join(RAW_DIR, "terminal-bg.png"));
  drawBorder(path.join(RAW_DIR, "neon-border.png"));
}

if (require.main === module) {
  generateRaw().then(() => {
    process.stdout.write(`Generated raw commodity and UI art in ${RAW_DIR}\n`);
  }).catch((error) => {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exitCode = 1;
  });
}

module.exports = {
  COMMODITIES,
  ROOT,
  UI_DIR,
  createCanvas,
  drawBorder,
  drawCommodity,
  drawTerminalBg,
  resolveHuggingFaceToken,
  writePng,
};
