# AI Toolchain

This repo has wrappers for the optional AI/game-art tools used by the CyberTrader UI and asset pipeline.

## Health Check

```powershell
npm run tools:check
```

Use strict mode in CI only after external accounts are authenticated:

```powershell
npm run tools:check:strict
```

## Hugging Face

The Hugging Face CLI is installed as the Python `hf` command. Live image generation reads tokens in this order:

1. `HF_TOKEN`
2. `HUGGINGFACE_API_TOKEN`
3. `HUGGINGFACEHUB_API_TOKEN`
4. The standard Hugging Face token file under `.cache/huggingface/token`

Authenticate without writing secrets to the repo:

```powershell
npm run hf:login
```

Generate with a required live Hugging Face call:

```powershell
npm run art:generate:live
```

Generate with procedural fallback allowed:

```powershell
npm run art:generate
```

## SpriteCook

The local SpriteCook MCP package is installed. Account authentication is intentionally external to the repo.

```powershell
npm run spritecook:setup
```

After authentication, use the SpriteCook MCP tools from Codex. The deterministic local sprite processor remains available for CI-normalized PNG output:

```powershell
npm run art:process
```

## HyperFrames

The app remains on Node 20 for Expo, while HyperFrames runs through a Node 22 shim. The wrapper also adds local `ffmpeg-static` and `ffprobe-static` to `PATH`.

```powershell
npm run hyperframes:doctor
npm run hyperframes -- --help
```

Chrome Headless Shell is installed in the HyperFrames cache by `hyperframes browser ensure`.

## CodeRabbit

CodeRabbit is installed inside WSL because the official CLI installer supports Linux and macOS. Authenticate once:

```powershell
npm run coderabbit:auth
```

Then run an agent review:

```powershell
npm run coderabbit:review
```

If auth is missing, the wrapper exits before starting review and tells you to complete `coderabbit:auth`.
