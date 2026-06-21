'use client'

import { useState } from 'react'

export default function PropertyGallery({ thumbnail, images, title }) {
  // Tạo mảng tất cả ảnh: thumbnail + images
  const allImages = [
    { id: 'thumbnail', imageUrl: thumbnail },
    ...images
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
  }

  const goToImage = (index) => {
    setCurrentIndex(index)
  }

  return (
    <div className="space-y-6">
      {/* Ảnh chính với mũi tên */}
      <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 group">
        <img
          src={allImages[currentIndex].imageUrl}
          alt={title}
          className="h-[500px] w-full object-cover"
        />

        {/* Mũi tên trái */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-900 rounded-full w-12 h-12 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Ảnh trước"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Mũi tên phải */}
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-900 rounded-full w-12 h-12 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Ảnh sau"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Indicator số ảnh */}
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {allImages.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails bên dưới */}
      {allImages.length > 1 && (
        <div className="grid gap-4 sm:grid-cols-4">
          {allImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => goToImage(index)}
              className={`overflow-hidden rounded-[1.5rem] transition-all ${
                currentIndex === index
                  ? 'ring-4 ring-secondary ring-offset-2 scale-105'
                  : 'hover:scale-105 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={image.imageUrl}
                alt={`${title} - Ảnh ${index + 1}`}
                className="h-32 w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
