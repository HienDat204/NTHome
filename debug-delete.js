// Script để test delete functionality và debug issues
// Chạy: node debug-delete.js <property_id>

const https = require('https');
const http = require('http');

const propertyId = process.argv[2];

if (!propertyId) {
  console.log('❌ Usage: node debug-delete.js <property_id>');
  console.log('Example: node debug-delete.js 57');
  process.exit(1);
}

console.log(`🔍 Testing DELETE /api/properties/${propertyId}\n`);

// Test DELETE endpoint
const options = {
  hostname: 'localhost',
  port: 3000,
  path: `/api/properties/${propertyId}`,
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'referer': 'http://localhost:3000/admin/properties'
  }
};

const req = http.request(options, (res) => {
  console.log(`📊 Status Code: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`\n📄 Response Body:`, data || '(empty)');

    if (res.statusCode === 204) {
      console.log('\n✅ DELETE successful (204 No Content)');
      console.log('➡️ Property should be deleted from database');
    } else if (res.statusCode === 200) {
      console.log('\n✅ DELETE successful (200 OK)');
      console.log('➡️ Property should be deleted from database');
    } else if (res.statusCode === 403) {
      console.log('\n❌ DELETE failed (403 Forbidden)');
      console.log('➡️ Reason: Not authenticated or not from admin page');
      console.log('➡️ Solution: Login at http://localhost:3000/admin/login first');
    } else if (res.statusCode === 401) {
      console.log('\n❌ DELETE failed (401 Unauthorized)');
      console.log('➡️ Reason: No valid session');
      console.log('➡️ Solution: Login at http://localhost:3000/admin/login first');
    } else if (res.statusCode === 404) {
      console.log('\n⚠️ DELETE failed (404 Not Found)');
      console.log('➡️ Property already deleted or does not exist');
    } else {
      console.log(`\n❌ DELETE failed (${res.statusCode})`);
      console.log('➡️ Check server logs for details');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
  console.log('\n➡️ Make sure dev server is running: npm run dev');
});

req.end();
