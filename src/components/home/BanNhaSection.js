import Link from 'next/link'
import PropertyCard from '@/components/cards/PropertyCard'

export default function BanNhaSection({ properties }) {
  const PROMOS = ['Mặt tiền rộng', 'Pháp lý rõ ràng', 'Sổ đỏ trao tay', 'View đẹp', 'Nội thất cao cấp', 'Vị trí đắc địa']

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary">Nhà đất</p>
            <h2 className="mt-1 text-3xl font-extrabold text-slate-900">BÁN NHÀ</h2>
            <p className="mt-2 text-slate-600">
              Danh sách bất động sản đang bán với giá tốt nhất thị trường.
            </p>
          </div>
          <Link
            href="/bat-dong-san"
            className="flex items-center gap-2 rounded-lg border-2 border-primary px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
          >
            Xem tất cả
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Grid */}
        {properties.length === 0 ? (
          <div className="rounded-xl bg-slate-50 p-12 text-center text-slate-400">
            Chưa có bất động sản nào.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {properties.slice(0, 8).map((property, i) => (
              <PropertyCard
                key={property.id}
                property={property}
                badge="Đang bán"
                promoBadge={PROMOS[i % PROMOS.length]}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
