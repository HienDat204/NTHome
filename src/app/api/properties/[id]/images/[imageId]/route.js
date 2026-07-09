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

// DELETE /api/properties/[id]/images/[imageId] - Xóa ảnh
export async function DELETE(request, { params }) {
  try {
    const { id, imageId } = params;
    const propertyId = parseInt(id);
    const imageIdInt = parseInt(imageId);

    // Kiểm tra ảnh có tồn tại và thuộc property này không
    const image = await prisma.propertyImage.findFirst({
      where: {
        id: imageIdInt,
        propertyId: propertyId
      }
    });

    if (!image) {
      return NextResponse.json(
        { error: 'Ảnh không tồn tại hoặc không thuộc property này' },
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

    // Xóa database record
    await prisma.propertyImage.delete({
      where: { id: imageIdInt }
    });

    // Đồng bộ thumbnail theo ảnh đầu tiên còn lại
    const firstImage = await prisma.propertyImage.findFirst({
      where: { propertyId },
      orderBy: { id: 'asc' }
    });

    await prisma.property.update({
      where: { id: propertyId },
      data: { thumbnail: firstImage?.imageUrl || '' }
    });

    return NextResponse.json({
      success: true,
      message: 'Đã xóa ảnh thành công'
    });

  } catch (error) {
    console.error('Error deleting property image:', error);
    return NextResponse.json(
      { error: 'Lỗi khi xóa ảnh', details: error.message },
      { status: 500 }
    );
  }
}
