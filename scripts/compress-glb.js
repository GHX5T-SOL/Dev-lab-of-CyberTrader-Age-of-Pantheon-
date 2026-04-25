#!/usr/bin/env node
/**
 * Simple GLB compression script using gltf-pipeline.
 * Usage: npm run compress-glb -- <relative-path-to-GLB>
 * Example: npm run compress-glb -- web/public/GLB_Assets/Avatar_zara.glb
 */
const path = require('path');
const fs = require('fs');
const { processGltf } = require('gltf-pipeline');

if (process.argv.length < 3) {
  console.error('Usage: compress-glb <path-to-glb>');
  process.exit(1);
}

const inputRel = process.argv[2];
const inputPath = path.resolve(process.cwd(), inputRel);
if (!fs.existsSync(inputPath)) {
  console.error('[compress-glb] Input file does not exist:', inputPath);
  process.exit(1);
}

const outputPath = inputPath.replace(/\.glb$/i, '.compressed.glb');

(async () => {
  try {
    const data = fs.readFileSync(inputPath);
    const options = {
      dracoOptions: { compressionLevel: 10 },
      // Additional options can be added for LOD generation later.
    };
    const result = await processGltf(data, options);
    fs.writeFileSync(outputPath, Buffer.from(result.glb));
    console.log('[compress-glb] Compressed GLB written to', outputPath);
  } catch (e) {
    console.error('[compress-glb] Error:', e);
    process.exit(1);
  }
})();
