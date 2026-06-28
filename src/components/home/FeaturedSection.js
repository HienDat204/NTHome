'use client'

import Link from 'next/link'
import PropertyCard from '@/components/cards/PropertyCard'
import { SALE_TYPES, RENT_TYPES } from '@/lib/listings'

export default function FeaturedSection({ featuredProperties = [] }) {
  const DISPLAY_LIMIT = 4
  const hasMore = featuredProperties.length > DISPLAY_LIMIT
  const visible = featuredProperties.slice(0, DISPLAY_LIMIT)

  return (
    <section className="bg-gradient-to-br from-slate-50 to-white py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary">
              Nổi bật
            </p>
            <h2 className="mt-1 text-3xl font-extrabold text-slate-900">
              SẢN PHẨM NỔI BẬT
            </h2>
            <p className="mt-2 max-w-xl text-slate-600">
              Những bất động sản được chọn lọc, chất lượng và giá tốt nhất.
              Liên hệ hotline{' '}
              <a href="tel:0935278703" className="font-semibold text-primary">
                0935 278 703
              </a>{' '}
              để được hỗ trợ nhanh nhất.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href={SALE_TYPES.ban_nha.path}
              className="flex items-center gap-2 rounded-lg border-2 border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
            >
              Mua bán
            </Link>
            <Link
              href={RENT_TYPES.cho_thue_nha.path}
              className="flex items-center gap-2 rounded-lg border-2 border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
            >
              Cho thuê
            </Link>
          </div>
        </div>

        {/* Grid */}
        {featuredProperties.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center text-slate-400 shadow-sm">
            Chưa có sản phẩm nổi bật nào. Vui lòng bật tính năng "Nổi bật" cho
            bất động sản trong trang Admin.
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <Link
                  href="/bat-dong-san"
                  className="flex items-center gap-2 rounded-full border-2 border-primary px-8 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                >
                  Xem tất cả
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
