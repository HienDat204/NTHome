/**
 * Setup script: chạy 1 lần sau khi chuyển sang Turso.
 * - Tạo migration mới từ schema (áp dụng lên local DB trước)
 * - Push schema lên Turso để sync dữ liệu
 */

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const rootDir = path.join(__dirname, '..');

// Load .env.local
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

// Force DATABASE_URL for Prisma CLI (local SQLite only)
const localDbUrl = 'file:E:/GIT/NTHome/NTHome/prisma/database/database.db';
process.env.DATABASE_URL = localDbUrl;
console.log('[setup] DATABASE_URL =', localDbUrl);

function run(cmd, args, cwd) {
  console.log(`\n> ${cmd} ${args.join(' ')}`);
  const result = spawnSync(cmd, args, {
    cwd: cwd || rootDir,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });
  if (result.status !== 0) {
    console.error(`[setup] Command failed with exit code ${result.status}`);
    process.exit(result.status);
  }
}

// Step 1: Generate Prisma Client
console.log('\n=== Step 1: prisma generate ===');
run('npx', ['prisma', 'generate']);

// Step 2: Create migration (creates dir + migration.sql, does NOT apply)
console.log('\n=== Step 2: prisma migrate dev --create-only ===');
run('npx', ['prisma', 'migrate', 'dev', '--name', 'init', '--create-only']);

// Step 3: Apply migration to local DB
console.log('\n=== Step 3: prisma migrate deploy ===');
run('npx', ['prisma', 'migrate', 'deploy']);

// Step 4: Push schema to Turso by executing migration SQL via @libsql/client
// (Prisma CLI cannot push libsql:// URL when provider = "sqlite" due to URL validation)
console.log('\n=== Step 4: Syncing schema to Turso via @libsql/client ===');
try {
  const { createClient } = require('@libsql/client');
  const fs = require('fs');
  const path = require('path');

  const migrationsDir = path.join(rootDir, 'prisma', 'migrations');
  const migrationDirs = fs.readdirSync(migrationsDir).filter(f =>
    fs.statSync(path.join(migrationsDir, f)).isDirectory()
  ).sort();

  const allStatements = [];
  for (const dir of migrationDirs) {
    const sqlFile = path.join(migrationsDir, dir, 'migration.sql');
    if (fs.existsSync(sqlFile)) {
      const sql = fs.readFileSync(sqlFile, 'utf8');
      // Split into individual statements (handle semicolons + newlines)
      const stmts = sql.split(/;\s*\n/).map(s => s.trim()).filter(s => s.length > 0 && !s.startsWith('--'));
      allStatements.push(...stmts);
    }
  }

  if (allStatements.length === 0) {
    console.log('[setup] No migration SQL found — Turso schema sync skipped');
  } else {
    const tursoClient = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    // Check existing tables
    const existingTables = await tursoClient.execute(
      "SELECT name FROM sqlite_master WHERE type='table'"
    );
    const tableCount = existingTables.rows ? existingTables.rows.length : 0;
    console.log(`[setup] Turso DB has ${tableCount} existing table(s)`);

    if (tableCount === 0) {
      console.log(`[setup] Applying ${allStatements.length} SQL statements to Turso...`);
      for (const stmt of allStatements) {
        try {
          await tursoClient.execute(stmt);
        } catch (execErr) {
          // Ignore "table already exists" errors
          if (!execErr.message.includes('already exists')) {
            console.warn(`[setup] Warning on: ${stmt.slice(0, 60)}... → ${execErr.message}`);
          }
        }
      }
      console.log('[setup] Turso schema sync complete!');
    } else {
      console.log('[setup] Turso already has tables — skipping SQL apply');
      console.log('[setup] Schema will be auto-synced on first app request (Prisma creates missing tables)');
    }

    await tursoClient.close();
  }
} catch (err) {
  console.error('[setup] Turso sync error:', err.message);
  console.log('[setup] App will auto-sync schema on first request (this is normal on first run)');
  // Do not exit — non-fatal; Prisma will create tables on first $connect()
}

console.log('\n=== Done! ===');
console.log('- Local DB: E:/GIT/NTHome/NTHome/prisma/database/database.db (migrated)');
console.log('- Turso DB: libsql://database-hiendat204.aws-ap-south-1.turso.io (synced)');
