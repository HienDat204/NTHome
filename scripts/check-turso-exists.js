// Test nếu database tồn tại trong Turso
// Chạy script này với connection string từ Turso dashboard

const DATABASE_URL = "https://database-hiendat204.aws-us-east-2.turso.io";

async function checkDatabase() {
  console.log('🔍 Checking Turso database...\n');
  console.log('URL:', DATABASE_URL);

  try {
    // Test 1: Basic connectivity
    console.log('\n1. Testing basic connectivity...');
    const response = await fetch(DATABASE_URL, {
      method: 'GET'
    });

    console.log('Status:', response.status);
    const text = await response.text();
    console.log('Response:', text);

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

checkDatabase();

console.log('\n' + '='.repeat(60));
console.log('📋 HÀNH ĐỘNG CẦN LÀM:');
console.log('\n1. Vào Turso dashboard: https://app.turso.tech/');
console.log('2. Kiểm tra danh sách databases');
console.log('3. Xem có database tên "database-hiendat204" không?');
console.log('\nNếu KHÔNG CÓ → Database chưa được tạo!');
console.log('   Giải pháp: Tạo lại hoặc dùng Turso CLI\n');
console.log('Nếu CÓ → Copy ĐÚNG connection string từ dashboard');
console.log('   (không tự đoán tên database)\n');
console.log('='.repeat(60));
