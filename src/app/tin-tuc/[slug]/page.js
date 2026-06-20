import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getArticle(slug) {
  return prisma.article.findUnique({ where: { slug } });
}

export default async function ArticleDetailPage({ params }) {
  const article = await getArticle(params.slug);
  if (!article)
    return (
      <div className="container mx-auto px-6 py-20">
        Bài viết không tìm thấy.
      </div>
    );

  return (
    <section className="container mx-auto px-6 py-12">
      <div className="rounded-[2rem] bg-white p-10 shadow-lg shadow-slate-200/60">
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold text-slate-900">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span>
              {new Date(article.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
          <p className="mt-4 text-lg leading-8 text-slate-700">
            {article.content}
          </p>
        </div>
      </div>
    </section>
  );
}
