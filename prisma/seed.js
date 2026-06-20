const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:../database/database.db'
  console.log('[seed] DATABASE_URL is missing, using fallback file:../database/database.db')
}

const prisma = new PrismaClient()

const seedData = {
  admin: {
    username: 'admin',
    email: 'admin@example.com',
    password: '123456'
  },
  properties: [
    { title: 'Căn hộ cao cấp 2PN tại Landmark 81', slug: 'can-ho-cao-cap-2pn-landmark-81', description: 'Căn hộ cao cấp 2 phòng ngủ với view Bitexco tuyệt đẹp, nội thất đầy đủ, tiện ích đỉnh cao.', price: 3500000000, area: 85, bedrooms: 2, bathrooms: 2, address: 'Đường Nguyễn Hữu Cảnh', city: 'TP HCM', district: 'Bình Thạnh', propertyType: 'Căn hộ', thumbnail: '', featured: true },
    { title: 'Nhà phố vị trí đẹp quận 3', slug: 'nha-pho-vi-tri-dep-quan-3', description: 'Nhà phố 5 tầng, 3 phòng ngủ, mặt tiền 6m, kế bên trường tiểu học nổi tiếng, vị trí kinh doanh.', price: 8500000000, area: 120, bedrooms: 3, bathrooms: 3, address: 'Đường Lê Thánh Tông', city: 'TP HCM', district: 'Quận 3', propertyType: 'Nhà phố', thumbnail: '', featured: true },
    { title: 'Biệt thự view sông Tây Hồ', slug: 'biet-thu-view-song-tay-ho', description: 'Biệt thự 4 tầng view sông Tây Hồ, 4 phòng ngủ, sân vườn rộng, thích hợp ở và kinh doanh.', price: 15000000000, area: 200, bedrooms: 4, bathrooms: 4, address: 'Đường Đào Tấn', city: 'Hà Nội', district: 'Tây Hồ', propertyType: 'Biệt thự', thumbnail: '', featured: true },
    { title: 'Căn hộ chung cư Goldmark City', slug: 'can-ho-chung-cu-goldmark-city', description: 'Căn hộ 3PN tại Goldmark City, nội thất sang trọng, view Hồ Tây đẹp mê mẩn.', price: 2800000000, area: 95, bedrooms: 3, bathrooms: 2, address: 'Đường Lê Văn Lương', city: 'Hà Nội', district: 'Thanh Xuân', propertyType: 'Căn hộ', thumbnail: '', featured: false },
    { title: 'Đất nền khu đô thị Vạn Phúc', slug: 'dat-nen-khu-do-thi-van-phuc', description: 'Lô đất nền 100m2 tại dự án Vạn Phúc, tiểu khu Westlake, pháp lý rõ ràng, sổ đỏ trao tay.', price: 3200000000, area: 100, bedrooms: 0, bathrooms: 0, address: 'Khu đô thị Vạn Phúc', city: 'Hà Nội', district: 'Hà Đông', propertyType: 'Đất nền', thumbnail: '', featured: false },
    { title: 'Căn shop Vincom Bà Triệu', slug: 'can-shop-vincom-ba-trieu', description: 'Cửa hàng kinh doanh tại Vincom Bà Triệu, vị trí vàng, khách hàng đông.', price: 5000000000, area: 50, bedrooms: 0, bathrooms: 1, address: 'Đường Bà Triệu', city: 'Hà Nội', district: 'Hoàn Kiếm', propertyType: 'Shop', thumbnail: '', featured: false }
  ],
  projects: [
    { name: 'Dự án Landmark 81', slug: 'du-an-landmark-81', investor: 'Tập đoàn Vingroup', address: 'Đường Nguyễn Hữu Cảnh, Bình Thạnh, TP HCM', description: 'Dự án tòa nhà cao nhất Việt Nam với 81 tầng, chứa căn hộ, officetel, khách sạn 5 sao, trung tâm mua sắm.', thumbnail: '' },
    { name: 'Dự án Goldmark City', slug: 'du-an-goldmark-city', investor: 'Tập đoàn Nippon Paint', address: 'Đường Lê Văn Lương, Thanh Xuân, Hà Nội', description: 'Dự án chung cư cao cấp với hơn 10,000 cư dân, tiện ích đầy đủ, view Hồ Tây.', thumbnail: '' },
    { name: 'Dự án Vạn Phúc', slug: 'du-an-van-phuc', investor: 'Tập đoàn Khải Tâm', address: 'Hà Đông, Hà Nội', description: 'Dự án khu đô thị quy mô 100 ha, tiêu chuẩn sống quốc tế, gần gũi với thiên nhiên.', thumbnail: '' }
  ],
  articles: [
    { title: 'Cách chọn dự án đầu tư thông minh năm 2026', slug: 'cach-chon-du-an-dau-tu-thong-minh', excerpt: 'Những tiêu chí cần biết khi chọn dự án bất động sản để đầu tư dài hạn với lợi nhuận cao.', content: 'Khi đầu tư bất động sản, bạn cần xem xét vị trí, tiến độ, pháp lý rõ ràng, nhà đầu tư uy tín và tiềm năng tăng giá.', thumbnail: '' },
    { title: 'Thị trường nhà đất 2026: Xu hướng mới', slug: 'thi-truong-nha-dat-2026-xu-huong-moi', excerpt: 'Đánh giá thị trường và dự báo giá ở những khu vực nổi bật Hà Nội, TP HCM, Đà Nẵng.', content: 'Năm 2026, thị trường bất động sản dự kiến tiếp tục ổn định với sự quan tâm lớn từ nhà đầu tư. Khu vực trung tâm sẽ tiếp tục tăng giá.', thumbnail: '' }
  ],
  setting: {
    siteName: 'Next Estate',
    logo: '/logo.png',
    hotline: '0909 999 999',
    email: 'info@nextestate.vn',
    facebook: 'https://facebook.com/nextestate',
    zalo: '0909999999',
    address: 'Hà Nội, Việt Nam'
  }
}

async function main() {
  console.log('🌱 Seeding database...')

  try {
    // Check and create admin
    const existingAdmin = await prisma.admin.findFirst()
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(seedData.admin.password, 10)
      await prisma.admin.create({
        data: { ...seedData.admin, password: hashedPassword }
      })
      console.log('✓ Admin account created')
    } else {
      console.log('⏭  Admin already exists, skipping.')
    }

    // Check and create properties
    const existingProps = await prisma.property.count()
    if (existingProps < seedData.properties.length) {
      // Get existing slugs to avoid duplicates
      const existing = await prisma.property.findMany({ select: { slug: true } })
      const existingSlugs = new Set(existing.map(p => p.slug))
      let added = 0
      for (const property of seedData.properties) {
        if (!existingSlugs.has(property.slug)) {
          await prisma.property.create({ data: property })
          added++
        }
      }
      console.log(`✓ ${added} properties added (total: ${existingProps + added})`)
    } else {
      console.log(`⏭  ${existingProps} properties already exist, skipping.`)
    }

    // Check and create projects
    const existingProjects = await prisma.project.count()
    if (existingProjects === 0) {
      for (const project of seedData.projects) {
        await prisma.project.create({ data: project })
      }
      console.log(`✓ ${seedData.projects.length} projects created`)
    } else {
      console.log(`⏭  ${existingProjects} projects already exist, skipping.`)
    }

    // Check and create articles
    const existingArticles = await prisma.article.count()
    if (existingArticles === 0) {
      for (const article of seedData.articles) {
        await prisma.article.create({ data: article })
      }
      console.log(`✓ ${seedData.articles.length} articles created`)
    } else {
      console.log(`⏭  ${existingArticles} articles already exist, skipping.`)
    }

    // Check and create settings
    const existingSettings = await prisma.setting.count()
    if (existingSettings === 0) {
      await prisma.setting.create({ data: seedData.setting })
      console.log('✓ Settings created')
    } else {
      console.log('⏭  Settings already exist, skipping.')
    }

    console.log('✅ Database seeded successfully!')
  } catch (error) {
    console.error('❌ Seed error:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
