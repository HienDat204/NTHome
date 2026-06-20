import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getProject(slug) {
  return prisma.project.findUnique({ where: { slug } })
}

export default async function ProjectDetailPage({ params }) {
  const project = await getProject(params.slug)
  if (!project) return <div className="container mx-auto px-6 py-20">Dự án không tìm thấy.</div>

  return (
    <section className="container mx-auto px-6 py-12">
      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-8">
          <div className="overflow-hidden rounded-[2rem] bg-slate-900">
            <img src={project.thumbnail} alt={project.name} className="h-full w-full object-cover" />
          </div>
          <div className="rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-200/60">
            <h1 className="text-4xl font-semibold text-slate-900">{project.name}</h1>
            <p className="mt-4 text-slate-600">Nhà đầu tư: {project.investor}</p>
            <p className="mt-4 text-slate-600">Địa chỉ: {project.address}</p>
            <p className="mt-6 leading-8 text-slate-700">{project.description}</p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-200/60">
            <h2 className="text-2xl font-semibold text-slate-900">Thông tin dự án</h2>
            <p className="mt-4 text-slate-600">Dự án được cập nhật đầy đủ thông tin, hình ảnh tiến độ và liên hệ tư vấn nhanh chóng.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
