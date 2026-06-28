"use client";

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-center gap-3">
      {/* Zalo */}
      <a
        href="https://zalo.me/09035278703"
        target="_blank"
        rel="noopener noreferrer"
        title="Chat Zalo"
        className="group relative flex h-13 w-13 items-center justify-center"
      >
        <span className="absolute -left-20 hidden whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1 text-xs text-white group-hover:block">
          Chat Zalo
        </span>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transition-transform hover:scale-110">
          <svg viewBox="0 0 48 48" className="h-7 w-7" fill="white">
            <path d="M24 4C12.95 4 4 12.95 4 24c0 3.9 1.06 7.55 2.9 10.67L4 44l9.56-2.88A19.9 19.9 0 0024 44c11.05 0 20-8.95 20-20S35.05 4 24 4zm9.9 27.2c-.4 1.1-2.35 2.1-3.2 2.2-.82.1-1.87.14-3.02-.19a27.5 27.5 0 01-2.73-1c-4.8-2.07-7.93-6.88-8.18-7.2-.24-.33-1.94-2.58-1.94-4.92s1.23-3.5 1.66-3.97c.44-.48.96-.6 1.28-.6l.92.02c.29.01.68-.11.98.68l1.37 3.34c.11.27.05.58-.13.84l-.56.72c-.19.24-.4.5-.17.96.22.46 1 1.79 2.16 2.9 1.48 1.41 2.73 1.85 3.2 2.07.46.21.73.17.99-.1l.8-.95c.28-.35.54-.28.9-.17l3.14 1.48c.46.21.77.32.88.5.11.18.11 1.04-.3 2.14z" />
          </svg>
        </div>
      </a>

      {/* Phone - Animated */}
      <a
        href="tel:0935278703"
        title="Gọi ngay: 0935 278 703"
        className="group relative flex h-13 w-13 items-center justify-center"
      >
        <span className="absolute -left-28 hidden whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1 text-xs text-white group-hover:block">
          0935 278 703
        </span>
        <div className="flex h-12 w-12 animate-bounce items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110 hover:animate-none">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
        </div>
      </a>
    </div>
  );
}
