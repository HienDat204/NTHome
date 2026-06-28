import prisma from '@/lib/prisma'
import PropertyListingView from '@/components/properties/PropertyListingView'

export const dynamic = 'force-dynamic'

async function getProperties() {
  try {
    return await prisma.property.findMany({
      include: { images: { orderBy: { id: 'asc' }, take: 3 } },
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.error('DB fallback:', error)
    return []
  }
}

export default async function Page({ searchParams }) {
  const properties = await getProperties()
  return (
    <PropertyListingView
      properties={properties}
      listingType="ban_khach_san"
      parentListingType="sale"
      searchParams={searchParams}
      title="Bán khách sạn"
      description="Danh sách khách sạn, nhà nghỉ, cơ sở lưu trú chào bán."
    />
  )
}
