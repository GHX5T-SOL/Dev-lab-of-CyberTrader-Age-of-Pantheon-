param(
  [switch]$LoginOnly,
  [string]$Type = "uncommitted"
)

$ErrorActionPreference = "Stop"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$drive = $repoRoot.Path.Substring(0, 1).ToLowerInvariant()
$rest = $repoRoot.Path.Substring(2).Replace("\", "/")
$repoWsl = "/mnt/$drive$rest"

$versionCommand = 'export PATH="$HOME/.local/bin:/usr/local/bin:/usr/bin:/bin"; command -v coderabbit >/dev/null && coderabbit review -V'
$versionOutput = bash -lc $versionCommand
if ($LASTEXITCODE -ne 0) {
  throw "CodeRabbit CLI is not installed in WSL. Re-run the setup from this task or install with https://cli.coderabbit.ai/install.sh."
}
Write-Host "CodeRabbit CLI: $versionOutput"

if ($LoginOnly) {
  bash -lc 'export PATH="$HOME/.local/bin:/usr/local/bin:/usr/bin:/bin"; coderabbit auth login --agent'
  exit $LASTEXITCODE
}

$authOutput = bash -lc 'export PATH="$HOME/.local/bin:/usr/local/bin:/usr/bin:/bin"; coderabbit auth status --agent'
if ($authOutput -match '"authenticated":false') {
  throw "CodeRabbit is installed but not authenticated. Run npm run coderabbit:auth and complete the browser login."
}

$safeRepo = $repoWsl.Replace("'", "'\''")
bash -lc "export PATH=`"`$HOME/.local/bin:/usr/local/bin:/usr/bin:/bin`"; cd '$safeRepo'; coderabbit review --agent -t $Type"
exit $LASTEXITCODE
