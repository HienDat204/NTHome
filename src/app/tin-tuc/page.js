import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getArticles() {
  try {
    return await prisma.article.findMany({ orderBy: { createdAt: "desc" } });
  } catch (error) {
    console.error("ArticlesPage DB fallback:", error);
    return [];
  }
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <section className="container mx-auto px-6 py-12">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-secondary">
            Tin tức
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Cập nhật kiến thức bất động sản
          </h1>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {articles.map((article) => (
          <article
            key={article.id}
            className="rounded-[2rem] bg-white p-6 shadow-lg shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <h2 className="text-2xl font-semibold text-slate-900">
              {article.title}
            </h2>
            <p className="mt-4 text-sm text-slate-600 line-clamp-4">
              {article.excerpt}
            </p>
            <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
              <span>
                {new Date(article.createdAt).toLocaleDateString("vi-VN")}
              </span>
              <Link
                href={`/tin-tuc/${article.slug}`}
                className="font-semibold text-secondary"
              >
                Đọc tiếp →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
