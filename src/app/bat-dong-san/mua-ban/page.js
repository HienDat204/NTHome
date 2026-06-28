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
    console.error('MuaBanPage DB fallback:', error)
    return []
  }
}

export default async function MuaBanPage({ searchParams }) {
  const properties = await getProperties()

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
