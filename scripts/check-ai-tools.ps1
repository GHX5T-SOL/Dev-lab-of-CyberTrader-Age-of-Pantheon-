param(
  [switch]$Strict
)

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$failures = 0
$warnings = 0

function Add-PathIfExists {
  param([string]$PathToAdd)
  if ($PathToAdd -and (Test-Path $PathToAdd)) {
    $env:PATH = "$PathToAdd;$env:PATH"
  }
}

function Write-Ok {
  param([string]$Message)
  Write-Host "[OK] $Message"
}

function Write-Warn {
  param([string]$Message)
  $script:warnings += 1
  Write-Host "[WARN] $Message"
}

function Write-Fail {
  param([string]$Message)
  $script:failures += 1
  Write-Host "[FAIL] $Message"
}

Add-PathIfExists (Join-Path $env:APPDATA "Python\Python312\Scripts")

$hf = Get-Command hf -ErrorAction SilentlyContinue
if ($hf) {
  $hfVersion = (& hf version 2>$null)
  Write-Ok "Hugging Face CLI installed: $hfVersion"
  $hfAuth = (& hf auth whoami --format json 2>$null)
  if ($LASTEXITCODE -eq 0 -and $hfAuth) {
    Write-Ok "Hugging Face auth is configured."
  } else {
    Write-Warn "Hugging Face CLI is not logged in. Run npm run hf:login or set HF_TOKEN for live image generation."
  }
} else {
  Write-Fail "Hugging Face CLI not found. Install with python -m pip install --user --upgrade huggingface_hub."
}

if (Test-Path (Join-Path $repoRoot "node_modules\spritecook-mcp\package.json")) {
  Write-Ok "SpriteCook MCP package installed."
  Write-Warn "SpriteCook MCP account auth is external to the repo. Run npm run spritecook:setup and complete browser/API-key auth."
} else {
  Write-Fail "SpriteCook MCP package missing. Run npm install."
}

if (Test-Path (Join-Path $repoRoot "node_modules\hyperframes\package.json")) {
  $doctor = (& powershell -ExecutionPolicy Bypass -File (Join-Path $repoRoot "scripts\hyperframes.ps1") doctor 2>&1)
  if ($LASTEXITCODE -eq 0 -and ($doctor -match "Node.js") -and ($doctor -match "FFmpeg") -and ($doctor -match "FFprobe") -and ($doctor -match "Chrome")) {
    Write-Ok "HyperFrames runs through Node 22 with FFmpeg, FFprobe, and Chrome available."
  } else {
    Write-Fail "HyperFrames doctor did not pass required local checks."
    $doctor | Select-Object -Last 20 | ForEach-Object { Write-Host $_ }
  }
} else {
  Write-Fail "HyperFrames package missing. Run npm install."
}

$coderabbitVersionCommand = 'export PATH="$HOME/.local/bin:/usr/local/bin:/usr/bin:/bin"; command -v coderabbit >/dev/null && coderabbit review -V'
$coderabbitVersion = (& bash -lc $coderabbitVersionCommand 2>$null)
if ($LASTEXITCODE -eq 0 -and $coderabbitVersion) {
  Write-Ok "CodeRabbit CLI installed in WSL: $coderabbitVersion"
  $coderabbitAuthCommand = 'export PATH="$HOME/.local/bin:/usr/local/bin:/usr/bin:/bin"; coderabbit auth status --agent'
  $coderabbitAuth = (& bash -lc $coderabbitAuthCommand 2>$null)
  if ($coderabbitAuth -match '"authenticated":true') {
    Write-Ok "CodeRabbit agent auth is configured."
  } else {
    Write-Warn "CodeRabbit is installed but not authenticated. Run npm run coderabbit:auth."
  }
} else {
  Write-Fail "CodeRabbit CLI not installed in WSL."
}

Write-Host "Toolchain check complete: $failures failure(s), $warnings warning(s)."
if ($failures -gt 0 -or ($Strict -and $warnings -gt 0)) {
  exit 1
}
