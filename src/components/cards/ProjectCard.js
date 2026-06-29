'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function ProjectCard({ project }) {
  const images = (() => {
    if (!project.images || project.images.length === 0) return [project.thumbnail]
    const imgUrls = project.images.map(i => i.imageUrl)
    return imgUrls[0] === project.thumbnail ? imgUrls : [project.thumbnail, ...imgUrls]
  })()

  const [idx, setIdx] = useState(0)
  const [hovered, setHovered] = useState(false)
  const highlightInfo = project.highlightInfo || ''

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
        <div
          className="h-full w-full transition-transform duration-500"
          style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
        >
          <Image
            src={images[idx]}
            alt={project.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        </div>

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

        {highlightInfo && (
          <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow">
            {highlightInfo}
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
