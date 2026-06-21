// Admin utility script - Xóa property trực tiếp từ database
// CHỈ dùng để test hoặc fix dữ liệu lỗi
// Chạy: node admin-delete-property.js <property_id>

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const propertyId = parseInt(process.argv[2]);

if (!propertyId || isNaN(propertyId)) {
  console.log('❌ Usage: node admin-delete-property.js <property_id>');
  console.log('Example: node admin-delete-property.js 57');
  process.exit(1);
}

async function deleteProperty() {
  try {
    console.log(`🔍 Đang tìm property ID ${propertyId}...\n`);

    // 1. Tìm property
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { images: true }
    });

    if (!property) {
      console.log(`❌ Không tìm thấy property ID ${propertyId}`);
      process.exit(1);
    }

    console.log(`📋 Property tìm thấy:`);
    console.log(`   - ID: ${property.id}`);
    console.log(`   - Title: ${property.title}`);
    console.log(`   - Images: ${property.images.length} ảnh`);

    // 2. Confirm
    console.log(`\n⚠️  BẠN ĐANG SẮP XÓA PROPERTY NÀY!`);
    console.log(`⚠️  Cascade delete sẽ xóa ${property.images.length} ảnh liên quan`);
    console.log(`⚠️  Hành động này KHÔNG THỂ HOÀN TÁC!\n`);

    // 3. Delete
    console.log(`🗑️  Đang xóa...`);

    await prisma.property.delete({
      where: { id: propertyId }
    });

    console.log(`\n✅ ĐÃ XÓA THÀNH CÔNG!`);
    console.log(`   - Property ID ${propertyId} đã bị xóa khỏi database`);
    console.log(`   - ${property.images.length} ảnh liên quan đã bị xóa (cascade delete)`);

    // 4. Verify
    const remaining = await prisma.property.count();
    console.log(`\n📊 Còn lại ${remaining} properties trong database`);

  } catch (error) {
    console.error('\n❌ LỖI:', error.message);

    if (error.code === 'P2003') {
      console.log('➡️  Foreign key constraint violation');
    } else if (error.code === 'P2025') {
      console.log('➡️  Property không tồn tại');
    }
  } finally {
    await prisma.$disconnect();
  }
}

deleteProperty();
