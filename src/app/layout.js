import "./globals.css";
import { Roboto } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/layout/FloatingButtons";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "Kiên Hưng Group - Bất động sản cao cấp",
  description:
    "Website bất động sản chuyên nghiệp, tìm kiếm dự án, tin tức và quản trị nội dung dễ dàng.",
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className={`${roboto.className} bg-slate-50 text-slate-900`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <FloatingButtons />
      </body>
    </html>
  );
}
