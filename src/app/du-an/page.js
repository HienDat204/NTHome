import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getProjects() {
  try {
    return await prisma.project.findMany({ orderBy: { id: "desc" } });
  } catch (error) {
    console.error("ProjectsPage DB fallback:", error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <section className="container mx-auto px-6 py-12">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-secondary">
            Dự án
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Dự án bất động sản tiêu biểu
          </h1>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/du-an/${project.slug}`}
            className="group overflow-hidden rounded-[2rem] bg-white shadow-lg shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div
              className="h-64 bg-cover bg-center"
              style={{ backgroundImage: `url(${project.thumbnail})` }}
            />
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-slate-900">
                {project.name}
              </h2>
              <p className="mt-3 text-sm text-slate-600 line-clamp-3">
                {project.description}
              </p>
              <div className="mt-5 text-sm text-slate-500">
                Nhà đầu tư: {project.investor}
              </div>
              <div className="mt-2 text-sm text-slate-500">
                Địa chỉ: {project.address}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
