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
    console.error('DB fallback:', error)
    return []
  }
}

export default async function Page({ searchParams }) {
  const page = Number(searchParams?.page) || 1
  const properties = await getProperties(page)
  return (
    <PropertyListingView
      properties={properties}
      listingType="cho_thue_nha"
      parentListingType="rent"
      searchParams={searchParams}
      title="Cho thuê nhà"
      description="Danh sách nhà cho thuê nguyên căn, diện tích đa dạng."
    />
  )
}
