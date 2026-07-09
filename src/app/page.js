import prisma from "@/lib/prisma";
import HeroSection from "@/components/home/HeroSection";
import FeaturedSection from "@/components/home/FeaturedSection";
import BanNhaSection from "@/components/home/BanNhaSection";
import ChoThueSection from "@/components/home/ChoThueSection";
import TinTucSection from "@/components/home/TinTucSection";
import { isSaleListingType, isRentListingType } from "@/lib/listings";

export const dynamic = "force-dynamic";

// Helper: serialize property (convert BigInt price to Number, keep images as objects)
function serializeProperty(p) {
  return {
    ...p,
    price: Number(p.price),
    createdAt: p.createdAt ? p.createdAt.toISOString() : null,
    images: p.images || [],
  }
}

export default async function HomePage() {
  let featured = [];
  let saleRecent = [];
  let rentRecent = [];
  let articlesList = [];

  try {
    const [allFeatured, allRecent, articlesResult] = await Promise.all([
      prisma.property.findMany({
        where: { featured: true },
        take: 8,
        orderBy: { createdAt: "desc" },
        select: {
          id: true, slug: true, title: true, price: true, area: true,
          bedrooms: true, bathrooms: true, address: true, district: true,
          city: true, listingType: true, propertyType: true, promoBadge: true,
          thumbnail: true, images: { select: { id: true, imageUrl: true }, orderBy: { id: "asc" } },
        },
      }),
      prisma.property.findMany({
        take: 16,
        orderBy: { createdAt: "desc" },
        select: {
          id: true, slug: true, title: true, price: true, area: true,
          bedrooms: true, bathrooms: true, address: true, district: true,
          city: true, listingType: true, propertyType: true, promoBadge: true,
          thumbnail: true, images: { select: { id: true, imageUrl: true }, orderBy: { id: "asc" } },
        },
      }),
      prisma.article.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, slug: true, excerpt: true, thumbnail: true, createdAt: true },
      }),
    ])

    featured = allFeatured.map(serializeProperty)

    const allRecentSerialized = allRecent.map(serializeProperty)
    saleRecent = allRecentSerialized.filter((p) => isSaleListingType(p.listingType))
    rentRecent = allRecentSerialized.filter((p) => isRentListingType(p.listingType))

    articlesList = articlesResult.map((a) => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
    }))
  } catch (error) {
    console.error("HomePage DB fallback:", error);
  }

  return (
    <div>
      <HeroSection />
      <FeaturedSection featuredProperties={featured} />
      <BanNhaSection properties={saleRecent} />
      <ChoThueSection properties={rentRecent} />
      <TinTucSection articles={articlesList} />
    </div>
  );
}
