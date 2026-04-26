param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$HyperframesArgs
)

$ErrorActionPreference = "Stop"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $repoRoot

$ffmpegPath = node -e "process.stdout.write(require('ffmpeg-static'))"
$ffprobePath = node -e "process.stdout.write(require('ffprobe-static').path)"
$env:PATH = "$(Split-Path $ffmpegPath);$(Split-Path $ffprobePath);$env:PATH"

& npx -p node@22 node .\node_modules\hyperframes\dist\cli.js @HyperframesArgs
exit $LASTEXITCODE
