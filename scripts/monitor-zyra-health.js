#!/usr/bin/env node
/**
 * Zyra health monitor - checks SSH connectivity and Tailscale status.
 * Intended to be used by the hourly heartbeat cron.
 */
const { execSync } = require('child_process');

function checkSSH() {
  try {
    execSync('ssh -o BatchMode=yes -o ConnectTimeout=5 zyra-mini echo ok', { stdio: 'ignore' });
    console.log('[health] SSH connection to zyra-mini: OK');
    return true;
  } catch (e) {
    console.error('[health] SSH connection FAILED');
    return false;
  }
}

function checkTailscale() {
  try {
    const out = execSync('tailscale status --json', { encoding: 'utf8' });
    const data = JSON.parse(out);
    const self = data.Self;
    if (self && self.Online) {
      console.log('[health] Tailscale status: ONLINE');
      return true;
    }
    console.error('[health] Tailscale status: OFFLINE');
    return false;
  } catch (e) {
    console.error('[health] Tailscale check error');
    return false;
  }
}

function main() {
  const sshOk = checkSSH();
  const tsOk = checkTailscale();
  if (!sshOk || !tsOk) {
    // In a real system we would emit to heartbeat alert channel.
    console.error('[health] One or more checks failed');
    process.exit(1);
  }
  console.log('[health] All Zyra health checks passed');
}

main();
