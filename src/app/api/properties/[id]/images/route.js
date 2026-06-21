import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/properties/[id]/images - Thêm ảnh mới vào property
export async function POST(request, { params }) {
  try {
    const { id } = params;
    const propertyId = parseInt(id);

    // Kiểm tra property có tồn tại không
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property không tồn tại' },
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

    // Tạo PropertyImage mới
    const newImage = await prisma.propertyImage.create({
      data: {
        propertyId,
        imageUrl
      }
    });

    // Đồng bộ thumbnail theo ảnh đầu tiên (thứ tự upload)
    const firstImage = await prisma.propertyImage.findFirst({
      where: { propertyId },
      orderBy: { id: 'asc' }
    });

    if (firstImage) {
      await prisma.property.update({
        where: { id: propertyId },
        data: { thumbnail: firstImage.imageUrl }
      });
    }

    return NextResponse.json({
      success: true,
      image: newImage
    });

  } catch (error) {
    console.error('Error adding property image:', error);
    return NextResponse.json(
      { error: 'Lỗi khi thêm ảnh', details: error.message },
      { status: 500 }
    );
  }
}
