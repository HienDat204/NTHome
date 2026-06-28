import prisma from "@/lib/prisma";
import PropertyListingView from "@/components/properties/PropertyListingView";
import { LISTING_TYPES } from "@/lib/listings";

export const dynamic = "force-dynamic";

async function getProperties() {
  try {
    return await prisma.property.findMany({
      include: { images: { orderBy: { id: 'asc' } } },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("PropertiesPage DB fallback:", error);
    return [];
  }
}

export default async function PropertiesPage({ searchParams }) {
  const properties = await getProperties();

  return (
    <PropertyListingView
      properties={properties}
      listingType={LISTING_TYPES.all.value}
      searchParams={searchParams}
      title="Bất động sản nổi bật"
      description="Tìm kiếm theo từ khóa, thành phố, quận huyện và loại nhà đất để ra đúng sản phẩm cần xem."
    />
  );
}
