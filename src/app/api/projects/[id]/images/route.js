import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/projects/[id]/images - Thêm ảnh mới vào project
export async function POST(request, { params }) {
  try {
    const { id } = params;
    const projectId = parseInt(id);

    // Kiểm tra project có tồn tại không
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project không tồn tại' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Thiếu imageUrl' },
        { status: 400 }
      );
    }

    // Tạo ProjectImage mới
    const newImage = await prisma.projectImage.create({
      data: {
        projectId,
        imageUrl
      }
    });

    // Đồng bộ thumbnail theo ảnh đầu tiên (thứ tự upload)
    const firstImage = await prisma.projectImage.findFirst({
      where: { projectId },
      orderBy: { id: 'asc' }
    });

    if (firstImage) {
      await prisma.project.update({
        where: { id: projectId },
        data: { thumbnail: firstImage.imageUrl }
      });
    }

    // Trả về toàn bộ danh sách ảnh sau khi thêm
    const allImages = await prisma.projectImage.findMany({
      where: { projectId },
      orderBy: { id: 'asc' }
    });

    return NextResponse.json({
      success: true,
      images: allImages
    });

  } catch (error) {
    console.error('Error adding project image:', error);
    return NextResponse.json(
      { error: 'Lỗi khi thêm ảnh', details: error.message },
      { status: 500 }
    );
  }
}
