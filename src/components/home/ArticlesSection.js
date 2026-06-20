import Link from 'next/link'

const articles = [
  { title: 'Cách chọn dự án đầu tư thông minh', slug: 'cach-chon-du-an-dau-tu-thong-minh', excerpt: 'Các tiêu chí cần biết khi chọn dự án bất động sản để đầu tư dài hạn.', date: '20/06/2026' },
  { title: 'Thị trường nhà đất 2026: Xu hướng mới', slug: 'thi-truong-nha-dat-2026-xu-huong-moi', excerpt: 'Đánh giá thị trường và dự báo giá ở những khu vực nổi bật.', date: '18/06/2026' },
  { title: '5 Lưu ý phong thủy khi mua nhà', slug: '5-luu-y-phong-thuy-khi-mua-nha', excerpt: 'Những điều nên xem xét khi mua căn hộ, nhà phố và đất nền.', date: '15/06/2026' }
]

export default function ArticlesSection() {
  return (
    <section className="container mx-auto rounded-3xl bg-white px-6 py-12 shadow-lg shadow-slate-200/50">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-secondary">Bản tin</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">Tin tức tư vấn đầu tư</h2>
        </div>
        <Link href="/tin-tuc" className="text-sm font-semibold text-secondary">Xem tất cả bài viết →</Link>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {articles.map((post) => (
          <article key={post.slug} className="rounded-3xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:shadow-lg">
            <div className="text-xs uppercase tracking-[0.25em] text-slate-400">{post.date}</div>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">{post.title}</h3>
            <p className="mt-4 text-slate-600">{post.excerpt}</p>
            <Link href={`/tin-tuc/${post.slug}`} className="mt-6 inline-flex text-sm font-semibold text-secondary">Đọc tiếp →</Link>
          </article>
        ))}
      </div>
    </section>
  )
}
