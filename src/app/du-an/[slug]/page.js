import prisma from "@/lib/prisma";
import PropertyGallery from "@/components/properties/PropertyGallery";

export const dynamic = "force-dynamic";

async function getProject(slug) {
  try {
    return await prisma.project.findUnique({
      where: { slug },
      select: {
        id: true, slug: true, name: true, investor: true, address: true,
        description: true, highlightInfo: true, thumbnail: true,
        images: { select: { id: true, imageUrl: true }, orderBy: { id: 'asc' } },
      }
    });
  } catch (error) {
    console.error("ProjectDetailPage DB fallback:", error);
    return null;
  }
}

export default async function ProjectDetailPage({ params }) {
  const project = await getProject(params.slug);
  if (!project)
    return (
      <div className="container mx-auto px-6 py-20">Dự án không tìm thấy.</div>
    );

  return (
    <section className="container mx-auto px-6 py-12">
      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-8">
          <PropertyGallery
            thumbnail={project.thumbnail}
            images={project.images || []}
            title={project.name}
          />
          <div className="rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-200/60">
            <h1 className="text-4xl font-semibold text-slate-900">
              {project.name}
            </h1>
            {project.highlightInfo ? (
              <p className="mt-4 inline-flex rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
                {project.highlightInfo}
              </p>
            ) : null}
            <p className="mt-4 text-slate-600">
              Nhà đầu tư: {project.investor}
            </p>
            <p className="mt-4 text-slate-600">Địa chỉ: {project.address}</p>
            <p className="mt-6 leading-8 text-slate-700">
              {project.description}
            </p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-200/60">
            <h2 className="text-2xl font-semibold text-slate-900">
              Thông tin dự án
            </h2>
            <p className="mt-4 text-slate-600">
              Dự án được cập nhật đầy đủ thông tin, hình ảnh tiến độ và liên hệ
              tư vấn nhanh chóng.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
