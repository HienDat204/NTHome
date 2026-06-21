import prisma from '@/lib/prisma'
import PropertyListingView from '@/components/properties/PropertyListingView'
import { LISTING_TYPES } from '@/lib/listings'

export const dynamic = 'force-dynamic'

async function getProperties() {
  try {
    return await prisma.property.findMany({
      include: { images: { orderBy: { id: 'asc' } } },
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
      listingType={LISTING_TYPES.rent.value}
      searchParams={searchParams}
      title="Cho thuê"
      description="Tổng hợp các bất động sản cho thuê theo đúng khu vực, loại nhà đất và nhu cầu sử dụng."
    />
  )
}
