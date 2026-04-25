#!/usr/bin/env node
/**
 * Simple file watcher for changes in `web/public/GLB_Assets`.
 * On addition or change, it logs a suggestion to update the GLB manifest
 * and optionally triggers a compression job placeholder.
 *
 * This script is intentionally lightweight and does NOT perform any
 * destructive actions. It merely informs the developer/operator.
 */

const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');

const assetsDir = path.resolve(__dirname, '..', 'web', 'public', 'GLB_Assets');
if (!fs.existsSync(assetsDir)) {
  console.error('[watch-glb] Directory does not exist:', assetsDir);
  process.exit(1);
}

console.log('[watch-glb] Watching for changes in', assetsDir);

const watcher = chokidar.watch(assetsDir, {
  ignored: /(^|[\\/])\\../, // ignore dotfiles
  persistent: true,
});

function suggestUpdate(filePath) {
  const rel = path.relative(assetsDir, filePath);
  console.log(`[watch-glb] Detected change: ${rel}`);
  console.log('  → Consider updating the GLB manifest and scheduling a compression job.');
  console.log('  → Run: npm run compress-glb -- <file> (to be implemented)');
}

watcher
  .on('add', suggestUpdate)
  .on('change', suggestUpdate)
  .on('unlink', (p) => console.log(`[watch-glb] File removed: ${path.relative(assetsDir, p)}`))
  .on('error', (error) => console.error('[watch-glb] Watch error:', error));
