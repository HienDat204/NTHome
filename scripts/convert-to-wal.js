// Convert SQLite database to WAL mode for Turso import
// Run: node scripts/convert-to-wal.js

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'database', 'database.db');

console.log('🔧 Converting SQLite database to WAL mode...\n');

try {
  // Check if database exists
  if (!fs.existsSync(dbPath)) {
    console.error('❌ Database not found at:', dbPath);
    console.error('   Please ensure database/database.db exists');
    process.exit(1);
  }

  console.log('📂 Database:', dbPath);

  // Open database
  const db = new Database(dbPath);

  // Get current journal mode
  const currentMode = db.pragma('journal_mode', { simple: true });
  console.log('📊 Current journal mode:', currentMode);

  // Convert to WAL mode
  if (currentMode !== 'wal') {
    console.log('\n🔄 Converting to WAL mode...');
    const newMode = db.pragma('journal_mode = WAL', { simple: true });
    console.log('✅ New journal mode:', newMode);
  } else {
    console.log('✅ Already in WAL mode');
  }

  // Optimize database
  console.log('\n🔧 Optimizing database...');
  db.pragma('optimize');
  console.log('✅ Database optimized');

  // Checkpoint WAL file to merge changes
  console.log('\n🔄 Checkpointing WAL...');
  db.pragma('wal_checkpoint(TRUNCATE)');
  console.log('✅ WAL checkpoint complete');

  // Get database info
  console.log('\n📊 Database Info:');
  const pageCount = db.pragma('page_count', { simple: true });
  const pageSize = db.pragma('page_size', { simple: true });
  const fileSize = (pageCount * pageSize / 1024 / 1024).toFixed(2);
  console.log(`   Size: ${fileSize} MB`);
  console.log(`   Pages: ${pageCount}`);
  console.log(`   Page size: ${pageSize} bytes`);

  // Close database
  db.close();

  console.log('\n✅ CONVERSION COMPLETE!');
  console.log('\n📁 Files created:');
  console.log('   - database.db (main database)');
  console.log('   - database.db-wal (write-ahead log)');
  console.log('   - database.db-shm (shared memory)');

  console.log('\n🚀 Ready for Turso import!');
  console.log('   1. Go to https://app.turso.tech/');
  console.log('   2. Create new database');
  console.log('   3. Import database.db file');

} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.error('\nMake sure better-sqlite3 is installed:');
  console.error('   npm install better-sqlite3');
  process.exit(1);
}
