// Test Turso connection để debug lỗi
// Run: node scripts/debug-turso.js

async function debugTurso() {
  console.log('🔍 DEBUGGING TURSO CONNECTION\n');

  // Check 1: Environment variables
  console.log('📋 Step 1: Check Environment Variables');
  const dbUrl = process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!dbUrl) {
    console.log('❌ DATABASE_URL not set');
    console.log('\nSet it with:');
    console.log('$env:DATABASE_URL="libsql://your-database.turso.io"');
  } else {
    console.log('✅ DATABASE_URL:', dbUrl);
  }

  if (!authToken) {
    console.log('❌ TURSO_AUTH_TOKEN not set');
    console.log('\nSet it with:');
    console.log('$env:TURSO_AUTH_TOKEN="eyJhbGc..."');
  } else {
    console.log('✅ TURSO_AUTH_TOKEN:', authToken.substring(0, 20) + '...');
  }

  if (!dbUrl || !authToken) {
    console.log('\n⚠️  Please set environment variables first!');
    return;
  }

  // Check 2: Parse URL
  console.log('\n📋 Step 2: Parse Database URL');
  try {
    const url = new URL(dbUrl);
    console.log('   Protocol:', url.protocol);
    console.log('   Host:', url.hostname);
    console.log('   Port:', url.port || 'default');

    if (url.protocol !== 'libsql:') {
      console.log('❌ Wrong protocol! Should be libsql://');
      console.log('   Fix: Change https:// to libsql://');
      return;
    }
  } catch (error) {
    console.log('❌ Invalid URL format:', error.message);
    return;
  }

  // Check 3: Test connection with fetch
  console.log('\n📋 Step 3: Test HTTP Connection');
  try {
    const httpUrl = dbUrl.replace('libsql://', 'https://');
    console.log('   Testing:', httpUrl);

    const response = await fetch(httpUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        statements: ['SELECT 1 as test']
      })
    });

    console.log('   Status:', response.status, response.statusText);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Connection successful!');
      console.log('   Response:', JSON.stringify(data, null, 2));
    } else {
      const error = await response.text();
      console.log('❌ Connection failed!');
      console.log('   Error:', error);

      // Analyze error
      if (error.includes('no route configured')) {
        console.log('\n🔍 ANALYSIS:');
        console.log('   This error means:');
        console.log('   1. Database was just created (wait 1-2 minutes)');
        console.log('   2. Database was deleted');
        console.log('   3. Wrong database name in URL');
        console.log('\n   SOLUTION:');
        console.log('   - Go to https://app.turso.tech/');
        console.log('   - Check if database exists');
        console.log('   - Copy the EXACT connection string from dashboard');
        console.log('   - Wait 1-2 minutes if just created');
      }
    }
  } catch (error) {
    console.log('❌ Fetch error:', error.message);
  }

  // Check 4: Try with @libsql/client if installed
  console.log('\n📋 Step 4: Test with @libsql/client');
  try {
    const { createClient } = require('@libsql/client');
    console.log('✅ @libsql/client is installed');

    const client = createClient({
      url: dbUrl,
      authToken: authToken
    });

    const result = await client.execute('SELECT 1 as test');
    console.log('✅ Client connection successful!');
    console.log('   Result:', result.rows[0]);

  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log('⚠️  @libsql/client not installed');
      console.log('   Install: npm install @libsql/client');
    } else {
      console.log('❌ Client error:', error.message);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ DEBUG COMPLETE');
}

debugTurso();
