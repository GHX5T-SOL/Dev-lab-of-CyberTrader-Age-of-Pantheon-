param(
  [string]$Root = (Split-Path -Parent $PSScriptRoot)
)

Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"
$commodityDir = Join-Path $Root "web/public/brand/commodities"
$ideasDir = Join-Path $Root "web/public/brand/ideas"
New-Item -ItemType Directory -Force $ideasDir | Out-Null

$items = @(
  @{ ticker = "FDST"; label = "Fractal Dust"; file = "fractal_dust.png" },
  @{ ticker = "PGAS"; label = "Plutonion Gas"; file = "plutonion_gas.png" },
  @{ ticker = "NGLS"; label = "Neon Glass"; file = "neon_glass.png" },
  @{ ticker = "HXMD"; label = "Helix Mud"; file = "helix_mud.png" },
  @{ ticker = "VBLO"; label = "Void Bloom"; file = "void_bloom.png" },
  @{ ticker = "ORES"; label = "Oracle Resin"; file = "oracle_resin.png" },
  @{ ticker = "VTAB"; label = "Velvet Tabs"; file = "velvet_tabs.png" },
  @{ ticker = "NDST"; label = "Neon Dust"; file = "neon_dust.png" },
  @{ ticker = "PCRT"; label = "Phantom Crates"; file = "phantom_crates.png" },
  @{ ticker = "GCHP"; label = "Ghost Chips"; file = "ghost_chips.png" }
)

$sheet = [Drawing.Bitmap]::new(1280, 720, [Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [Drawing.Graphics]::FromImage($sheet)
$g.SmoothingMode = [Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.CompositingQuality = [Drawing.Drawing2D.CompositingQuality]::HighQuality
$g.Clear([Drawing.Color]::FromArgb(255, 5, 6, 8))

$titleFont = [Drawing.Font]::new("Consolas", 26, [Drawing.FontStyle]::Bold, [Drawing.GraphicsUnit]::Pixel)
$tickerFont = [Drawing.Font]::new("Consolas", 20, [Drawing.FontStyle]::Bold, [Drawing.GraphicsUnit]::Pixel)
$labelFont = [Drawing.Font]::new("Consolas", 13, [Drawing.FontStyle]::Regular, [Drawing.GraphicsUnit]::Pixel)
$titleBrush = [Drawing.SolidBrush]::new([Drawing.Color]::FromArgb(235, 232, 236, 245))
$cyanBrush = [Drawing.SolidBrush]::new([Drawing.Color]::FromArgb(235, 0, 245, 255))
$mutedBrush = [Drawing.SolidBrush]::new([Drawing.Color]::FromArgb(180, 138, 148, 167))
$borderPen = [Drawing.Pen]::new([Drawing.Color]::FromArgb(120, 122, 91, 255), 1)

$g.DrawString("CYBERTRADER COMMODITIES", $titleFont, $titleBrush, 40, 28)
$g.DrawString("asset_vault_01 - current repo files", $labelFont, $mutedBrush, 44, 62)

for ($i = 0; $i -lt $items.Count; $i++) {
  $col = $i % 5
  $row = [int][Math]::Floor($i / 5)
  $x = 42 + ($col * 238)
  $y = 108 + ($row * 294)
  $assetPath = Join-Path $commodityDir $items[$i].file
  $asset = [Drawing.Image]::FromFile($assetPath)

  $g.DrawRectangle($borderPen, $x, $y, 210, 170)
  $g.DrawImage($asset, $x + 10, $y - 10, 190, 190)
  $g.DrawString($items[$i].ticker, $tickerFont, $cyanBrush, $x + 68, $y + 184)
  $g.DrawString($items[$i].label.ToUpperInvariant(), $labelFont, $titleBrush, $x + 28, $y + 214)

  $asset.Dispose()
}

$sheet.Save((Join-Path $ideasDir "commodity-contact-sheet.png"), [Drawing.Imaging.ImageFormat]::Png)

$borderPen.Dispose()
$mutedBrush.Dispose()
$cyanBrush.Dispose()
$titleBrush.Dispose()
$labelFont.Dispose()
$tickerFont.Dispose()
$titleFont.Dispose()
$g.Dispose()
$sheet.Dispose()

Write-Host "Generated commodity contact sheet from current repo assets."
