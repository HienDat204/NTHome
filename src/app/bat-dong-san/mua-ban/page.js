import prisma from '@/lib/prisma'
import PropertyListingView from '@/components/properties/PropertyListingView'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 12

async function getProperties(page = 1) {
  try {
    return await prisma.property.findMany({
      select: {
        id: true, slug: true, title: true, price: true, area: true,
        bedrooms: true, bathrooms: true, address: true, district: true,
        city: true, listingType: true, propertyType: true, promoBadge: true,
        thumbnail: true,
        images: { select: { id: true, imageUrl: true }, orderBy: { id: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    })
  } catch (error) {
    console.error('MuaBanPage DB fallback:', error)
    return []
  }
}

export default async function MuaBanPage({ searchParams }) {
  const page = Number(searchParams?.page) || 1
  const properties = await getProperties(page)

  return (
    <PropertyListingView
      properties={properties}
      listingType="sale"
      parentListingType="sale"
      searchParams={searchParams}
      title="Mua bán bất động sản"
      description="Danh sách bất động sản đang bán."
    />
  )
}
