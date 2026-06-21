const fs = require('fs');
const path = require('path');

const nextDir = path.join(process.cwd(), '.next');

try {
  fs.rmSync(nextDir, {
    recursive: true,
    force: true,
    maxRetries: 8,
    retryDelay: 250,
  });
  console.log('[build] Cleaned .next cache');
} catch (error) {
  console.error('[build] Could not clean .next cache:', error.message);
  console.error('[build] Please stop any running `next dev`/`next start` process and retry.');
  process.exit(1);
}
