const fs = require('fs');
const path = require('path');

const nextDir = path.join(process.cwd(), '.next');

try {
  // Check if .next exists first
  if (fs.existsSync(nextDir)) {
    fs.rmSync(nextDir, {
      recursive: true,
      force: true,
      maxRetries: 8,
      retryDelay: 250,
    });
    console.log('[build] Cleaned .next cache');
  } else {
    console.log('[build] No .next cache to clean (fresh build)');
  }
} catch (error) {
  // In production/Railway builds, .next might not exist or be locked
  // This is not a fatal error - Next.js will create a fresh build
  console.warn('[build] Could not clean .next cache:', error.message);
  console.warn('[build] Continuing with build anyway...');
  // Don't exit with error - let the build continue
}
