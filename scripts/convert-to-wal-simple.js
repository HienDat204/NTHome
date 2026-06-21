// Convert SQLite database to WAL mode using Prisma
// Run: node scripts/convert-to-wal-simple.js

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'database.db');

console.log('🔧 Converting SQLite database to WAL mode...\n');

async function convertToWAL() {
  try {
    // Check if database exists
    if (!fs.existsSync(dbPath)) {
      console.error('❌ Database not found at:', dbPath);
      console.error('   Please ensure database/database.db exists');
      process.exit(1);
    }

    console.log('📂 Database:', dbPath);

    // Create Prisma client
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: `file:${dbPath}`
        }
      }
    });

    // Get current journal mode
    const currentMode = await prisma.$queryRaw`PRAGMA journal_mode`;
    console.log('📊 Current journal mode:', currentMode[0].journal_mode);

    // Convert to WAL mode
    if (currentMode[0].journal_mode !== 'wal') {
      console.log('\n🔄 Converting to WAL mode...');
      const newMode = await prisma.$queryRaw`PRAGMA journal_mode=WAL`;
      console.log('✅ New journal mode:', newMode[0].journal_mode);
    } else {
      console.log('✅ Already in WAL mode');
    }

    // Checkpoint WAL to ensure all data is in main file
    console.log('\n🔄 Checkpointing WAL...');
    await prisma.$queryRaw`PRAGMA wal_checkpoint(TRUNCATE)`;
    console.log('✅ WAL checkpoint complete');

    // Get database stats
    console.log('\n📊 Database Info:');
    const pageCount = await prisma.$queryRaw`PRAGMA page_count`;
    const pageSize = await prisma.$queryRaw`PRAGMA page_size`;
    const pages = Number(pageCount[0].page_count);
    const size = Number(pageSize[0].page_size);
    const fileSize = (pages * size / 1024 / 1024).toFixed(2);

    console.log(`   Size: ${fileSize} MB`);
    console.log(`   Pages: ${pages}`);
    console.log(`   Page size: ${size} bytes`);

    // Get record counts
    console.log('\n📦 Data:');
    const properties = await prisma.property.count();
    const projects = await prisma.project.count();
    const articles = await prisma.article.count();
    console.log(`   Properties: ${properties}`);
    console.log(`   Projects: ${projects}`);
    console.log(`   Articles: ${articles}`);

    await prisma.$disconnect();

    console.log('\n✅ CONVERSION COMPLETE!');
    console.log('\n📁 Files created:');
    console.log('   - database.db (main database)');
    console.log('   - database.db-wal (write-ahead log)');
    console.log('   - database.db-shm (shared memory)');

    console.log('\n🚀 Ready for Turso import!');
    console.log('\n📋 Next steps:');
    console.log('   1. Go to https://app.turso.tech/');
    console.log('   2. Create new database');
    console.log('   3. Choose "Import from SQLite"');
    console.log('   4. Upload database/database.db');
    console.log('\n   OR use Turso CLI:');
    console.log('   turso db create my-database --from-file database/database.db');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

convertToWAL();
