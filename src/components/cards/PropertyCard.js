'use client'

import { useState } from 'react'
import Link from 'next/link'

function formatPrice(price) {
  const n = Number(price)
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)} tỷ`
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)} triệu`
  return n.toLocaleString('vi-VN') + ' đ'
}

export default function PropertyCard({ property, promoBadge = '' }) {
  const images =
    property.images && property.images.length > 0
      ? [property.thumbnail, ...property.images.map(i => i.imageUrl)]
      : [property.thumbnail]

  const [idx, setIdx] = useState(0)
  const [hovered, setHovered] = useState(false)
  const resolvedPromoBadge = promoBadge || property.promoBadge || ''

  const prev = (e) => {
    e.preventDefault()
    setIdx(i => (i - 1 + images.length) % images.length)
  }
  const next = (e) => {
    e.preventDefault()
    setIdx(i => (i + 1) % images.length)
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <div
        className="relative h-52 overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={images[idx]}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500"
          style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
        />

        {/* Prev / Next arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              style={{ opacity: hovered ? 1 : 0 }}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white transition hover:bg-black/70"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              style={{ opacity: hovered ? 1 : 0 }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white transition hover:bg-black/70"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Promo Badge */}
        {resolvedPromoBadge && (
          <span className="absolute right-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white shadow">
            {resolvedPromoBadge}
          </span>
        )}

        {/* Image dots */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
            {images.map((_, i) => (
              <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === idx ? 'bg-white' : 'bg-white/50'}`} />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <Link
          href={`/bat-dong-san/${property.slug}`}
          className="line-clamp-2 text-base font-semibold text-slate-900 hover:text-primary"
        >
          {property.title}
        </Link>

        <p className="mt-2 flex items-center gap-1 text-sm text-slate-500">
          <svg className="h-4 w-4 flex-shrink-0 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="line-clamp-1">{property.address}, {property.district}, {property.city}</span>
        </p>

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-lg font-bold text-primary">{formatPrice(property.price)}</span>
          <span className="text-sm text-slate-400">{property.area} m²</span>
        </div>

        {property.bedrooms > 0 && (
          <div className="mt-2 flex gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                <path fillRule="evenodd" d="M1 14a1 1 0 011-1h16a1 1 0 110 2H2a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              {property.bedrooms} PN
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.625 2.655A9 9 0 0119 11a1 1 0 11-2 0 7 7 0 00-9.625-6.492 1 1 0 11-.75-1.853zM4.662 4.959A1 1 0 014.75 6.37 6.97 6.97 0 003 11a1 1 0 11-2 0 8.97 8.97 0 012.25-5.953 1 1 0 011.412-.088z" clipRule="evenodd" />
              </svg>
              {property.bathrooms} WC
            </span>
            <span>{property.propertyType}</span>
          </div>
        )}
      </div>
    </div>
  )
}
