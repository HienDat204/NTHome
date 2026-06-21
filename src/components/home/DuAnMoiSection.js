import Link from "next/link";
import ProjectCard from "@/components/cards/ProjectCard";

export default function DuAnMoiSection({ projects }) {
  return (
    <section className="bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary">
              Bất động sản
            </p>
            <h2 className="mt-1 text-3xl font-extrabold text-slate-900">
              DỰ ÁN MỚI
            </h2>
            <p className="mt-2 max-w-xl text-slate-600">
              Tổng hợp những dự án hot nhất trên thị trường bất động sản hiện
              nay. Liên hệ hotline{" "}
              <a href="tel:0935278703" className="font-semibold text-primary">
                0935 278 703
              </a>{" "}
              để được hỗ trợ mua nhà nhanh nhất.
            </p>
          </div>
          <Link
            href="/du-an"
            className="flex items-center gap-2 rounded-lg border-2 border-primary px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
          >
            Xem tất cả
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {/* Grid */}
        {projects.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center text-slate-400">
            Chưa có dự án nào. Vui lòng thêm dữ liệu trong Admin.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.slice(0, 4).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
