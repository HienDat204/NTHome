import prisma from '@/lib/prisma'
import PropertyListingView from '@/components/properties/PropertyListingView'

export const dynamic = 'force-dynamic'

async function getProperties() {
  try {
    return await prisma.property.findMany({
      include: { images: { orderBy: { id: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.error('BanNhaPage DB fallback:', error)
    return []
  }
}

export default async function BanNhaPage({ searchParams }) {
  const properties = await getProperties()
  return (
    <PropertyListingView
      properties={properties}
      listingType="ban_nha"
      parentListingType="sale"
      searchParams={searchParams}
      title="Bán nhà"
      description="Danh sách bán nhà, nhà phố, biệt thự, căn hộ đang bán."
    />
  )
}
