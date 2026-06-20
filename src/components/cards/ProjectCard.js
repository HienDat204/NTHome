'use client'

import { useState } from 'react'
import Link from 'next/link'

const STATUSES = ['Đang mở bán', 'Sắp mở bán', 'Đang mở bán']
const PROMOS = ['Thanh toán 30% nhận nhà', 'Tặng nội thất 1 tỷ', 'Hỗ trợ vay 70%']

export default function ProjectCard({ project, index = 0 }) {
  const status = STATUSES[index % STATUSES.length]
  const promo = PROMOS[index % PROMOS.length]
  const isOpen = status === 'Đang mở bán'

  return (
    <div className="group overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={project.thumbnail}
          alt={project.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Prev/Next arrows (decorative, real gallery needs images array) */}
        <button className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/70">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/70">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Status Badge */}
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white shadow ${
            isOpen ? 'bg-green-500' : 'bg-yellow-500'
          }`}
        >
          {status}
        </span>

        {/* Promo Badge */}
        <span className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow">
          {promo}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <Link
          href={`/du-an/${project.slug}`}
          className="line-clamp-2 text-base font-semibold text-slate-900 hover:text-primary"
        >
          {project.name}
        </Link>

        {project.investor && (
          <p className="mt-1 text-xs font-medium text-slate-400">{project.investor}</p>
        )}

        <p className="mt-2 flex items-center gap-1 text-sm text-slate-500">
          <svg className="h-4 w-4 flex-shrink-0 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="line-clamp-1">{project.address}</span>
        </p>

        <Link
          href={`/du-an/${project.slug}`}
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          Xem chi tiết
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
