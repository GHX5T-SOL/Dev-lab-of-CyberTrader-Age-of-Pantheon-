param(
  [string]$Root = (Split-Path -Parent $PSScriptRoot)
)

Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"
$outDir = Join-Path $Root "web/public/brand/commodities"
$brandDir = Join-Path $Root "brand"
New-Item -ItemType Directory -Force $outDir, $brandDir | Out-Null

$mappings = @(
  @{
    ticker = "FDST"
    label = "Fractal Dust"
    source = "C:\Users\akmha\Downloads\ChatGPT Image Apr 20, 2026, 09_25_00 PM.png"
    output = "fractal_dust.png"
  },
  @{
    ticker = "PGAS"
    label = "Plutonion Gas"
    source = "C:\Users\akmha\Downloads\ChatGPT Image Apr 20, 2026, 09_25_58 PM.png"
    output = "plutonion_gas.png"
  },
  @{
    ticker = "NGLS"
    label = "Neon Glass"
    source = "C:\Users\akmha\Downloads\ChatGPT Image Apr 20, 2026, 09_26_52 PM.png"
    output = "neon_glass.png"
  },
  @{
    ticker = "HXMD"
    label = "Helix Mud"
    source = "C:\Users\akmha\Downloads\ChatGPT Image Apr 20, 2026, 09_27_54 PM.png"
    output = "helix_mud.png"
  },
  @{
    ticker = "VBLO"
    label = "Void Bloom"
    source = "C:\Users\akmha\Downloads\ChatGPT Image Apr 20, 2026, 09_28_51 PM.png"
    output = "void_bloom.png"
  },
  @{
    ticker = "ORES"
    label = "Oracle Resin"
    source = "C:\Users\akmha\Downloads\ChatGPT Image Apr 20, 2026, 09_30_02 PM.png"
    output = "oracle_resin.png"
  },
  @{
    ticker = "VTAB"
    label = "Velvet Tabs"
    source = "C:\Users\akmha\Downloads\ChatGPT Image Apr 20, 2026, 09_31_05 PM.png"
    output = "velvet_tabs.png"
  }
)

$manifest = @()

foreach ($item in $mappings) {
  if (-not (Test-Path -LiteralPath $item.source)) {
    throw "Missing source image: $($item.source)"
  }

  $dest = Join-Path $outDir $item.output
  $srcHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $item.source).Hash.Substring(0, 12).ToLowerInvariant()

  $src = [Drawing.Image]::FromFile($item.source)
  $bmp = [Drawing.Bitmap]::new(1024, 1024, [Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.CompositingQuality = [Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.Clear([Drawing.Color]::Transparent)
  $g.DrawImage($src, [Drawing.Rectangle]::new(0, 0, 1024, 1024), [Drawing.Rectangle]::new(0, 0, $src.Width, $src.Height), [Drawing.GraphicsUnit]::Pixel)
  $bmp.Save($dest, [Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
  $src.Dispose()

  $outHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $dest).Hash.Substring(0, 12).ToLowerInvariant()
  $manifest += [ordered]@{
    ticker = $item.ticker
    label = $item.label
    source = $item.source
    source_sha12 = $srcHash
    output = "web/public/brand/commodities/$($item.output)"
    output_sha12 = $outHash
    imported_at = "2026-04-20"
    generator = "ChatGPT image generation, user supplied"
  }
}

$unused = @(
  @{
    note = "Unused duplicate Plutonion Gas containment-orb candidate; not mapped to NDST/PCRT because it does not match those commodity specs."
    source = "C:\Users\akmha\Downloads\ChatGPT Image Apr 20, 2026, 09_32_07 PM.png"
    source_sha12 = (Get-FileHash -Algorithm SHA256 -LiteralPath "C:\Users\akmha\Downloads\ChatGPT Image Apr 20, 2026, 09_32_07 PM.png").Hash.Substring(0, 12).ToLowerInvariant()
  }
)

[ordered]@{
  imported = $manifest
  not_imported = $unused
  still_needed = @(
    @{ ticker = "NDST"; label = "Neon Dust"; output = "web/public/brand/commodities/neon_dust.png"; needed = "glowing powder pile with energy mist" },
    @{ ticker = "PCRT"; label = "Phantom Crates"; output = "web/public/brand/commodities/phantom_crates.png"; needed = "futuristic encrypted crate with glowing symbol core" }
  )
} | ConvertTo-Json -Depth 5 | Set-Content -Path (Join-Path $brandDir "chatgpt-commodity-assets.json")

Write-Host "Imported ChatGPT commodity assets for FDST, PGAS, NGLS, HXMD, VBLO, ORES, and VTAB."
