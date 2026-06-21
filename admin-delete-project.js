// Admin utility script - Xóa project trực tiếp từ database
// CHỈ dùng để test hoặc fix dữ liệu lỗi
// Chạy: node admin-delete-project.js <project_id>

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const projectId = parseInt(process.argv[2]);

if (!projectId || isNaN(projectId)) {
  console.log('❌ Usage: node admin-delete-project.js <project_id>');
  console.log('Example: node admin-delete-project.js 22');
  process.exit(1);
}

async function deleteProject() {
  try {
    console.log(`🔍 Đang tìm project ID ${projectId}...\n`);

    // 1. Tìm project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { images: true }
    });

    if (!project) {
      console.log(`❌ Không tìm thấy project ID ${projectId}`);
      process.exit(1);
    }

    console.log(`📋 Project tìm thấy:`);
    console.log(`   - ID: ${project.id}`);
    console.log(`   - Name: ${project.name}`);
    console.log(`   - Images: ${project.images.length} ảnh`);

    // 2. Confirm
    console.log(`\n⚠️  BẠN ĐANG SẮP XÓA PROJECT NÀY!`);
    console.log(`⚠️  Cascade delete sẽ xóa ${project.images.length} ảnh liên quan`);
    console.log(`⚠️  Hành động này KHÔNG THỂ HOÀN TÁC!\n`);

    // 3. Delete
    console.log(`🗑️  Đang xóa...`);

    await prisma.project.delete({
      where: { id: projectId }
    });

    console.log(`\n✅ ĐÃ XÓA THÀNH CÔNG!`);
    console.log(`   - Project ID ${projectId} đã bị xóa khỏi database`);
    console.log(`   - ${project.images.length} ảnh liên quan đã bị xóa (cascade delete)`);

    // 4. Verify
    const remaining = await prisma.project.count();
    console.log(`\n📊 Còn lại ${remaining} projects trong database`);

  } catch (error) {
    console.error('\n❌ LỖI:', error.message);

    if (error.code === 'P2003') {
      console.log('➡️  Foreign key constraint violation');
    } else if (error.code === 'P2025') {
      console.log('➡️  Project không tồn tại');
    }
  } finally {
    await prisma.$disconnect();
  }
}

deleteProject();
