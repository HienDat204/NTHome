import './globals.css'
import { Poppins } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FloatingButtons from '@/components/layout/FloatingButtons'

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700']
})

export const metadata = {
  title: 'Next Estate - Bất động sản cao cấp',
  description: 'Website bất động sản chuyên nghiệp, tìm kiếm dự án, tin tức và quản trị nội dung dễ dàng.',
  metadataBase: new URL('http://localhost:3000'),
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className={`${poppins.className} bg-slate-50 text-slate-900`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <FloatingButtons />
      </body>
    </html>
  )
}

