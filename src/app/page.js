import prisma from "@/lib/prisma";
import HeroSection from "@/components/home/HeroSection";
import FeaturedSection from "@/components/home/FeaturedSection";
import BanNhaSection from "@/components/home/BanNhaSection";
import ChoThueSection from "@/components/home/ChoThueSection";
import TinTucSection from "@/components/home/TinTucSection";
import { isSaleListingType, isRentListingType } from "@/lib/listings";

export const dynamic = "force-dynamic";

// Helper: serialize property (convert BigInt price to Number)
function serializeProperty(p) {
  return {
    ...p,
    price: Number(p.price),
    createdAt: p.createdAt.toISOString(),
    images: p.images ? p.images.slice(0, 3).map(i => i.imageUrl) : [],
  }
}

export default async function HomePage() {
  let featured = [];
  let saleRecent = [];
  let rentRecent = [];
  let articlesList = [];

  try {
    const [allFeatured, allRecent, articlesResult] = await Promise.all([
      // Featured properties
      prisma.property.findMany({
        where: { featured: true },
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { images: { orderBy: { id: "asc" }, take: 3 } },
      }),
      // Recent properties (for sale/rent sections)
      prisma.property.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { images: { orderBy: { id: "asc" }, take: 3 } },
      }),
      prisma.article.findMany({ take: 6, orderBy: { createdAt: "desc" } }),
    ])

    featured = allFeatured.map(serializeProperty)

    // Filter into sale/rent in JS (lightweight — just string comparison)
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
