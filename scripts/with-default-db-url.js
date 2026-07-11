const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const rootDir = path.join(__dirname, '..');

// Load .env.local so all env vars are available to the spawned command
const envLocalPath = path.join(rootDir, '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const rawVal = trimmed.slice(eqIdx + 1).trim();
    const value = rawVal.replace(/^["']|["']$/g, '');
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const command = process.argv.slice(2).join(' ');
if (!command) {
  console.error('[build] Missing command to run');
  process.exit(1);
}

const result = spawnSync(command, {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

if (typeof result.status === 'number') {
  process.exitCode = result.status;
} else {
  process.exitCode = 1;
}