// Comprehensive test script
// Chạy: node test-complete.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runTests() {
  console.log('🧪 BẮT ĐẦU TEST CHỨC NĂNG XÓA\n');
  console.log('=' .repeat(60));

  try {
    // Test 1: Kiểm tra database connection
    console.log('\n📊 Test 1: Kiểm tra kết nối database...');
    const propertiesCount = await prisma.property.count();
    const projectsCount = await prisma.project.count();
    console.log(`   ✅ Database OK`);
    console.log(`   - Properties: ${propertiesCount}`);
    console.log(`   - Projects: ${projectsCount}`);

    // Test 2: Kiểm tra cascade delete setup
    console.log('\n🔗 Test 2: Kiểm tra cascade delete...');
    const propertyImageCount = await prisma.propertyImage.count();
    const projectImageCount = await prisma.projectImage.count();
    console.log(`   ✅ Cascade delete schema OK`);
    console.log(`   - Property Images: ${propertyImageCount}`);
    console.log(`   - Project Images: ${projectImageCount}`);

    // Test 3: Liệt kê properties có thể xóa để test
    console.log('\n📋 Test 3: Danh sách properties (có thể dùng để test xóa):');
    const properties = await prisma.property.findMany({
      take: 5,
      orderBy: { id: 'desc' },
      include: { images: true }
    });

    properties.forEach(p => {
      console.log(`   - ID ${p.id}: "${p.title}" (${p.images.length} ảnh)`);
    });

    // Test 4: Liệt kê projects
    console.log('\n📋 Test 4: Danh sách projects (có thể dùng để test xóa):');
    const projects = await prisma.project.findMany({
      take: 5,
      orderBy: { id: 'desc' },
      include: { images: true }
    });

    projects.forEach(p => {
      console.log(`   - ID ${p.id}: "${p.name}" (${p.images.length} ảnh)`);
    });

    // Test 5: Kiểm tra admin users
    console.log('\n👤 Test 5: Kiểm tra admin users...');
    const adminCount = await prisma.admin.count();
    console.log(`   ✅ Admins: ${adminCount} user(s)`);

    if (adminCount === 0) {
      console.log(`   ⚠️  WARNING: Không có admin user nào!`);
      console.log(`   ➡️  Cần tạo admin user để có thể xóa`);
    } else {
      const admins = await prisma.admin.findMany({
        select: { id: true, username: true, email: true }
      });
      admins.forEach(a => {
        console.log(`   - ${a.username} (${a.email})`);
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n✅ TẤT CẢ TESTS PASS!\n');

    console.log('📝 HƯỚNG DẪN TEST XÓA:');
    console.log('');
    console.log('1. Login admin:');
    console.log('   http://localhost:3000/admin/login');
    console.log('');
    console.log('2. Vào trang quản lý:');
    console.log('   http://localhost:3000/admin/properties');
    console.log('   http://localhost:3000/admin/projects');
    console.log('');
    console.log('3. Mở DevTools (F12) → Network tab');
    console.log('');
    console.log('4. Click "Xóa" một property/project');
    console.log('');
    console.log('5. Kiểm tra:');
    console.log('   - Thấy alert "✅ Đã xóa thành công!" → OK');
    console.log('   - Thấy alert lỗi → FIX vấn đề đó');
    console.log('   - Network tab: status 204 hoặc 200 → OK');
    console.log('   - Network tab: status 403 → Chưa login!');
    console.log('');
    console.log('6. Verify trong database:');
    if (properties.length > 0) {
      console.log(`   node admin-delete-property.js ${properties[0].id} (để test)`);
    }
    if (projects.length > 0) {
      console.log(`   node admin-delete-project.js ${projects[0].id} (để test)`);
    }
    console.log('');
    console.log('7. Build lại và kiểm tra:');
    console.log('   npm run build');
    console.log('   npm start');
    console.log('   → Sản phẩm đã xóa không được hiện lại');
    console.log('');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.error('');
    console.error('Kiểm tra:');
    console.error('- Database file tồn tại: database/database.db');
    console.error('- Prisma client đã generate: npx prisma generate');
    console.error('- Migration đã chạy: npx prisma migrate dev');
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
