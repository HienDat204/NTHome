'use client'

import Link from "next/link";
import PropertyCard from "@/components/cards/PropertyCard";

export default function ChoThueSection({ properties = [] }) {
  return (
    <section className="bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary">
              Cho thuê
            </p>
            <h2 className="mt-1 text-3xl font-extrabold text-slate-900">
              CHO THUÊ
            </h2>
            <p className="mt-2 text-slate-600">
              Tổng hợp những bất động sản cho thuê hot nhất trên thị trường hiện nay.
              Liên hệ hotline{" "}
              <a href="tel:0935278703" className="font-semibold text-primary">
                0935 278 703
              </a>{" "}
              để được hỗ trợ.
            </p>
          </div>
          <Link
            href="/bat-dong-san/cho-thue"
            className="flex items-center gap-2 rounded-lg border-2 border-primary px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
          >
            Xem tất cả
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center text-slate-400">
            Chưa có bất động sản cho thuê.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {properties.slice(0, 4).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
