import Link from 'next/link'
import Image from 'next/image'

function formatDate(date) {
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default function TinTucSection({ articles }) {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary">Kiến thức</p>
            <h2 className="mt-1 text-3xl font-extrabold text-slate-900">Người mua hàng thông minh</h2>
            <p className="mt-2 text-slate-600">
              Những kiến thức bạn cần nắm rõ khi đầu tư mua bất động sản
            </p>
          </div>
          <Link
            href="/tin-tuc"
            className="flex items-center gap-2 rounded-lg border-2 border-primary px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
          >
            Xem tất cả
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Grid */}
        {articles.length === 0 ? (
          <div className="rounded-xl bg-slate-50 p-12 text-center text-slate-400">
            Chưa có bài viết nào.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map(article => (
              <Link
                key={article.id}
                href={`/tin-tuc/${article.slug}`}
                className="group overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {article.thumbnail && (
                  <div className="h-48 overflow-hidden">
                    <Image
                      src={article.thumbnail}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-primary">
                      Tin tức
                    </span>
                    <span className="text-xs text-slate-400">{formatDate(article.createdAt)}</span>
                  </div>
                  <h3 className="mt-3 line-clamp-2 text-base font-semibold text-slate-900 transition group-hover:text-primary">
                    {article.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-500">{article.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Đọc tiếp
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
