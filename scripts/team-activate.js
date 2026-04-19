#!/usr/bin/env node
/**
 * team-activate.js — prints the AI team roster and the current-phase brief.
 *
 * The real AI team lives inside Claude Code sessions, where the Orchestrator
 * reads agents.md + CLAUDE.md + Prompt_Guidelines.md and dispatches work.
 * This script is a CLI heads-up display for humans.
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

function readFirstNLines(file, n) {
  try {
    return fs.readFileSync(file, 'utf8').split('\n').slice(0, n).join('\n');
  } catch {
    return dim(`(missing: ${file})`);
  }
}

const banner = `
${cyan('╔════════════════════════════════════════════════════════════╗')}
${cyan('║')}   CyberTrader: Age of Pantheon — AI Team Activation        ${cyan('║')}
${cyan('╚════════════════════════════════════════════════════════════╝')}
`;

const agents = [
  ['Game Designer',              'agents/game-designer.md'],
  ['UI/UX & Cyberpunk',          'agents/ui-ux-cyberpunk.md'],
  ['Frontend / Mobile',          'agents/frontend-mobile.md'],
  ['Backend / Web3',             'agents/backend-web3.md'],
  ['Economy & Trading Sim',      'agents/economy-trading-sim.md'],
  ['Cinematic & Animation',      'agents/cinematic-animation.md'],
  ['Brand & Asset',              'agents/brand-asset.md'],
  ['Research & Best-Practices',  'agents/research-best-practices.md'],
  ['QA & Testing',               'agents/qa-testing.md'],
  ['Project Manager',            'agents/project-manager.md'],
  ['OpenClaw Living',            'agents/openclaw-living.md'],
  ['ElizaOS Swarm Coordinator',  'agents/elizaos-swarm.md'],
];

console.log(banner);
console.log(green('Roster:'));
for (const [name, file] of agents) {
  const present = fs.existsSync(path.join(ROOT, file)) ? green('●') : dim('○');
  console.log(`  ${present} ${name.padEnd(32)} ${dim(file)}`);
}

console.log(`\n${green('Current phase brief')} (first 20 lines of docs/Roadmap.md):`);
console.log(readFirstNLines(path.join(ROOT, 'docs/Roadmap.md'), 20));

console.log(`\n${green('To consult the AI Council')}: open a Claude Code session and say:`);
console.log(dim('  "Convene the AI Council on <topic>."'));
console.log(dim('  (The Orchestrator will load the right agents and chair the session.)'));

console.log(`\n${green('Prompt guidelines')}: ${dim('Prompt_Guidelines.md')} (auto-loaded by Claude)`);
console.log(`${green('Collaboration')}:     ${dim('Collaboration_Protocol.md')}\n`);
