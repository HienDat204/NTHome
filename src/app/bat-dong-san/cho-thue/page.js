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
    console.error('RentPropertiesPage DB fallback:', error)
    return []
  }
}

export default async function RentPropertiesPage({ searchParams }) {
  const properties = await getProperties()

  return (
    <PropertyListingView
      properties={properties}
      listingType="rent"
      parentListingType="rent"
      searchParams={searchParams}
      title="Cho thuê bất động sản"
      description="Danh sách bất động sản cho thuê."
    />
  )
}
