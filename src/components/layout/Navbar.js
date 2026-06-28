"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SALE_TYPES, RENT_TYPES } from "@/lib/listings";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/lien-he", label: "Liên hệ" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [desktopSaleOpen, setDesktopSaleOpen] = useState(false);
  const [desktopRentOpen, setDesktopRentOpen] = useState(false);
  const [mobileSaleOpen, setMobileSaleOpen] = useState(false);
  const [mobileRentOpen, setMobileRentOpen] = useState(false);
  const [searchForm, setSearchForm] = useState({
    q: "",
    city: "",
    district: "",
  });
  const router = useRouter();
  const path = usePathname();
  const isSaleActive = path.startsWith("/bat-dong-san/ban") || path.startsWith("/bat-dong-san/mua-ban");
  const isRentActive = path.startsWith("/bat-dong-san/cho-thue");

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const params = new URLSearchParams();
    if (searchForm.q) params.set("q", searchForm.q);
    if (searchForm.city) params.set("city", searchForm.city);
    if (searchForm.district) params.set("district", searchForm.district);

    router.push(
      `/bat-dong-san${params.toString() ? `?${params.toString()}` : ""}`,
    );
    setSearchOpen(false);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-secondary shadow-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🏠</span>
          <span className="text-lg font-bold text-white">Next Estate</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks
            .filter((link) => link.href === "/")
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  path === link.href
                    ? "bg-primary text-white"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          {/* Mua bán dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDesktopSaleOpen(true)}
            onMouseLeave={() => setDesktopSaleOpen(false)}
          >
            <button
              type="button"
              onClick={() => setDesktopSaleOpen((open) => !open)}
              className={`flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                isSaleActive
                  ? "bg-primary text-white"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              Mua bán
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {desktopSaleOpen && (
              <div className="absolute left-0 top-full z-50 w-64 pt-2">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl backdrop-blur">
                  <Link
                    href="/bat-dong-san/mua-ban"
                    onClick={() => setDesktopSaleOpen(false)}
                    className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                      path === "/bat-dong-san/mua-ban" ? "bg-primary text-white" : "text-slate-200 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <div className="font-semibold">Mua bán</div>
                    <div className="mt-1 text-xs text-slate-400">Danh sách bất động sản đang bán.</div>
                  </Link>
                  <div className="mt-1 border-t border-white/10 pt-1">
                    {Object.values(SALE_TYPES).map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setDesktopSaleOpen(false)}
                        className={`block rounded-lg px-4 py-2 text-xs transition ${
                          path === item.path ? "bg-primary/30 text-white font-medium" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cho thuê dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDesktopRentOpen(true)}
            onMouseLeave={() => setDesktopRentOpen(false)}
          >
            <button
              type="button"
              onClick={() => setDesktopRentOpen((open) => !open)}
              className={`flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                isRentActive
                  ? "bg-primary text-white"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              Cho thuê
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {desktopRentOpen && (
              <div className="absolute left-0 top-full z-50 w-64 pt-2">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl backdrop-blur">
                  <Link
                    href="/bat-dong-san/cho-thue"
                    onClick={() => setDesktopRentOpen(false)}
                    className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                      path === "/bat-dong-san/cho-thue" ? "bg-primary text-white" : "text-slate-200 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <div className="font-semibold">Cho thuê</div>
                    <div className="mt-1 text-xs text-slate-400">Tổng hợp những bất động sản cho thuê hot nhất.</div>
                  </Link>
                  <div className="mt-1 border-t border-white/10 pt-1">
                    {Object.values(RENT_TYPES).map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setDesktopRentOpen(false)}
                        className={`block rounded-lg px-4 py-2 text-xs transition ${
                          path === item.path ? "bg-primary/30 text-white font-medium" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          {navLinks
            .filter((link) => link.href !== "/")
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  path === link.href
                    ? "bg-primary text-white"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
        </nav>

        {/* Right: Hotline + Search + Hamburger */}
        <div className="flex items-center gap-2">
          <a
            href="tel:0909999999"
            className="hidden items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 md:flex"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            0935 278 703
          </a>

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="rounded-md p-2 text-slate-300 hover:bg-white/10 hover:text-white"
            aria-label="Tìm kiếm"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-md p-2 text-slate-300 hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Menu"
          >
            {menuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Search Dropdown */}
      {searchOpen && (
        <div className="border-t border-white/10 bg-secondary px-4 py-3">
          <form
            onSubmit={handleSearchSubmit}
            className="container mx-auto grid gap-2 md:grid-cols-[1.4fr_1fr_1fr_auto]"
          >
            <input
              type="text"
              value={searchForm.q}
              onChange={(event) =>
                setSearchForm((prev) => ({ ...prev, q: event.target.value }))
              }
              placeholder="Tìm theo tên, địa chỉ, dự án..."
              className="flex-1 rounded-lg bg-white/10 px-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              value={searchForm.city}
              onChange={(event) =>
                setSearchForm((prev) => ({ ...prev, city: event.target.value }))
              }
              placeholder="Thành phố"
              className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              value={searchForm.district}
              onChange={(event) =>
                setSearchForm((prev) => ({
                  ...prev,
                  district: event.target.value,
                }))
              }
              placeholder="Quận / huyện"
              className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-red-700">
              Tìm kiếm
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-secondary px-4 pb-4 pt-2 md:hidden">
          {navLinks
            .filter((link) => link.href === "/")
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`mb-2 block rounded-md px-3 py-2 text-sm font-medium ${
                  path === link.href
                    ? "bg-primary text-white"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          {/* Mua bán mobile */}
          <button
            type="button"
            onClick={() => setMobileSaleOpen((open) => !open)}
            className={`mb-2 flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium ${isSaleActive ? "bg-primary text-white" : "text-slate-300 hover:text-white"}`}
          >
            <span>Mua bán</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {mobileSaleOpen && (
            <div className="mb-3 space-y-1 pl-3">
              <Link
                href="/bat-dong-san/mua-ban"
                onClick={() => { setMenuOpen(false); setMobileSaleOpen(false); }}
                className={`block rounded-md px-3 py-2 text-sm font-medium ${path === "/bat-dong-san/mua-ban" ? "bg-primary text-white" : "text-slate-300 hover:text-white"}`}
              >
                Mua bán
              </Link>
              {Object.values(SALE_TYPES).map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => { setMenuOpen(false); setMobileSaleOpen(false); }}
                  className={`block rounded-md px-3 py-1.5 text-xs ${path === item.path ? "bg-primary/30 text-white font-medium" : "text-slate-400 hover:text-slate-200"}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {/* Cho thuê mobile */}
          <button
            type="button"
            onClick={() => setMobileRentOpen((open) => !open)}
            className={`mb-2 flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium ${isRentActive ? "bg-primary text-white" : "text-slate-300 hover:text-white"}`}
          >
            <span>Cho thuê</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {mobileRentOpen && (
            <div className="mb-3 space-y-1 pl-3">
              <Link
                href="/bat-dong-san/cho-thue"
                onClick={() => { setMenuOpen(false); setMobileRentOpen(false); }}
                className={`block rounded-md px-3 py-2 text-sm font-medium ${path === "/bat-dong-san/cho-thue" ? "bg-primary text-white" : "text-slate-300 hover:text-white"}`}
              >
                Cho thuê
              </Link>
              {Object.values(RENT_TYPES).map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => { setMenuOpen(false); setMobileRentOpen(false); }}
                  className={`block rounded-md px-3 py-1.5 text-xs ${path === item.path ? "bg-primary/30 text-white font-medium" : "text-slate-400 hover:text-slate-200"}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
          {navLinks
            .filter((link) => link.href !== "/")
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block rounded-md px-3 py-2 text-sm font-medium ${
                  path === link.href
                    ? "bg-primary text-white"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          <a
            href="tel:0909999999"
            className="mt-3 flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            0935 278 703
          </a>
        </div>
      )}
    </header>
  );
}
