import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// DELETE /api/projects/[id]/images/[imageId] - Xóa ảnh
export async function DELETE(request, { params }) {
  try {
    const { id, imageId } = params;
    const projectId = parseInt(id);
    const imageIdInt = parseInt(imageId);

    // Kiểm tra ảnh có tồn tại và thuộc project này không
    const image = await prisma.projectImage.findFirst({
      where: {
        id: imageIdInt,
        projectId: projectId
      }
    });

    if (!image) {
      return NextResponse.json(
        { error: 'Ảnh không tồn tại hoặc không thuộc project này' },
        { status: 404 }
      );
    }

    // Xóa ảnh
    await prisma.projectImage.delete({
      where: { id: imageIdInt }
    });

    // Đồng bộ thumbnail theo ảnh đầu tiên còn lại
    const firstImage = await prisma.projectImage.findFirst({
      where: { projectId },
      orderBy: { id: 'asc' }
    });

    await prisma.project.update({
      where: { id: projectId },
      data: { thumbnail: firstImage?.imageUrl || '' }
    });

    return NextResponse.json({
      success: true,
      message: 'Đã xóa ảnh thành công'
    });

  } catch (error) {
    console.error('Error deleting project image:', error);
    return NextResponse.json(
      { error: 'Lỗi khi xóa ảnh', details: error.message },
      { status: 500 }
    );
  }
}
