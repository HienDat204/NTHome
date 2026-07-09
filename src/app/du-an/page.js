import Link from "next/link";
import prisma from "@/lib/prisma";
import ProjectCard from "@/components/cards/ProjectCard";

export const dynamic = "force-dynamic";

async function getProjects() {
  try {
    return await prisma.project.findMany({
      orderBy: { id: "desc" },
      select: {
        id: true, slug: true, name: true, investor: true, address: true,
        description: true, highlightInfo: true, thumbnail: true,
        images: { select: { id: true, imageUrl: true }, orderBy: { id: 'asc' } },
      }
    });
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
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
