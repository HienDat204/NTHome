import prisma from "@/lib/prisma";
import HeroSection from "@/components/home/HeroSection";
import DuAnMoiSection from "@/components/home/DuAnMoiSection";
import BanNhaSection from "@/components/home/BanNhaSection";
import ChoThueSection from "@/components/home/ChoThueSection";
import TinTucSection from "@/components/home/TinTucSection";
import { LISTING_TYPES } from "@/lib/listings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let projects = [];
  let propertiesRaw = [];
  let articlesRaw = [];

  try {
    [projects, propertiesRaw, articlesRaw] = await Promise.all([
      prisma.project.findMany({
        take: 4,
        orderBy: { id: "desc" },
        include: { images: { orderBy: { id: "asc" } } },
      }),
      prisma.property.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { images: { orderBy: { id: "asc" } } },
      }),
      prisma.article.findMany({ take: 6, orderBy: { createdAt: "desc" } }),
    ]);
  } catch (error) {
    console.error("HomePage DB fallback:", error);
  }

  // Serialize BigInt price to string for client components
  const properties = propertiesRaw.map((p) => ({
    ...p,
    price: p.price.toString(),
  }));

  const saleProperties = properties.filter(
    (property) => (property.listingType || LISTING_TYPES.sale.value) === LISTING_TYPES.sale.value,
  );
  const rentProperties = properties.filter(
    (property) => property.listingType === LISTING_TYPES.rent.value,
  );

  // Serialize article dates
  const articles = articlesRaw.map((a) => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
  }));

  return (
    <div>
      <HeroSection />
      <DuAnMoiSection projects={projects} />
      <BanNhaSection properties={saleProperties} />
      <ChoThueSection properties={rentProperties} />
      <TinTucSection articles={articles} />
    </div>
  );
}
