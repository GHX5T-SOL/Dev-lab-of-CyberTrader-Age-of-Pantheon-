param(
  [string]$Root = (Split-Path -Parent $PSScriptRoot),
  [int]$Threshold = 36
)

Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"
$commodityDir = Join-Path $Root "web/public/brand/commodities"
$manifestPath = Join-Path $Root "brand/chatgpt-commodity-assets.json"

$processorSource = @"
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

public static class CommodityBackgroundAlpha {
  public static void Process(string path, int threshold) {
    string tempPath = path + ".tmp.png";
    using (var source = new Bitmap(path))
    using (var bitmap = new Bitmap(source.Width, source.Height, PixelFormat.Format32bppArgb)) {
      using (var g = Graphics.FromImage(bitmap)) {
        g.Clear(Color.Transparent);
        g.DrawImage(source, 0, 0, source.Width, source.Height);
      }

      int w = bitmap.Width;
      int h = bitmap.Height;
      bool[] visited = new bool[w * h];
      Queue<int> queue = new Queue<int>();

      Action<int, int> enqueue = (x, y) => {
        if (x < 0 || x >= w || y < 0 || y >= h) return;
        int idx = y * w + x;
        if (visited[idx]) return;
        Color c = bitmap.GetPixel(x, y);
        int max = Math.Max(c.R, Math.Max(c.G, c.B));
        if (max <= threshold) {
          visited[idx] = true;
          queue.Enqueue(idx);
        }
      };

      for (int x = 0; x < w; x++) {
        enqueue(x, 0);
        enqueue(x, h - 1);
      }
      for (int y = 0; y < h; y++) {
        enqueue(0, y);
        enqueue(w - 1, y);
      }

      int[] dx = new int[] { 1, -1, 0, 0 };
      int[] dy = new int[] { 0, 0, 1, -1 };
      while (queue.Count > 0) {
        int idx = queue.Dequeue();
        int x = idx % w;
        int y = idx / w;
        for (int i = 0; i < 4; i++) enqueue(x + dx[i], y + dy[i]);
      }

      for (int y = 0; y < h; y++) {
        for (int x = 0; x < w; x++) {
          int idx = y * w + x;
          if (!visited[idx]) continue;
          Color c = bitmap.GetPixel(x, y);
          bitmap.SetPixel(x, y, Color.FromArgb(0, c.R, c.G, c.B));
        }
      }

      // Feather one pixel around the removed region so the cut does not leave a black matte fringe.
      using (var feathered = new Bitmap(bitmap)) {
        for (int y = 1; y < h - 1; y++) {
          for (int x = 1; x < w - 1; x++) {
            int idx = y * w + x;
            if (visited[idx]) continue;

            bool touchesBackground =
              visited[idx - 1] || visited[idx + 1] || visited[idx - w] || visited[idx + w];
            if (!touchesBackground) continue;

            Color c = bitmap.GetPixel(x, y);
            int max = Math.Max(c.R, Math.Max(c.G, c.B));
            if (max <= threshold + 44) {
              int alpha = Math.Max(0, Math.Min(255, (max - threshold) * 6));
              feathered.SetPixel(x, y, Color.FromArgb(alpha, c.R, c.G, c.B));
            }
          }
        }
        feathered.Save(tempPath, ImageFormat.Png);
      }
    }
    File.Copy(tempPath, path, true);
    File.Delete(tempPath);
  }
}
"@

Add-Type -TypeDefinition $processorSource -ReferencedAssemblies System.Drawing

$targets = @(
  "fractal_dust.png",
  "plutonion_gas.png",
  "neon_glass.png",
  "helix_mud.png",
  "void_bloom.png",
  "oracle_resin.png",
  "velvet_tabs.png"
)

foreach ($file in $targets) {
  $path = Join-Path $commodityDir $file
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Missing commodity image: $path"
  }
  [CommodityBackgroundAlpha]::Process($path, $Threshold)
}

if (Test-Path -LiteralPath $manifestPath) {
  $manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
  foreach ($entry in $manifest.imported) {
    $localPath = Join-Path $Root $entry.output
    if (Test-Path -LiteralPath $localPath) {
      $entry.output_sha12 = (Get-FileHash -Algorithm SHA256 -LiteralPath $localPath).Hash.Substring(0, 12).ToLowerInvariant()
      if ($entry.PSObject.Properties.Name -contains "background") {
        $entry.background = "edge-connected dark studio background removed to alpha"
      } else {
        $entry | Add-Member -NotePropertyName "background" -NotePropertyValue "edge-connected dark studio background removed to alpha"
      }
    }
  }
  $manifest | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $manifestPath
}

Write-Host "Removed edge-connected dark studio backgrounds from imported commodity assets."
