// Test script để verify delete functionality
// Chạy: node test-delete.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'database.db');
const db = new sqlite3.Database(dbPath);

console.log('🔍 Kiểm tra dữ liệu trước khi test...\n');

// 1. Đếm số properties
db.get('SELECT COUNT(*) as count FROM Property', (err, row) => {
  if (err) {
    console.error('❌ Error:', err);
    return;
  }
  console.log(`📊 Tổng số Properties: ${row.count}`);
});

// 2. Đếm số property images
db.get('SELECT COUNT(*) as count FROM PropertyImage', (err, row) => {
  if (err) {
    console.error('❌ Error:', err);
    return;
  }
  console.log(`📊 Tổng số Property Images: ${row.count}`);
});

// 3. Đếm số projects
db.get('SELECT COUNT(*) as count FROM Project', (err, row) => {
  if (err) {
    console.error('❌ Error:', err);
    return;
  }
  console.log(`📊 Tổng số Projects: ${row.count}`);
});

// 4. Đếm số project images
db.get('SELECT COUNT(*) as count FROM ProjectImage', (err, row) => {
  if (err) {
    console.error('❌ Error:', err);
    return;
  }
  console.log(`📊 Tổng số Project Images: ${row.count}\n`);

  console.log('✅ Để test delete:');
  console.log('1. Vào http://localhost:3000/admin/properties');
  console.log('2. Đăng nhập nếu chưa login');
  console.log('3. Nhấn nút "Xóa" một property');
  console.log('4. Chạy lại script này để kiểm tra\n');

  db.close();
});
