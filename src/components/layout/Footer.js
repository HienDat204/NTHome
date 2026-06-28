import Link from "next/link";
import { LISTING_TYPES } from "@/lib/listings";

export default function Footer() {
  return (
    <footer className="bg-secondary text-slate-300">
      {/* Hotline Banner */}
      <div className="bg-primary py-4">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <svg
                className="h-5 w-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-red-100">Hotline hỗ trợ 24/7</p>
              <p className="text-xl font-extrabold text-white">
                0935 278 703 - 0777 520 590
              </p>
            </div>
          </div>
          <a
            href="tel:0909999999"
            className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-primary transition hover:bg-red-50"
          >
            Gọi ngay
          </a>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏠</span>
              <span className="text-xl font-bold text-white">
                Kiên Hưng Group
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Nền tảng bất động sản chuyên nghiệp, tối ưu SEO, responsive và dễ
              quản trị. Kết nối khách hàng nhanh chóng, hiệu quả.
            </p>
            {/* Social Icons */}
            <div className="mt-5 flex gap-2">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white hover:opacity-80"
                title="Facebook"
              >
                f
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-500 text-xs font-bold text-white hover:opacity-80"
                title="Instagram"
              >
                in
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-white hover:opacity-80"
                title="Twitter"
              >
                tw
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white hover:opacity-80"
                title="LinkedIn"
              >
                li
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white hover:opacity-80"
                title="YouTube"
              >
                yt
              </a>
            </div>
          </div>

          {/* Thông tin liên hệ */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white">
              Thông tin liên hệ
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <svg
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                22B4-An Thượng 38, Đà Nẵng, Việt Nam
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 flex-shrink-0 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <a href="tel:0935278703" className="hover:text-white">
                  0935 278 703 - 0777 520 590
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 flex-shrink-0 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <a
                  href="mailto:info@nextestate.vn"
                  className="hover:text-white"
                >
                  info@nextestate.vn
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 flex-shrink-0 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                    clipRule="evenodd"
                  />
                </svg>
                www.nextestate.vn
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-slate-500">
          © 2026 Kiên Hưng Group. All rights reserved. Thiết kế website bất động
          sản chuyên nghiệp.
        </div>
      </div>
    </footer>
  );
}
