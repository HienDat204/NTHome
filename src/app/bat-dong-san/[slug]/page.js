import prisma from "@/lib/prisma";
import QuickContactForm from "@/components/properties/QuickContactForm";
import PropertyGallery from "@/components/properties/PropertyGallery";

export const dynamic = "force-dynamic";

async function getProperty(slug) {
  try {
    return await prisma.property.findUnique({
      where: { slug },
      include: { images: { orderBy: { id: 'asc' } } },
    });
  } catch (error) {
    console.error("PropertyDetailPage DB fallback:", error);
    return null;
  }
}

export default async function PropertyDetailPage({ params }) {
  const property = await getProperty(params.slug);
  if (!property)
    return (
      <div className="container mx-auto px-6 py-20">
        Bất động sản không tìm thấy.
      </div>
    );

  return (
    <section className="container mx-auto px-6 py-12">
      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <PropertyGallery
          thumbnail={property.thumbnail}
          images={property.images}
          title={property.title}
        />
        <div className="space-y-8">
          <div className="rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-200/60">
            <p className="text-sm uppercase tracking-[0.24em] text-secondary">
              {property.propertyType}
            </p>
            {property.promoBadge ? (
              <p className="mt-4 inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800">
                {property.promoBadge}
              </p>
            ) : null}
            <h1 className="mt-4 text-4xl font-semibold text-slate-900">
              {property.title}
            </h1>
            <p className="mt-4 text-3xl font-semibold text-secondary">
              {property.price.toLocaleString()} ₫
            </p>
            <p className="mt-4 text-slate-600">
              {property.address}, {property.district}, {property.city}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-700">
                Diện tích{" "}
                <strong className="block text-xl text-slate-900">
                  {property.area} m²
                </strong>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-700">
                Phòng ngủ{" "}
                <strong className="block text-xl text-slate-900">
                  {property.bedrooms}
                </strong>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-700">
                Phòng tắm{" "}
                <strong className="block text-xl text-slate-900">
                  {property.bathrooms}
                </strong>
              </div>
            </div>
          </div>
          <div className="rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-200/60">
            <h2 className="text-2xl font-semibold text-slate-900">
              Mô tả chi tiết
            </h2>
            <p className="mt-4 text-slate-600 leading-8">
              {property.description}
            </p>
          </div>
          <div className="rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-200/60">
            <h2 className="text-2xl font-semibold text-slate-900">
              Liên hệ nhanh
            </h2>
            <QuickContactForm propertyTitle={property.title} />
          </div>
        </div>
      </div>
    </section>
  );
}
