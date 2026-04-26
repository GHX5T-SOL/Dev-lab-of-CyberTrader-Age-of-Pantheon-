const fs = require('fs');
const path = require('path');

const assetDir = path.resolve(__dirname, '../src/assets');
const reportPath = path.resolve(__dirname, '../docs/asset-optimization-report.md');

const imageExt = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg']);
const videoExt = new Set(['.mp4', '.mov', '.avi', '.webm']);
const IMAGE_THRESHOLD_KB = 200; // 200KB
const VIDEO_THRESHOLD_KB = 5000; // 5MB

function walk(dir) {
  const results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  list.forEach((dirent) => {
    const full = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      results.push(...walk(full));
    } else {
      results.push(full);
    }
  });
  return results;
}

function formatKB(size) {
  return (size / 1024).toFixed(1);
}

function generateReport() {
  const files = walk(assetDir);
  const rows = [];
  files.forEach((file) => {
    const ext = path.extname(file).toLowerCase();
    const stat = fs.statSync(file);
    const sizeKB = stat.size / 1024;
    let status = 'OK';
    if (imageExt.has(ext) && sizeKB > IMAGE_THRESHOLD_KB) {
      status = '⚠️ Too Large';
    } else if (videoExt.has(ext) && sizeKB > VIDEO_THRESHOLD_KB) {
      status = '⚠️ Too Large';
    }
    const relPath = path.relative(process.cwd(), file);
    rows.push({ relPath, sizeKB: formatKB(stat.size), status });
  });

  const header = `# Asset Optimization Report\nGenerated on ${new Date().toISOString()}\n\n| Asset Path | Size (KB) | Status |\n|---|---|---|`;
  const body = rows
    .map((r) => `| ${r.relPath} | ${r.sizeKB} | ${r.status} |`)
    .join('\n');
  const content = `${header}\n${body}\n`;
  fs.writeFileSync(reportPath, content, 'utf8');
  console.log('Report written to', reportPath);
}

generateReport();
