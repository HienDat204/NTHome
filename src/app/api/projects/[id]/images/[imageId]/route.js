import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

function isLocalFile(url) {
  return typeof url === 'string' && url.startsWith('/uploads/');
}

function getFilePath(url) {
  if (!isLocalFile(url)) return null;
  return path.join(process.cwd(), 'public', url);
}

// DELETE /api/projects/[id]/images/[imageId] - Xóa ảnh
export async function DELETE(request, { params }) {
  try {
    const { id, imageId } = params;
    const projectId = parseInt(id);
    const imageIdInt = parseInt(imageId);

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

    // Xóa file vật lý nếu là file local
    if (isLocalFile(image.imageUrl)) {
      const filepath = getFilePath(image.imageUrl);
      try {
        if (existsSync(filepath)) {
          await unlink(filepath);
          console.log(`Deleted file: ${filepath}`);
        }
      } catch (fsErr) {
        console.error(`Failed to delete file ${filepath}:`, fsErr.message);
      }
    }

    await prisma.projectImage.delete({
      where: { id: imageIdInt }
    });

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
