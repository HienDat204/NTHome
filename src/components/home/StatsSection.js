const stats = [
  { value: '20+', label: 'Dự án nổi bật' },
  { value: '150+', label: 'Bất động sản' },
  { value: '10k+', label: 'Khách hàng hài lòng' },
  { value: '50+', label: 'Bài viết chuyên sâu' }
]

export default function StatsSection() {
  return (
    <section className="rounded-3xl bg-slate-950 px-8 py-12 text-white shadow-lg shadow-slate-900/10">
      <div className="grid gap-8 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="space-y-3 border-l border-slate-800 pl-6 last:border-none lg:first:pl-0 lg:border-l-0 lg:border-r lg:last:border-none">
            <p className="text-4xl font-semibold">{item.value}</p>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
