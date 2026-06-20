const { spawnSync } = require('child_process')

const fallbackUrl = 'file:../database/database.db'
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = fallbackUrl
  console.log(`[build] DATABASE_URL is missing, using fallback: ${fallbackUrl}`)
}

const command = process.argv.slice(2).join(' ')
if (!command) {
  console.error('[build] Missing command to run')
  process.exit(1)
}

const result = spawnSync(command, {
  stdio: 'inherit',
  shell: true,
  env: process.env,
})

if (typeof result.status === 'number') {
  process.exit(result.status)
}

process.exit(1)