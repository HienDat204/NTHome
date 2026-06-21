'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { LISTING_TYPES } from '@/lib/listings'

const cards = [
  { label: 'Mua nhà', description: 'Dự án căn hộ, nhà phố, biệt thự phù hợp nhu cầu đầu tư.', href: LISTING_TYPES.sale.path },
  { label: 'Thuê nhà', description: 'Bất động sản cho thuê địa điểm trung tâm, tiện nghi đầy đủ.', href: LISTING_TYPES.rent.path },
  { label: 'Dự án', description: 'Dự án mới, pháp lý rõ ràng và tiến độ minh bạch.', href: '/du-an' }
]

export default function FeaturedSection() {
  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/50">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-secondary">Dịch vụ toàn diện</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Giải pháp bất động sản tối ưu cho khách hàng.</h2>
          </div>
          <div className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">Đã chọn lọc hơn 20 dự án</div>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {cards.map((item) => (
            <motion.article key={item.label} whileHover={{ y: -6 }} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">{item.label}</h3>
              <p className="mt-4 text-slate-600">{item.description}</p>
              <Link href={item.href} className="mt-6 inline-flex text-sm font-semibold text-secondary">Xem chi tiết →</Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
