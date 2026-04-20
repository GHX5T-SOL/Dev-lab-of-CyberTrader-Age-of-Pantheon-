param(
  [string]$Root = (Split-Path -Parent $PSScriptRoot)
)

Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"
$outDir = Join-Path $Root "web/public/brand/commodities"
New-Item -ItemType Directory -Force $outDir | Out-Null

function C([string]$hex, [int]$alpha = 255) {
  $h = $hex.TrimStart("#")
  [Drawing.Color]::FromArgb($alpha, [Convert]::ToInt32($h.Substring(0, 2), 16), [Convert]::ToInt32($h.Substring(2, 2), 16), [Convert]::ToInt32($h.Substring(4, 2), 16))
}

function PF([float]$x, [float]$y) {
  [Drawing.PointF]::new($x, $y)
}

function RectF([float]$x, [float]$y, [float]$w, [float]$h) {
  [Drawing.RectangleF]::new($x, $y, $w, $h)
}

function DrawRadialGlow($g, [float]$cx, [float]$cy, [float]$rx, [float]$ry, [string]$hex, [int]$alpha = 120) {
  for ($i = 18; $i -ge 1; $i--) {
    $a = [int]($alpha * ($i / 18.0) * 0.42)
    $scale = 0.35 + ($i * 0.09)
    $brush = [Drawing.SolidBrush]::new((C $hex $a))
    $g.FillEllipse($brush, $cx - ($rx * $scale), $cy - ($ry * $scale), $rx * 2 * $scale, $ry * 2 * $scale)
    $brush.Dispose()
  }
}

function DrawEllipseGradient($g, [Drawing.RectangleF]$rect, [string]$center, [int]$centerAlpha, [string]$edge, [int]$edgeAlpha) {
  $path = [Drawing.Drawing2D.GraphicsPath]::new()
  $path.AddEllipse($rect)
  $brush = [Drawing.Drawing2D.PathGradientBrush]::new($path)
  $brush.CenterColor = C $center $centerAlpha
  $brush.SurroundColors = [Drawing.Color[]]@(C $edge $edgeAlpha)
  $g.FillPath($brush, $path)
  $brush.Dispose()
  $path.Dispose()
}

function FillPoly($g, $pts, [string]$fill, [int]$alpha, [string]$stroke = "#00F5FF", [int]$strokeAlpha = 160, [float]$strokeWidth = 3) {
  $brush = [Drawing.SolidBrush]::new((C $fill $alpha))
  $pen = [Drawing.Pen]::new((C $stroke $strokeAlpha), $strokeWidth)
  $g.FillPolygon($brush, [Drawing.PointF[]]$pts)
  $g.DrawPolygon($pen, [Drawing.PointF[]]$pts)
  $pen.Dispose()
  $brush.Dispose()
}

function DrawNeonLine($g, [Drawing.PointF[]]$points, [string]$hex, [int]$alpha = 210, [float]$width = 4) {
  $glow = [Drawing.Pen]::new((C $hex 60), $width * 4)
  $glow.LineJoin = [Drawing.Drawing2D.LineJoin]::Round
  $pen = [Drawing.Pen]::new((C $hex $alpha), $width)
  $pen.LineJoin = [Drawing.Drawing2D.LineJoin]::Round
  $g.DrawLines($glow, $points)
  $g.DrawLines($pen, $points)
  $pen.Dispose()
  $glow.Dispose()
}

function NewAsset($fileName, [scriptblock]$draw) {
  $bmp = [Drawing.Bitmap]::new(1024, 1024, [Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.CompositingQuality = [Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.Clear([Drawing.Color]::Transparent)

  DrawRadialGlow $g 512 610 150 82 "#7A5BFF" 55
  DrawRadialGlow $g 430 515 92 76 "#00F5FF" 34
  DrawRadialGlow $g 612 500 96 78 "#FF2A4D" 38
  & $draw $g

  $out = Join-Path $outDir $fileName
  $bmp.Save($out, [Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
}

function DrawCircuitFace($g, [float]$x, [float]$y, [float]$w, [float]$h, [string]$accent) {
  $pen = [Drawing.Pen]::new((C $accent 205), 4)
  $thin = [Drawing.Pen]::new((C $accent 140), 2)
  $g.DrawRectangle($pen, $x, $y, $w, $h)
  $g.DrawLine($thin, $x + 40, $y + 44, $x + $w - 50, $y + 44)
  $g.DrawLine($thin, $x + 40, $y + 88, $x + 120, $y + 88)
  $g.DrawLine($thin, $x + $w - 58, $y + 44, $x + $w - 58, $y + 116)
  $g.DrawLine($thin, $x + 78, $y + $h - 50, $x + $w - 62, $y + $h - 50)
  $g.FillEllipse([Drawing.SolidBrush]::new((C $accent 220)), $x + 115, $y + 80, 10, 10)
  $g.FillEllipse([Drawing.SolidBrush]::new((C $accent 220)), $x + $w - 64, $y + 112, 10, 10)
  $thin.Dispose()
  $pen.Dispose()
}

NewAsset "helix_mud.png" {
  param($g)
  DrawEllipseGradient $g (RectF 286 618 452 120) "#230025" 165 "#070910" 0
  DrawRadialGlow $g 512 635 150 50 "#FF2A4D" 88

  $poolPen = [Drawing.Pen]::new((C "#7A5BFF" 170), 5)
  $cyanPen = [Drawing.Pen]::new((C "#00F5FF" 135), 3)
  for ($i = 0; $i -lt 6; $i++) {
    $g.DrawEllipse($poolPen, 315 + ($i * 14), 625 + ($i * 8), 390 - ($i * 28), 86 - ($i * 12))
  }
  $g.DrawArc($cyanPen, 330, 646, 360, 56, 202, 122)

  $mudBrush = [Drawing.Drawing2D.LinearGradientBrush]::new((RectF 400 210 230 430), (C "#090A12" 235), (C "#2E003D" 230), [Drawing.Drawing2D.LinearGradientMode]::Vertical)
  $path = [Drawing.Drawing2D.GraphicsPath]::new()
  $path.AddBezier((PF 500 210), (PF 420 310), (PF 600 380), (PF 512 500))
  $path.AddBezier((PF 512 500), (PF 435 580), (PF 600 610), (PF 520 650))
  $path.AddBezier((PF 520 650), (PF 620 540), (PF 430 480), (PF 545 390))
  $path.AddBezier((PF 545 390), (PF 610 330), (PF 530 265), (PF 500 210))
  $g.FillPath($mudBrush, $path)
  $g.DrawPath([Drawing.Pen]::new((C "#FF2A4D" 155), 5), $path)
  $g.DrawPath([Drawing.Pen]::new((C "#00F5FF" 95), 2), $path)

  DrawNeonLine $g ([Drawing.PointF[]]@((PF 430 300), (PF 600 365), (PF 430 450), (PF 610 530), (PF 450 615))) "#00F5FF" 150 3
  DrawNeonLine $g ([Drawing.PointF[]]@((PF 600 260), (PF 430 350), (PF 610 435), (PF 430 520), (PF 590 600))) "#FF2A4D" 160 3

  $poolPen.Dispose()
  $cyanPen.Dispose()
  $mudBrush.Dispose()
  $path.Dispose()
}

NewAsset "void_bloom.png" {
  param($g)
  DrawRadialGlow $g 520 560 132 112 "#FF2A4D" 70
  DrawRadialGlow $g 500 528 74 72 "#00F5FF" 38

  for ($i = 0; $i -lt 8; $i++) {
    $angle = (($i * 45) - 90) * [Math]::PI / 180
    $cx = 512 + [Math]::Cos($angle) * 148
    $cy = 560 + [Math]::Sin($angle) * 94
    $path = [Drawing.Drawing2D.GraphicsPath]::new()
    $path.AddBezier((PF 512 568), (PF ($cx - 78) ($cy - 38)), (PF ($cx - 58) ($cy - 150)), (PF $cx ($cy - 18)))
    $path.AddBezier((PF $cx ($cy - 18)), (PF ($cx + 94) ($cy + 44)), (PF ($cx + 38) ($cy + 135)), (PF 512 568))
    $brush = [Drawing.Drawing2D.PathGradientBrush]::new($path)
    $brush.CenterColor = C "#FF2A4D" 185
    $brush.SurroundColors = [Drawing.Color[]]@(C "#090012" 34)
    $g.FillPath($brush, $path)
    $g.DrawPath([Drawing.Pen]::new((C "#FF2A4D" 150), 6), $path)
    if ($i % 2 -eq 0) { $g.DrawPath([Drawing.Pen]::new((C "#00F5FF" 90), 2), $path) }
    $brush.Dispose()
    $path.Dispose()
  }

  $corePath = [Drawing.Drawing2D.GraphicsPath]::new()
  $corePath.AddClosedCurve([Drawing.PointF[]]@((PF 458 520), (PF 498 468), (PF 566 486), (PF 602 548), (PF 560 622), (PF 488 614)))
  $coreBrush = [Drawing.Drawing2D.PathGradientBrush]::new($corePath)
  $coreBrush.CenterColor = C "#7A5BFF" 230
  $coreBrush.SurroundColors = [Drawing.Color[]]@(C "#050608" 120)
  $g.FillPath($coreBrush, $corePath)
  $g.DrawPath([Drawing.Pen]::new((C "#FF2A4D" 175), 4), $corePath)
  DrawRadialGlow $g 522 548 46 38 "#E8ECF5" 54
  $coreBrush.Dispose()
  $corePath.Dispose()

  $rand = [Random]::new(8080)
  for ($i = 0; $i -lt 70; $i++) {
    $x = $rand.Next(380, 660)
    $y = $rand.Next(390, 690)
    $r = $rand.Next(3, 9)
    $brush = [Drawing.SolidBrush]::new((C ($(if ($i % 3 -eq 0) { "#00F5FF" } else { "#FF2A4D" })) 115))
    $g.FillEllipse($brush, $x, $y, $r, $r)
    $brush.Dispose()
  }
}

NewAsset "oracle_resin.png" {
  param($g)
  DrawRadialGlow $g 520 560 150 105 "#00F5FF" 78

  $top = @((PF 278 360), (PF 472 252), (PF 750 318), (PF 552 430))
  $left = @((PF 278 360), (PF 552 430), (PF 552 724), (PF 284 604))
  $right = @((PF 552 430), (PF 750 318), (PF 744 596), (PF 552 724))
  FillPoly $g $left "#08232D" 205 "#00F5FF" 160 4
  FillPoly $g $right "#0A182A" 220 "#7A5BFF" 150 4
  FillPoly $g $top "#163D4A" 190 "#67FFB5" 130 4

  $inner = @((PF 360 420), (PF 524 340), (PF 660 388), (PF 500 482))
  FillPoly $g $inner "#00F5FF" 52 "#E8ECF5" 90 2
  DrawCircuitFace $g 355 470 270 150 "#00F5FF"
  DrawNeonLine $g ([Drawing.PointF[]]@((PF 390 585), (PF 460 542), (PF 520 610), (PF 610 552), (PF 680 598))) "#67FFB5" 145 4
}

NewAsset "velvet_tabs.png" {
  param($g)
  DrawRadialGlow $g 520 560 150 100 "#7A5BFF" 70
  for ($i = 0; $i -lt 4; $i++) {
    $dx = $i * 42
    $dy = $i * 42
    $top = @((PF (265 + $dx) (330 + $dy)), (PF (635 + $dx) (360 + $dy)), (PF (716 + $dx) (455 + $dy)), (PF (330 + $dx) (435 + $dy)))
    $side = @((PF (330 + $dx) (435 + $dy)), (PF (716 + $dx) (455 + $dy)), (PF (684 + $dx) (510 + $dy)), (PF (302 + $dx) (492 + $dy)))
    FillPoly $g $side "#070810" 230 "#7A5BFF" 115 3
    FillPoly $g $top "#171226" 235 "#FF2A4D" 145 4
    DrawNeonLine $g ([Drawing.PointF[]]@((PF (340 + $dx) (380 + $dy)), (PF (600 + $dx) (402 + $dy)), (PF (650 + $dx) (446 + $dy)))) "#7A5BFF" 150 3
    DrawNeonLine $g ([Drawing.PointF[]]@((PF (392 + $dx) (414 + $dy)), (PF (560 + $dx) (426 + $dy)))) "#00F5FF" 110 2
  }

  $font = [Drawing.Font]::new("Consolas", 34, [Drawing.FontStyle]::Bold, [Drawing.GraphicsUnit]::Pixel)
  $brush = [Drawing.SolidBrush]::new((C "#FF2A4D" 170))
  $g.DrawString("VELVET", $font, $brush, 405, 490)
  $brush.Dispose()
  $font.Dispose()
}

NewAsset "neon_dust.png" {
  param($g)
  DrawRadialGlow $g 515 625 150 76 "#FF2A4D" 74
  DrawEllipseGradient $g (RectF 334 632 360 92) "#FF2A4D" 120 "#050608" 0
  FillPoly $g @((PF 334 690), (PF 420 565), (PF 512 470), (PF 620 568), (PF 704 690)) "#FF2A4D" 72 "#FF2A4D" 118 3

  $rand = [Random]::new(31337)
  for ($layer = 0; $layer -lt 5; $layer++) {
    for ($i = 0; $i -lt 210; $i++) {
      $x = $rand.Next(330, 705)
      $y = $rand.Next(420 + ($layer * 26), 710)
      $dist = [Math]::Abs($x - 512) / 205.0
      $cap = 708 - [int](230 * (1 - [Math]::Min(1, $dist)))
      if ($y -gt $cap) { continue }
      $r = $rand.Next(3, 14)
      $palette = @("#FF2A4D", "#7A5BFF", "#00F5FF")
      $hex = $palette[$rand.Next(0, $palette.Count)]
      $brush = [Drawing.SolidBrush]::new((C $hex $rand.Next(120, 220)))
      $g.FillEllipse($brush, $x, $y, $r, $r)
      $brush.Dispose()
    }
  }

  DrawRadialGlow $g 512 570 58 88 "#E8ECF5" 36
  DrawNeonLine $g ([Drawing.PointF[]]@((PF 408 675), (PF 508 482), (PF 622 675))) "#7A5BFF" 85 2
}

NewAsset "phantom_crates.png" {
  param($g)
  DrawRadialGlow $g 520 575 155 112 "#00F5FF" 76

  $top = @((PF 260 360), (PF 520 245), (PF 792 360), (PF 520 486))
  $front = @((PF 260 360), (PF 520 486), (PF 520 760), (PF 260 612))
  $side = @((PF 520 486), (PF 792 360), (PF 792 616), (PF 520 760))
  FillPoly $g $front "#0A1119" 240 "#00F5FF" 150 5
  FillPoly $g $side "#111420" 240 "#7A5BFF" 120 5
  FillPoly $g $top "#142431" 230 "#00F5FF" 150 5

  DrawCircuitFace $g 334 493 260 155 "#00F5FF"
  FillPoly $g @((PF 520 390), (PF 595 432), (PF 520 480), (PF 445 432)) "#050608" 195 "#00F5FF" 190 4
  DrawRadialGlow $g 520 432 66 48 "#00F5FF" 125
  DrawNeonLine $g ([Drawing.PointF[]]@((PF 306 608), (PF 520 724), (PF 738 608))) "#FF2A4D" 100 3

  for ($i = 0; $i -lt 5; $i++) {
    $pen = [Drawing.Pen]::new((C "#00F5FF" (90 - $i * 10)), 10 - $i)
    $g.DrawLine($pen, 285, 375 + ($i * 47), 512, 490 + ($i * 52))
    $g.DrawLine($pen, 535, 500 + ($i * 50), 765, 382 + ($i * 47))
    $pen.Dispose()
  }
}

Write-Host "Redesigned HXMD, VBLO, ORES, VTAB, NDST, and PCRT commodity assets."
