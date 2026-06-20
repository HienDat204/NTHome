import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getProperty(slug) {
  try {
    return await prisma.property.findUnique({
      where: { slug },
      include: { images: true },
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
        <div className="space-y-6">
          <div className="overflow-hidden rounded-[2rem] bg-slate-900">
            <img
              src={property.thumbnail}
              alt={property.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {property.images.map((image) => (
              <div
                key={image.id}
                className="overflow-hidden rounded-[1.5rem] bg-slate-100"
              >
                <img
                  src={image.imageUrl}
                  alt={property.title}
                  className="h-56 w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-8">
          <div className="rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-200/60">
            <p className="text-sm uppercase tracking-[0.24em] text-secondary">
              {property.propertyType}
            </p>
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
            <form className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Họ tên
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Tin nhắn
                </label>
                <textarea
                  name="message"
                  rows="4"
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                  defaultValue={`Tôi muốn biết thêm về ${property.title}.`}
                />
              </div>
              <button
                type="button"
                disabled
                className="w-full rounded-full bg-secondary px-6 py-3 text-base font-semibold text-white hover:bg-blue-600"
              >
                Chỉ gửi từ trang admin
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
