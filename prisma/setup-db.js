/**
 * Setup Fresh Local Database
 *
 * Deletes the old SQLite database, recreates all tables from schema,
 * then seeds sample data.
 *
 * Usage:
 *   node prisma/setup-db.js
 *
 * Uses local SQLite: DATABASE_URL="file:./database/database.db"
 */

const path = require('path')
const fs = require('fs')
const { spawnSync } = require('child_process')

// ── Setup environment ─────────────────────────────────────────────
process.env.DATABASE_URL = 'file:./database/database.db'
process.env.TURSO_AUTH_TOKEN = ''

const DB_PATH = path.join(process.cwd(), 'database', 'database.db')
const DB_DIR = path.join(process.cwd(), 'database')

function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env },
    cwd: process.cwd(),
    ...opts,
  })
  return result.status === 0
}

async function main() {
  console.log('='.repeat(55))
  console.log('  Fresh Database Setup')
  console.log('='.repeat(55))
  console.log(`Database path: ${DB_PATH}`)

  // 1. Delete old database files
  const oldFiles = [
    DB_PATH,
    DB_PATH + '-journal',
    DB_PATH + '-wal',
    DB_PATH + '-shm',
    DB_PATH + '-lock',
  ]
  for (const f of oldFiles) {
    if (fs.existsSync(f)) {
      fs.unlinkSync(f)
      console.log(`  Deleted: ${path.basename(f)}`)
    }
  }

  // 2. Ensure database directory exists
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true })
    console.log(`  Created dir: database/`)
  }

  // 3. Prisma db push (create tables)
  console.log('\n[Step 1/2] Running prisma db push...')
  if (!run('npx', ['prisma', 'db', 'push', '--skip-generate'])) {
    console.error('\n❌ prisma db push failed.')
    process.exit(1)
  }
  console.log('  ✓ Tables created')

  // 4. Seed data
  console.log('\n[Step 2/2] Running seed...')
  if (!run('node', ['prisma/seed.js'])) {
    console.error('\n❌ Seed failed.')
    process.exit(1)
  }

  console.log('\n' + '='.repeat(55))
  console.log('  ✅ Database ready!')
  console.log('='.repeat(55))
  console.log('  Start dev server: npm run dev')
  console.log('  Login admin: admin / 123456')
  console.log('')
}

main().catch((err) => {
  console.error('\n❌ Setup failed:', err.message)
  process.exit(1)
})
