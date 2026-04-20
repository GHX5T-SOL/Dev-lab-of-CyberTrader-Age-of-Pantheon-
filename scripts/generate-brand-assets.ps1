param(
  [string]$Root = (Split-Path -Parent $PSScriptRoot)
)

Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"
$webBrand = Join-Path $Root "web/public/brand"
$commodityDir = Join-Path $webBrand "commodities"
$logoDir = Join-Path $webBrand "logo"
$ideasDir = Join-Path $webBrand "ideas"
$rootLogoDir = Join-Path $Root "brand/logo"

New-Item -ItemType Directory -Force $commodityDir, $logoDir, $ideasDir, $rootLogoDir, (Join-Path $logoDir "logo-adaptive-android"), (Join-Path $rootLogoDir "logo-adaptive-android") | Out-Null

function ColorFromHex([string]$hex, [int]$alpha = 255) {
  $h = $hex.TrimStart("#")
  return [System.Drawing.Color]::FromArgb($alpha, [Convert]::ToInt32($h.Substring(0,2),16), [Convert]::ToInt32($h.Substring(2,2),16), [Convert]::ToInt32($h.Substring(4,2),16))
}

function PointF([float]$x, [float]$y) {
  return [System.Drawing.PointF]::new($x, $y)
}

function RegularPolygon([float]$cx, [float]$cy, [float]$rx, [float]$ry, [int]$n, [float]$rot = -90) {
  $pts = New-Object System.Drawing.PointF[] $n
  for ($i = 0; $i -lt $n; $i++) {
    $a = (($rot + (360 * $i / $n)) * [Math]::PI) / 180
    $pts[$i] = PointF ($cx + [Math]::Cos($a) * $rx) ($cy + [Math]::Sin($a) * $ry)
  }
  return $pts
}

function DrawGlow($g, [float]$cx, [float]$cy, [float]$rx, [float]$ry, [string]$hex, [int]$maxAlpha = 80) {
  for ($i = 7; $i -ge 1; $i--) {
    $a = [int]($maxAlpha * $i / 7)
    $brush = [System.Drawing.SolidBrush]::new((ColorFromHex $hex $a))
    $scale = 1 + ($i * 0.18)
    $g.FillEllipse($brush, $cx - $rx * $scale, $cy - $ry * $scale, $rx * 2 * $scale, $ry * 2 * $scale)
    $brush.Dispose()
  }
}

function DrawScannerRing($g, [string]$accent, [string]$heat = "#FFB341") {
  DrawGlow $g 256 256 118 118 $accent 55
  $penDim = [System.Drawing.Pen]::new((ColorFromHex "#00F5FF" 75), 2)
  $penAccent = [System.Drawing.Pen]::new((ColorFromHex $accent 190), 4)
  $penHeat = [System.Drawing.Pen]::new((ColorFromHex $heat 150), 2)
  $g.DrawEllipse($penDim, 96, 96, 320, 320)
  $g.DrawArc($penAccent, 112, 112, 288, 288, -28, 74)
  $g.DrawArc($penAccent, 112, 112, 288, 288, 152, 74)
  $g.DrawLine($penHeat, 118, 256, 82, 256)
  $g.DrawLine($penHeat, 394, 256, 430, 256)
  $penDim.Dispose(); $penAccent.Dispose(); $penHeat.Dispose()
}

function FillPoly($g, $points, [string]$fill, [int]$alpha, [string]$stroke = "#00F5FF", [int]$strokeAlpha = 170, [float]$strokeWidth = 2) {
  $brush = [System.Drawing.SolidBrush]::new((ColorFromHex $fill $alpha))
  $pen = [System.Drawing.Pen]::new((ColorFromHex $stroke $strokeAlpha), $strokeWidth)
  $g.FillPolygon($brush, $points)
  $g.DrawPolygon($pen, $points)
  $brush.Dispose(); $pen.Dispose()
}

function DrawCrystal($g, [float]$cx, [float]$cy, [float]$scale, [string]$accent) {
  $top = PointF $cx ($cy - 95 * $scale)
  $left = PointF ($cx - 60 * $scale) ($cy + 22 * $scale)
  $right = PointF ($cx + 58 * $scale) ($cy + 18 * $scale)
  $base = PointF ($cx - 2 * $scale) ($cy + 96 * $scale)
  FillPoly $g @($top,$right,$base,$left) "#10212A" 210 $accent 190 2
  FillPoly $g @($top,(PointF ($cx + 8*$scale) ($cy - 10*$scale)),$left) "#1F5D66" 120 "#E8ECF5" 90 1
  FillPoly $g @($top,$right,(PointF ($cx + 8*$scale) ($cy - 10*$scale))) "#7A5BFF" 85 "#00F5FF" 110 1
  FillPoly $g @($left,(PointF ($cx + 8*$scale) ($cy - 10*$scale)),$base) "#050608" 130 "#67FFB5" 90 1
}

function DrawChip($g, [float]$x, [float]$y, [float]$w, [float]$h, [string]$accent) {
  $rect = [System.Drawing.RectangleF]::new($x, $y, $w, $h)
  $brush = [System.Drawing.SolidBrush]::new((ColorFromHex "#08120F" 230))
  $pen = [System.Drawing.Pen]::new((ColorFromHex $accent 210), 3)
  $g.FillRectangle($brush, $rect)
  $g.DrawRectangle($pen, $x, $y, $w, $h)
  $trace = [System.Drawing.Pen]::new((ColorFromHex "#67FFB5" 170), 2)
  for ($i=1; $i -le 5; $i++) {
    $yy = $y + ($h * $i / 6)
    $g.DrawLine($trace, $x + 18, $yy, $x + $w - 18, $yy)
  }
  $brush.Dispose(); $pen.Dispose(); $trace.Dispose()
}

function SaveCommodity([string]$fileName, [string]$ticker, [string]$accent, [scriptblock]$draw) {
  $bmp = [System.Drawing.Bitmap]::new(512, 512, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.Clear([System.Drawing.Color]::Transparent)
  DrawScannerRing $g $accent
  & $draw $g
  $font = [System.Drawing.Font]::new("Consolas", 28, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $brush = [System.Drawing.SolidBrush]::new((ColorFromHex "#E8ECF5" 185))
  $sf = [System.Drawing.StringFormat]::new()
  $sf.Alignment = [System.Drawing.StringAlignment]::Center
  $g.DrawString($ticker, $font, $brush, [System.Drawing.RectangleF]::new(0, 426, 512, 42), $sf)
  $out = Join-Path $commodityDir $fileName
  $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
  $sf.Dispose(); $brush.Dispose(); $font.Dispose(); $g.Dispose(); $bmp.Dispose()
}

SaveCommodity "fractal_dust.png" "FDST" "#7A5BFF" {
  param($g)
  DrawCrystal $g 256 254 1.02 "#7A5BFF"
  DrawCrystal $g 188 286 0.52 "#00F5FF"
  DrawCrystal $g 326 294 0.46 "#67FFB5"
  DrawGlow $g 256 280 78 42 "#67FFB5" 55
}

SaveCommodity "plutonion_gas.png" "PGAS" "#00F5FF" {
  param($g)
  DrawGlow $g 256 252 100 86 "#00F5FF" 92
  $pen = [System.Drawing.Pen]::new((ColorFromHex "#67FFB5" 170), 4)
  $brush = [System.Drawing.SolidBrush]::new((ColorFromHex "#092225" 190))
  $g.FillEllipse($brush, 168, 166, 176, 172)
  $g.DrawEllipse($pen, 168, 166, 176, 172)
  for ($i=0; $i -lt 7; $i++) { $g.DrawArc($pen, 182 + $i*5, 194 - $i*2, 148 - $i*10, 92 + $i*4, 205, 190) }
  $brush.Dispose(); $pen.Dispose()
}

SaveCommodity "neon_glass.png" "NGLS" "#FF2A4D" {
  param($g)
  FillPoly $g @((PointF 178 314), (PointF 246 142), (PointF 354 214), (PointF 300 362)) "#162C35" 150 "#00F5FF" 185 3
  FillPoly $g @((PointF 214 328), (PointF 286 162), (PointF 374 272), (PointF 306 384)) "#FF2A4D" 65 "#E8ECF5" 120 2
  FillPoly $g @((PointF 136 258), (PointF 226 178), (PointF 250 318), (PointF 166 382)) "#67FFB5" 55 "#67FFB5" 150 2
}

SaveCommodity "helix_mud.png" "HXMD" "#7A5BFF" {
  param($g)
  DrawGlow $g 256 270 98 72 "#FFB341" 80
  $mud = [System.Drawing.SolidBrush]::new((ColorFromHex "#3D2B1F" 220))
  $g.FillEllipse($mud, 166, 270, 180, 88)
  $pen = [System.Drawing.Pen]::new((ColorFromHex "#67FFB5" 190), 5)
  for ($i=0; $i -lt 5; $i++) { $g.DrawArc($pen, 188, 154 + $i*30, 138, 56, 180, 245) }
  $mud.Dispose(); $pen.Dispose()
}

SaveCommodity "void_bloom.png" "VBLO" "#67FFB5" {
  param($g)
  DrawGlow $g 256 262 100 100 "#67FFB5" 88
  for ($i=0; $i -lt 8; $i++) {
    $a = ($i * 45) * [Math]::PI / 180
    $x = 256 + [Math]::Cos($a)*58
    $y = 258 + [Math]::Sin($a)*58
    $brush = [System.Drawing.SolidBrush]::new((ColorFromHex "#102B25" 200))
    $pen = [System.Drawing.Pen]::new((ColorFromHex "#67FFB5" 175), 3)
    $g.FillEllipse($brush, $x-36, $y-54, 72, 108)
    $g.DrawEllipse($pen, $x-36, $y-54, 72, 108)
    $brush.Dispose(); $pen.Dispose()
  }
  $core = [System.Drawing.SolidBrush]::new((ColorFromHex "#FFB341" 220))
  $g.FillEllipse($core, 224, 226, 64, 64)
  $core.Dispose()
}

SaveCommodity "oracle_resin.png" "ORES" "#00F5FF" {
  param($g)
  FillPoly $g @((PointF 256 138), (PointF 340 250), (PointF 304 362), (PointF 210 370), (PointF 164 252)) "#FFB341" 175 "#00F5FF" 155 3
  $pen = [System.Drawing.Pen]::new((ColorFromHex "#67FFB5" 180), 3)
  $g.DrawBezier($pen, 256, 156, 220, 210, 300, 260, 250, 350)
  $g.DrawBezier($pen, 242, 214, 290, 230, 274, 282, 318, 316)
  $pen.Dispose()
}

SaveCommodity "velvet_tabs.png" "VTAB" "#7A5BFF" {
  param($g)
  for ($i=0; $i -lt 4; $i++) {
    $x = 178 + $i*28
    $y = 178 + $i*34
    FillPoly $g @((PointF $x $y), (PointF ($x+128) ($y+12)), (PointF ($x+108) ($y+70)), (PointF ($x-18) ($y+58))) "#191126" 220 "#7A5BFF" 190 3
  }
  $pen = [System.Drawing.Pen]::new((ColorFromHex "#00F5FF" 160), 2)
  $g.DrawLine($pen, 198, 236, 326, 248)
  $g.DrawLine($pen, 184, 292, 304, 304)
  $pen.Dispose()
}

SaveCommodity "neon_dust.png" "NDST" "#FF2A4D" {
  param($g)
  FillPoly $g @((PointF 168 216), (PointF 256 154), (PointF 344 216), (PointF 344 318), (PointF 256 376), (PointF 168 318)) "#08131B" 120 "#FF2A4D" 160 3
  $rand = [Random]::new(2077)
  for ($i=0; $i -lt 90; $i++) {
    $x = $rand.Next(188,324); $y = $rand.Next(196,336); $r = $rand.Next(2,6)
    $brush = [System.Drawing.SolidBrush]::new((ColorFromHex ($(if ($i % 3 -eq 0) {"#00F5FF"} elseif ($i % 3 -eq 1) {"#67FFB5"} else {"#FF2A4D"})) 170))
    $g.FillEllipse($brush, $x, $y, $r, $r)
    $brush.Dispose()
  }
}

SaveCommodity "phantom_crates.png" "PCRT" "#00F5FF" {
  param($g)
  FillPoly $g @((PointF 176 214), (PointF 256 166), (PointF 336 214), (PointF 256 264)) "#0D1B21" 170 "#00F5FF" 170 3
  FillPoly $g @((PointF 176 214), (PointF 256 264), (PointF 256 370), (PointF 176 318)) "#050608" 180 "#00F5FF" 140 3
  FillPoly $g @((PointF 336 214), (PointF 256 264), (PointF 256 370), (PointF 336 318)) "#13242B" 170 "#67FFB5" 140 3
  $pen = [System.Drawing.Pen]::new((ColorFromHex "#FF2A4D" 140), 2)
  $g.DrawLine($pen, 176, 318, 336, 214)
  $g.DrawLine($pen, 336, 318, 176, 214)
  $pen.Dispose()
}

SaveCommodity "ghost_chips.png" "GCHP" "#7A5BFF" {
  param($g)
  DrawChip $g 174 174 164 168 "#7A5BFF"
  $skullPen = [System.Drawing.Pen]::new((ColorFromHex "#00F5FF" 180), 4)
  $g.DrawEllipse($skullPen, 224, 214, 64, 58)
  $g.DrawLine($skullPen, 238, 292, 274, 292)
  $g.DrawLine($skullPen, 246, 272, 246, 302)
  $g.DrawLine($skullPen, 266, 272, 266, 302)
  $skullPen.Dispose()
}

$primarySvg = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 240" fill="none">
  <rect width="960" height="240" fill="#050608"/>
  <path d="M96 188 168 52 240 188H96Z" stroke="#00F5FF" stroke-width="8" stroke-linejoin="miter"/>
  <path d="M122 136H214M158 136H252" stroke="#67FFB5" stroke-width="6"/>
  <path d="M286 74h330v28H286zM286 126h452v28H286zM286 178h260v18H286z" fill="#00F5FF"/>
  <path d="M624 74h38v28h-38zM752 126h44v28h-44zM560 178h54v18h-54z" fill="#FF2A4D"/>
  <text x="286" y="224" fill="#E8ECF5" font-family="Consolas, monospace" font-size="28" letter-spacing="6">AGE OF PANTHEON</text>
</svg>
'@
$markSvg = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none">
  <rect width="256" height="256" fill="#050608"/>
  <path d="M46 210 128 38 210 210H46Z" stroke="#00F5FF" stroke-width="10" stroke-linejoin="miter"/>
  <path d="M76 136h104M118 136h72" stroke="#67FFB5" stroke-width="8"/>
  <path d="M172 72h30M54 188h22" stroke="#FF2A4D" stroke-width="6"/>
</svg>
'@
$monoSvg = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none">
  <path d="M46 210 128 38 210 210H46Z" stroke="currentColor" stroke-width="10" stroke-linejoin="miter"/>
  <path d="M76 136h104M118 136h72" stroke="currentColor" stroke-width="8"/>
</svg>
'@
$faviconSvg = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="8" fill="#050608"/>
  <path d="M13 54 32 9 51 54H13Z" stroke="#00F5FF" stroke-width="4" stroke-linejoin="miter"/>
  <path d="M20 34h25M30 34h19" stroke="#67FFB5" stroke-width="3"/>
  <path d="M46 17h8M9 49h6" stroke="#FF2A4D" stroke-width="2"/>
</svg>
'@

[IO.File]::WriteAllText((Join-Path $rootLogoDir "logo-primary.svg"), $primarySvg)
[IO.File]::WriteAllText((Join-Path $rootLogoDir "logo-primary-light.svg"), $primarySvg.Replace('#050608','#E8ECF5').Replace('#E8ECF5','#050608'))
[IO.File]::WriteAllText((Join-Path $rootLogoDir "logo-mark.svg"), $markSvg)
[IO.File]::WriteAllText((Join-Path $rootLogoDir "logo-mono.svg"), $monoSvg)
[IO.File]::WriteAllText((Join-Path $rootLogoDir "favicon.svg"), $faviconSvg)
[IO.File]::WriteAllText((Join-Path $logoDir "primary.svg"), $primarySvg)
[IO.File]::WriteAllText((Join-Path $logoDir "mark.svg"), $markSvg)
[IO.File]::WriteAllText((Join-Path $logoDir "favicon.svg"), $faviconSvg)

function SaveLogoPng([string]$out, [int]$size, [scriptblock]$draw) {
  $bmp = [System.Drawing.Bitmap]::new($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.Clear((ColorFromHex "#050608" 255))
  & $draw $g $size
  $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
}

$drawMark = {
  param($g, $size)
  $s = $size / 256
  $penC = [System.Drawing.Pen]::new((ColorFromHex "#00F5FF" 240), [Math]::Max(4, 10*$s))
  $penG = [System.Drawing.Pen]::new((ColorFromHex "#67FFB5" 240), [Math]::Max(3, 8*$s))
  $penH = [System.Drawing.Pen]::new((ColorFromHex "#FF2A4D" 210), [Math]::Max(2, 6*$s))
  $tri = @((PointF (46*$s) (210*$s)), (PointF (128*$s) (38*$s)), (PointF (210*$s) (210*$s)))
  $g.DrawPolygon($penC, $tri)
  $g.DrawLine($penG, 76*$s, 136*$s, 180*$s, 136*$s)
  $g.DrawLine($penG, 118*$s, 136*$s, 190*$s, 136*$s)
  $g.DrawLine($penH, 172*$s, 72*$s, 202*$s, 72*$s)
  $g.DrawLine($penH, 54*$s, 188*$s, 76*$s, 188*$s)
  $penC.Dispose(); $penG.Dispose(); $penH.Dispose()
}

SaveLogoPng (Join-Path $logoDir "mark.png") 1024 $drawMark
SaveLogoPng (Join-Path $rootLogoDir "logo-app-icon.png") 1024 $drawMark
SaveLogoPng (Join-Path $logoDir "logo-app-icon.png") 1024 $drawMark
SaveLogoPng (Join-Path $logoDir "logo-adaptive-android/foreground.png") 432 $drawMark
SaveLogoPng (Join-Path $rootLogoDir "logo-adaptive-android/foreground.png") 432 $drawMark

$bgBmp = [System.Drawing.Bitmap]::new(432, 432, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bgG = [System.Drawing.Graphics]::FromImage($bgBmp)
$bgG.Clear((ColorFromHex "#050608" 255))
DrawGlow $bgG 216 216 96 96 "#00F5FF" 45
$bgBmp.Save((Join-Path $logoDir "logo-adaptive-android/background.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$bgBmp.Save((Join-Path $rootLogoDir "logo-adaptive-android/background.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$bgG.Dispose(); $bgBmp.Dispose()

$primaryPng = Join-Path $logoDir "primary.png"
$bmp = [System.Drawing.Bitmap]::new(1400, 420, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear((ColorFromHex "#050608" 255))
& $drawMark $g 280
$font = [System.Drawing.Font]::new("Consolas", 88, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$brush = [System.Drawing.SolidBrush]::new((ColorFromHex "#00F5FF" 245))
$g.DrawString("CYBERTRADER", $font, $brush, 340, 106)
$font2 = [System.Drawing.Font]::new("Consolas", 36, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$brush2 = [System.Drawing.SolidBrush]::new((ColorFromHex "#E8ECF5" 210))
$g.DrawString("AGE OF PANTHEON", $font2, $brush2, 346, 228)
$bmp.Save($primaryPng, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save((Join-Path $rootLogoDir "logo-primary.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$brush.Dispose(); $brush2.Dispose(); $font.Dispose(); $font2.Dispose(); $g.Dispose(); $bmp.Dispose()

$ideas = @'
# CyberTrader Asset Ideas

Generated concept set for asset_vault_01.

- Commodity direction: transparent 512 PNGs, holographic object silhouettes, faint internal glow, no baked background.
- Logo direction A: Eidolon triangle mark, cyan outline, acid glitch interrupt.
- Logo direction B: terminal wordmark with fractured scanline bars.
- Favicon direction: mark only, deep void square, tiny heat fragments.
- Pirate-skull direction: original signal-skull circuit mask, no external IP references.
- Motion direction: rotate commodity preview shells in CSS, not baked into source PNGs.

Use the SpriteCook FDST sample in `commodities/spritecook/fractal_dust_spritecook.png` as a premium render reference; use the generated transparent PNG set as the website-ready pass.
'@
[IO.File]::WriteAllText((Join-Path $ideasDir "README.md"), $ideas)

Write-Host "Generated commodity PNGs, logo assets, and idea board under web/public/brand and brand/logo."
