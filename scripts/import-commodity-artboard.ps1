param(
  [string]$ReferencePath = "C:\Users\akmha\Downloads\ChatGPT Image Apr 17, 2026, 10_28_44 AM.png",
  [string]$Root = (Split-Path -Parent $PSScriptRoot)
)

Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"
$outDir = Join-Path $Root "web/public/brand/commodities"
$ideasDir = Join-Path $Root "web/public/brand/ideas"
New-Item -ItemType Directory -Force $outDir, $ideasDir | Out-Null

$img = [Drawing.Image]::FromFile($ReferencePath)

$items = @(
  @{ n = "fractal_dust.png";   x = 42;   y = 172; w = 296; h = 325 },
  @{ n = "plutonion_gas.png";  x = 358;  y = 172; w = 272; h = 325 },
  @{ n = "neon_glass.png";     x = 648;  y = 172; w = 267; h = 325 },
  @{ n = "helix_mud.png";      x = 934;  y = 172; w = 268; h = 325 },
  @{ n = "void_bloom.png";     x = 1222; y = 172; w = 270; h = 325 },
  @{ n = "oracle_resin.png";   x = 57;   y = 603; w = 281; h = 263 },
  @{ n = "velvet_tabs.png";    x = 358;  y = 603; w = 272; h = 263 },
  @{ n = "neon_dust.png";      x = 648;  y = 603; w = 267; h = 263 },
  @{ n = "phantom_crates.png"; x = 934;  y = 603; w = 268; h = 263 },
  @{ n = "ghost_chips.png";    x = 1222; y = 603; w = 270; h = 263 }
)

foreach ($it in $items) {
  $bmp = [Drawing.Bitmap]::new(512, 512, [Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.CompositingQuality = [Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.Clear([Drawing.Color]::Transparent)

  $scale = [Math]::Min(500 / $it.w, 430 / $it.h)
  $dw = [int]($it.w * $scale)
  $dh = [int]($it.h * $scale)
  $dx = [int]((512 - $dw) / 2)
  $dy = [int]((512 - $dh) / 2)

  $g.DrawImage(
    $img,
    [Drawing.Rectangle]::new($dx, $dy, $dw, $dh),
    [Drawing.Rectangle]::new($it.x, $it.y, $it.w, $it.h),
    [Drawing.GraphicsUnit]::Pixel
  )

  $bmp.Save((Join-Path $outDir $it.n), [Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
}

$sheet = [Drawing.Bitmap]::new(1280, 640, [Drawing.Imaging.PixelFormat]::Format32bppArgb)
$sg = [Drawing.Graphics]::FromImage($sheet)
$sg.SmoothingMode = [Drawing.Drawing2D.SmoothingMode]::AntiAlias
$sg.Clear([Drawing.Color]::FromArgb(255, 5, 6, 8))
$font = [Drawing.Font]::new("Consolas", 18, [Drawing.FontStyle]::Bold, [Drawing.GraphicsUnit]::Pixel)
$brush = [Drawing.SolidBrush]::new([Drawing.Color]::FromArgb(230, 232, 236, 245))

for ($i = 0; $i -lt $items.Count; $i++) {
  $asset = [Drawing.Image]::FromFile((Join-Path $outDir $items[$i].n))
  $x = ($i % 5) * 256
  $y = [Math]::Floor($i / 5) * 320
  $sg.DrawImage($asset, $x + 20, $y, 216, 216)
  $sg.DrawString($items[$i].n, $font, $brush, $x + 22, $y + 236)
  $asset.Dispose()
}

$sheet.Save((Join-Path $ideasDir "commodity-contact-sheet.png"), [Drawing.Imaging.ImageFormat]::Png)
$brush.Dispose()
$font.Dispose()
$sg.Dispose()
$sheet.Dispose()
$img.Dispose()

Write-Host "Imported commodity artboard crops into $outDir"
