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
      listingType="cho_thue_can_ho"
      parentListingType="rent"
      searchParams={searchParams}
      title="Cho thuê căn hộ"
      description="Danh sách căn hộ cho thuê tại các khu vực trung tâm."
    />
  )
}
