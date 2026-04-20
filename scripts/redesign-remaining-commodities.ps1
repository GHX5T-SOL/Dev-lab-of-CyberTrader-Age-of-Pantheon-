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

function NewPen([string]$hex, [int]$alpha, [float]$width) {
  $pen = [Drawing.Pen]::new((C $hex $alpha), $width)
  $pen.LineJoin = [Drawing.Drawing2D.LineJoin]::Round
  $pen.StartCap = [Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [Drawing.Drawing2D.LineCap]::Round
  $pen
}

function DrawRadialGlow($g, [float]$cx, [float]$cy, [float]$rx, [float]$ry, [string]$hex, [int]$alpha = 90) {
  for ($i = 18; $i -ge 1; $i--) {
    $a = [int]($alpha * [Math]::Pow($i / 18.0, 1.8))
    $scale = 0.22 + ($i * 0.055)
    $brush = [Drawing.SolidBrush]::new((C $hex $a))
    $g.FillEllipse($brush, $cx - ($rx * $scale), $cy - ($ry * $scale), $rx * 2 * $scale, $ry * 2 * $scale)
    $brush.Dispose()
  }
}

function FillEllipseGradient($g, [Drawing.RectangleF]$rect, [string]$center, [int]$centerAlpha, [string]$edge, [int]$edgeAlpha) {
  $path = [Drawing.Drawing2D.GraphicsPath]::new()
  $path.AddEllipse($rect)
  $brush = [Drawing.Drawing2D.PathGradientBrush]::new($path)
  $brush.CenterColor = C $center $centerAlpha
  $brush.SurroundColors = [Drawing.Color[]]@(C $edge $edgeAlpha)
  $g.FillPath($brush, $path)
  $brush.Dispose()
  $path.Dispose()
}

function FillPathGradient($g, [Drawing.Drawing2D.GraphicsPath]$path, [string]$center, [int]$centerAlpha, [string]$edge, [int]$edgeAlpha) {
  $brush = [Drawing.Drawing2D.PathGradientBrush]::new($path)
  $brush.CenterColor = C $center $centerAlpha
  $brush.SurroundColors = [Drawing.Color[]]@(C $edge $edgeAlpha)
  $g.FillPath($brush, $path)
  $brush.Dispose()
}

function FillPoly($g, $pts, [string]$fill, [int]$alpha, [string]$stroke = "#00F5FF", [int]$strokeAlpha = 160, [float]$strokeWidth = 3) {
  $brush = [Drawing.SolidBrush]::new((C $fill $alpha))
  $pen = NewPen $stroke $strokeAlpha $strokeWidth
  $g.FillPolygon($brush, [Drawing.PointF[]]$pts)
  $g.DrawPolygon($pen, [Drawing.PointF[]]$pts)
  $pen.Dispose()
  $brush.Dispose()
}

function DrawGlowLine($g, [Drawing.PointF[]]$points, [string]$hex, [float]$width = 4, [int]$alpha = 220) {
  $glow = NewPen $hex 42 ($width * 4)
  $pen = NewPen $hex $alpha $width
  $g.DrawLines($glow, $points)
  $g.DrawLines($pen, $points)
  $pen.Dispose()
  $glow.Dispose()
}

function DrawBase($g, [string]$accent = "#00F5FF") {
  FillEllipseGradient $g (RectF 300 682 430 96) $accent 78 "#050608" 0
  FillEllipseGradient $g (RectF 356 704 314 52) "#7A5BFF" 60 "#050608" 0
  DrawRadialGlow $g 512 595 125 78 "#FF2A4D" 32
  DrawRadialGlow $g 424 582 86 62 "#00F5FF" 34
}

function DrawPanelLines($g, [float]$x, [float]$y, [float]$w, [float]$h, [string]$accent) {
  $pen = NewPen $accent 180 3
  $thin = NewPen $accent 108 2
  $g.DrawRectangle($pen, $x, $y, $w, $h)
  $g.DrawLine($thin, $x + 42, $y + 45, $x + $w - 48, $y + 45)
  $g.DrawLine($thin, $x + 42, $y + 85, $x + 118, $y + 85)
  $g.DrawLine($thin, $x + 118, $y + 85, $x + 154, $y + 122)
  $g.DrawLine($thin, $x + 154, $y + 122, $x + $w - 72, $y + 74)
  $g.DrawLine($thin, $x + $w - 72, $y + 74, $x + $w - 34, $y + 94)
  $g.DrawLine($thin, $x + 72, $y + $h - 44, $x + $w - 64, $y + $h - 44)
  $dot = [Drawing.SolidBrush]::new((C $accent 215))
  $g.FillEllipse($dot, $x + 120, $y + 81, 10, 10)
  $g.FillEllipse($dot, $x + $w - 76, $y + 70, 10, 10)
  $dot.Dispose()
  $thin.Dispose()
  $pen.Dispose()
}

function NewAsset($fileName, [scriptblock]$draw, [string]$accent = "#00F5FF") {
  $bmp = [Drawing.Bitmap]::new(1024, 1024, [Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.CompositingQuality = [Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.Clear([Drawing.Color]::Transparent)

  DrawBase $g $accent
  $state = $g.Save()
  $g.TranslateTransform(512, 585)
  $g.ScaleTransform(1.32, 1.32)
  $g.TranslateTransform(-512, -585)
  & $draw $g
  $g.Restore($state)

  $out = Join-Path $outDir $fileName
  $bmp.Save($out, [Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
}

NewAsset "helix_mud.png" {
  param($g)

  FillEllipseGradient $g (RectF 332 640 362 96) "#21001F" 210 "#050608" 0
  $pool = NewPen "#7A5BFF" 150 5
  for ($i = 0; $i -lt 5; $i++) {
    $g.DrawEllipse($pool, 360 + ($i * 24), 658 + ($i * 8), 304 - ($i * 48), 54 - ($i * 8))
  }

  $body = [Drawing.Drawing2D.GraphicsPath]::new()
  $body.AddBezier((PF 522 300), (PF 365 410), (PF 660 500), (PF 510 640))
  $body.AddBezier((PF 510 640), (PF 664 560), (PF 384 478), (PF 548 360))
  $body.AddBezier((PF 548 360), (PF 612 318), (PF 565 292), (PF 522 300))
  FillPathGradient $g $body "#3C003F" 235 "#050608" 150
  $g.DrawPath((NewPen "#FF2A4D" 165 5), $body)
  $g.DrawPath((NewPen "#00F5FF" 100 2), $body)

  DrawGlowLine $g ([Drawing.PointF[]]@((PF 425 390), (PF 604 456), (PF 425 526), (PF 600 594))) "#00F5FF" 4 165
  DrawGlowLine $g ([Drawing.PointF[]]@((PF 604 350), (PF 424 438), (PF 610 510), (PF 452 620))) "#FF2A4D" 3 150

  $shine = NewPen "#E8ECF5" 55 3
  $g.DrawBezier($shine, 505, 335, 440, 442, 565, 498, 492, 618)
  $shine.Dispose()
  $pool.Dispose()
  $body.Dispose()
} "#7A5BFF"

NewAsset "void_bloom.png" {
  param($g)

  DrawRadialGlow $g 512 545 105 88 "#FF2A4D" 72
  for ($i = 0; $i -lt 7; $i++) {
    $angle = (($i * 51.428) - 90) * [Math]::PI / 180
    $tipX = 512 + [Math]::Cos($angle) * 160
    $tipY = 552 + [Math]::Sin($angle) * 108
    $leftX = 512 + [Math]::Cos($angle - 0.36) * 70
    $leftY = 552 + [Math]::Sin($angle - 0.36) * 52
    $rightX = 512 + [Math]::Cos($angle + 0.36) * 72
    $rightY = 552 + [Math]::Sin($angle + 0.36) * 54

    $petal = [Drawing.Drawing2D.GraphicsPath]::new()
    $petal.AddBezier((PF 512 558), (PF $leftX $leftY), (PF ($tipX - 48) ($tipY - 54)), (PF $tipX $tipY))
    $petal.AddBezier((PF $tipX $tipY), (PF ($tipX + 50) ($tipY + 42)), (PF $rightX $rightY), (PF 512 558))
    FillPathGradient $g $petal "#FF2A4D" 185 "#16001E" 52
    $g.DrawPath((NewPen "#FF2A4D" 150 4), $petal)
    if ($i % 2 -eq 0) { $g.DrawPath((NewPen "#00F5FF" 78 2), $petal) }
    $petal.Dispose()
  }

  $core = [Drawing.Drawing2D.GraphicsPath]::new()
  $core.AddClosedCurve([Drawing.PointF[]]@((PF 450 534), (PF 486 482), (PF 560 486), (PF 610 548), (PF 570 620), (PF 492 625)))
  FillPathGradient $g $core "#7A5BFF" 230 "#050608" 145
  $g.DrawPath((NewPen "#00F5FF" 95 3), $core)
  DrawRadialGlow $g 525 552 52 42 "#E8ECF5" 50
  $core.Dispose()

  $rand = [Random]::new(8080)
  for ($i = 0; $i -lt 58; $i++) {
    $brush = [Drawing.SolidBrush]::new((C ($(if ($i % 4 -eq 0) { "#00F5FF" } else { "#FF2A4D" })) 130))
    $g.FillEllipse($brush, $rand.Next(376, 654), $rand.Next(412, 680), $rand.Next(3, 8), $rand.Next(3, 8))
    $brush.Dispose()
  }
} "#FF2A4D"

NewAsset "oracle_resin.png" {
  param($g)

  $top = @((PF 290 390), (PF 512 276), (PF 746 392), (PF 512 510))
  $left = @((PF 290 390), (PF 512 510), (PF 512 734), (PF 290 612))
  $right = @((PF 512 510), (PF 746 392), (PF 746 610), (PF 512 734))
  FillPoly $g $left "#092D35" 200 "#00F5FF" 150 4
  FillPoly $g $right "#10142A" 210 "#7A5BFF" 135 4
  FillPoly $g $top "#16414A" 176 "#67FFB5" 130 4

  DrawRadialGlow $g 512 502 128 96 "#00F5FF" 92
  $innerTop = @((PF 406 420), (PF 512 365), (PF 628 420), (PF 512 478))
  FillPoly $g $innerTop "#00F5FF" 52 "#E8ECF5" 78 2

  for ($i = 0; $i -lt 4; $i++) {
    $yy = 470 + ($i * 45)
    DrawGlowLine $g ([Drawing.PointF[]]@((PF 342 $yy), (PF 512 ($yy + 62)), (PF 690 $yy))) "#00F5FF" 2 95
  }
  DrawGlowLine $g ([Drawing.PointF[]]@((PF 512 344), (PF 512 734))) "#7A5BFF" 3 92
  DrawPanelLines $g 356 510 250 135 "#00F5FF"
  DrawGlowLine $g ([Drawing.PointF[]]@((PF 380 605), (PF 455 568), (PF 506 624), (PF 604 562), (PF 680 605))) "#67FFB5" 4 150
} "#00F5FF"

NewAsset "velvet_tabs.png" {
  param($g)

  for ($i = 0; $i -lt 5; $i++) {
    $dx = $i * 34
    $dy = $i * 34
    $top = @((PF (268 + $dx) (355 + $dy)), (PF (618 + $dx) (382 + $dy)), (PF (708 + $dx) (454 + $dy)), (PF (334 + $dx) (436 + $dy)))
    $front = @((PF (334 + $dx) (436 + $dy)), (PF (708 + $dx) (454 + $dy)), (PF (668 + $dx) (500 + $dy)), (PF (304 + $dx) (484 + $dy)))
    FillPoly $g $front "#05070F" 238 "#7A5BFF" 108 3
    FillPoly $g $top "#13101F" 238 "#FF2A4D" 160 4
    DrawGlowLine $g ([Drawing.PointF[]]@((PF (360 + $dx) (402 + $dy)), (PF (594 + $dx) (420 + $dy)), (PF (646 + $dx) (458 + $dy)))) "#7A5BFF" 3 135
    if ($i -ge 2) { DrawGlowLine $g ([Drawing.PointF[]]@((PF (410 + $dx) (452 + $dy)), (PF (554 + $dx) (460 + $dy)))) "#00F5FF" 3 120 }
  }

  $rim = NewPen "#FF2A4D" 150 5
  $g.DrawLine($rim, 314, 486, 804, 512)
  $rim.Dispose()
} "#7A5BFF"

NewAsset "neon_dust.png" {
  param($g)

  FillEllipseGradient $g (RectF 326 636 372 88) "#FF2A4D" 118 "#050608" 0
  $mound = [Drawing.Drawing2D.GraphicsPath]::new()
  $mound.AddBezier((PF 330 692), (PF 390 600), (PF 465 520), (PF 512 496))
  $mound.AddBezier((PF 512 496), (PF 582 522), (PF 646 612), (PF 704 692))
  $mound.CloseFigure()
  FillPathGradient $g $mound "#FF2A4D" 168 "#160018" 60
  $g.DrawPath((NewPen "#7A5BFF" 95 3), $mound)

  $rand = [Random]::new(31337)
  for ($i = 0; $i -lt 360; $i++) {
    $x = $rand.Next(328, 706)
    $y = $rand.Next(470, 700)
    $centerRise = 1 - [Math]::Min(1, [Math]::Abs($x - 512) / 190.0)
    $cap = 700 - [int](185 * $centerRise)
    if ($y -gt $cap) { continue }
    $palette = @("#FF2A4D", "#7A5BFF", "#00F5FF")
    $hex = $palette[$rand.Next(0, $palette.Count)]
    $r = $rand.Next(3, 11)
    $brush = [Drawing.SolidBrush]::new((C $hex $rand.Next(125, 225)))
    $g.FillEllipse($brush, $x, $y, $r, $r)
    $brush.Dispose()
  }

  for ($i = 0; $i -lt 5; $i++) {
    $mist = NewPen ($(if ($i % 2 -eq 0) { "#00F5FF" } else { "#FF2A4D" })) 62 3
    $x = 390 + ($i * 58)
    $g.DrawBezier($mist, $x, 620, $x - 38, 544, $x + 44, 520, $x + 8, 448)
    $mist.Dispose()
  }
  DrawRadialGlow $g 512 575 64 90 "#E8ECF5" 34
  $mound.Dispose()
} "#FF2A4D"

NewAsset "phantom_crates.png" {
  param($g)

  $top = @((PF 282 388), (PF 512 282), (PF 756 390), (PF 520 510))
  $front = @((PF 282 388), (PF 520 510), (PF 520 736), (PF 282 616))
  $side = @((PF 520 510), (PF 756 390), (PF 756 616), (PF 520 736))
  FillPoly $g $front "#0A1119" 245 "#00F5FF" 158 5
  FillPoly $g $side "#111420" 246 "#7A5BFF" 132 5
  FillPoly $g $top "#142431" 236 "#00F5FF" 150 5

  $panel = @((PF 390 496), (PF 520 562), (PF 650 498), (PF 650 622), (PF 520 690), (PF 390 622))
  FillPoly $g $panel "#050608" 185 "#00F5FF" 165 4
  DrawRadialGlow $g 520 590 82 66 "#00F5FF" 112
  FillPoly $g @((PF 520 538), (PF 585 580), (PF 520 626), (PF 455 580)) "#071B21" 225 "#00F5FF" 210 4
  DrawGlowLine $g ([Drawing.PointF[]]@((PF 500 580), (PF 520 602), (PF 562 558))) "#67FFB5" 4 170

  for ($i = 0; $i -lt 4; $i++) {
    DrawGlowLine $g ([Drawing.PointF[]]@((PF 312 (435 + $i * 46)), (PF 520 (540 + $i * 48)), (PF 724 (438 + $i * 46)))) "#00F5FF" 3 82
  }
  DrawGlowLine $g ([Drawing.PointF[]]@((PF 318 610), (PF 520 720), (PF 734 612))) "#FF2A4D" 4 118
} "#00F5FF"

Write-Host "Redesigned HXMD, VBLO, ORES, VTAB, NDST, and PCRT using the unified mobile commodity system."
