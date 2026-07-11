// Standalone script to enable WAL mode on the SQLite database
// Run with: node scripts/enable-wal.js

const Database = require('sqlite')

async function enableWal() {
  const dbPath = 'E:/GIT/NTHome/NTHome/prisma/database/database.db'

  try {
    const db = await Database.open(dbPath)

    // Check current mode
    const current = await db.get('PRAGMA journal_mode')
    console.log('Current journal_mode:', current.journal_mode)

    if (current.journal_mode.toLowerCase() === 'wal') {
      console.log('✓ Database is already in WAL mode.')
    } else {
      await db.run('PRAGMA journal_mode=WAL')
      const result = await db.get('PRAGMA journal_mode')
      console.log('✓ Changed to WAL mode:', result.journal_mode)
    }

    await db.close()
  } catch (err) {
    console.error('Error:', err.message)
    process.exit(1)
  }
}

enableWal()
