// Verify database file is valid for Turso import
// Run: node scripts/verify-db.js

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'database.db');

async function verifyDatabase() {
  console.log('🔍 VERIFYING DATABASE FOR TURSO IMPORT\n');
  console.log('='.repeat(60));

  try {
    // Check 1: File exists
    console.log('\n✓ Step 1: Check file exists');
    if (!fs.existsSync(dbPath)) {
      console.log('❌ Database file not found:', dbPath);
      return;
    }
    console.log('✅ File exists:', dbPath);

    // Check 2: File size
    const stats = fs.statSync(dbPath);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
    console.log('\n✓ Step 2: Check file size');
    console.log('✅ Size:', sizeMB, 'MB');

    if (stats.size > 2 * 1024 * 1024 * 1024) {
      console.log('❌ File too large! Turso free tier limit: 2GB');
      return;
    }

    // Check 3: File is readable
    console.log('\n✓ Step 3: Check file is readable');
    try {
      fs.accessSync(dbPath, fs.constants.R_OK);
      console.log('✅ File is readable');
    } catch {
      console.log('❌ File cannot be read (permission issue)');
      return;
    }

    // Check 4: Connect with Prisma
    console.log('\n✓ Step 4: Test database connection');
    const prisma = new PrismaClient({
      datasources: {
        db: { url: `file:${dbPath}` }
      }
    });

    try {
      await prisma.$connect();
      console.log('✅ Database connection OK');

      // Check 5: Journal mode
      console.log('\n✓ Step 5: Check journal mode');
      const journalMode = await prisma.$queryRaw`PRAGMA journal_mode`;
      const mode = journalMode[0].journal_mode;
      console.log('   Current mode:', mode);

      if (mode === 'wal') {
        console.log('✅ WAL mode enabled (required for Turso)');
      } else {
        console.log('⚠️  Not in WAL mode!');
        console.log('   Run: node scripts/convert-to-wal-simple.js');
      }

      // Check 6: Database integrity
      console.log('\n✓ Step 6: Check database integrity');
      const integrity = await prisma.$queryRaw`PRAGMA integrity_check`;
      if (integrity[0].integrity_check === 'ok') {
        console.log('✅ Database integrity OK');
      } else {
        console.log('❌ Database corrupted:', integrity[0].integrity_check);
        return;
      }

      // Check 7: Count records
      console.log('\n✓ Step 7: Verify data');
      const properties = await prisma.property.count();
      const projects = await prisma.project.count();
      const articles = await prisma.article.count();
      const admins = await prisma.admin.count();

      console.log('✅ Data counts:');
      console.log('   Properties:', properties);
      console.log('   Projects:', projects);
      console.log('   Articles:', articles);
      console.log('   Admins:', admins);

      if (properties === 0 && projects === 0) {
        console.log('⚠️  Database has no content!');
      }

      // Check 8: Schema version
      console.log('\n✓ Step 8: Check schema');
      const tables = await prisma.$queryRaw`
        SELECT name FROM sqlite_master
        WHERE type='table'
        ORDER BY name
      `;
      console.log('✅ Tables found:', tables.length);
      tables.forEach(t => console.log('   -', t.name));

      await prisma.$disconnect();

      // Final verdict
      console.log('\n' + '='.repeat(60));
      console.log('✅ DATABASE VERIFICATION COMPLETE');
      console.log('\n📊 Summary:');
      console.log(`   ✅ File size: ${sizeMB} MB (< 2GB limit)`);
      console.log(`   ✅ Journal mode: ${mode}`);
      console.log('   ✅ Integrity: OK');
      console.log(`   ✅ Records: ${properties + projects + articles} items`);
      console.log('   ✅ Tables: ' + tables.length);

      if (mode !== 'wal') {
        console.log('\n⚠️  ACTION REQUIRED:');
        console.log('   Convert to WAL mode first:');
        console.log('   node scripts/convert-to-wal-simple.js');
      } else {
        console.log('\n🚀 READY FOR TURSO IMPORT!');
        console.log('\n📋 Next steps:');
        console.log('   1. Go to https://app.turso.tech/');
        console.log('   2. Create new database');
        console.log('   3. Upload this file: database/database.db');
        console.log('   4. Wait 2-3 minutes for provision');
        console.log('   5. Get DATABASE_URL and AUTH_TOKEN');
      }

    } catch (error) {
      console.log('❌ Database connection failed:', error.message);
    }

  } catch (error) {
    console.log('\n❌ Verification failed:', error.message);
    console.error(error);
  }
}

verifyDatabase();
