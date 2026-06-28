import Link from "next/link";

export const metadata = {
  title: "Liên hệ | Kiên Hưng Group",
};

export default function ContactPage() {
  return (
    <section className="container mx-auto px-6 py-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold text-slate-900">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-slate-600">
            Hãy gửi thông tin để được tư vấn miễn phí và hỗ trợ nhanh chóng.
          </p>
          <div className="space-y-4 rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-200/60">
            <p className="text-sm text-slate-500">Email</p>
            <p className="text-lg font-semibold text-slate-900">
              info@nextestate.vn
            </p>
            <p className="text-sm text-slate-500">Hotline</p>
            <p className="text-lg font-semibold text-slate-900">0935 278 703</p>
            <p className="text-sm text-slate-500">Địa chỉ</p>
            <p className="text-lg font-semibold text-slate-900">
              22B4-An Thượng 38, Đà Nẵng, Việt Nam
            </p>
          </div>
        </div>
        <form className="rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-200/60">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Họ tên
              </label>
              <input
                name="name"
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Số điện thoại
              </label>
              <input
                type="tel"
                name="phone"
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Tin nhắn
              </label>
              <textarea
                name="message"
                rows="4"
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
            </div>
            <button
              type="button"
              disabled
              className="w-full rounded-full bg-secondary px-6 py-3 text-base font-semibold text-white hover:bg-blue-600"
            >
              Chỉ gửi từ trang admin
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
