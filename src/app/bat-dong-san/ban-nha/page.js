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
    console.error('SalePropertiesPage DB fallback:', error)
    return []
  }
}

export default async function SalePropertiesPage({ searchParams }) {
  const properties = await getProperties()

  return (
    <PropertyListingView
      properties={properties}
      listingType={LISTING_TYPES.sale.value}
      searchParams={searchParams}
      title="Bán nhà"
      description="Tập trung các sản phẩm đang bán: căn hộ, nhà phố, biệt thự, shop và đất nền."
    />
  )
}
