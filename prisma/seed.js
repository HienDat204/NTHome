const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:../database/database.db";
  console.log(
    "[seed] DATABASE_URL is missing, using fallback file:../database/database.db",
  );
}

const prisma = new PrismaClient();

const seedData = {
  admin: {
    username: "admin",
    email: "admin@example.com",
    password: "123456",
  },
  properties: [
    {
      title: "Căn hộ cao cấp 2PN tại Landmark 81",
      slug: "can-ho-cao-cap-2pn-landmark-81",
      listingType: "sale",
      description:
        "Căn hộ cao cấp 2 phòng ngủ với view Bitexco tuyệt đẹp, nội thất đầy đủ, tiện ích đỉnh cao.",
      price: 3500000000,
      area: 85,
      bedrooms: 2,
      bathrooms: 2,
      address: "Đường Nguyễn Hữu Cảnh",
      city: "TP HCM",
      district: "Bình Thạnh",
      propertyType: "Căn hộ",
      thumbnail: "",
      featured: true,
    },
    {
      title: "Nhà phố vị trí đẹp quận 3",
      slug: "nha-pho-vi-tri-dep-quan-3",
      listingType: "sale",
      description:
        "Nhà phố 5 tầng, 3 phòng ngủ, mặt tiền 6m, kế bên trường tiểu học nổi tiếng, vị trí kinh doanh.",
      price: 8500000000,
      area: 120,
      bedrooms: 3,
      bathrooms: 3,
      address: "Đường Lê Thánh Tông",
      city: "TP HCM",
      district: "Quận 3",
      propertyType: "Nhà phố",
      thumbnail: "",
      featured: true,
    },
    {
      title: "Biệt thự view sông Tây Hồ",
      slug: "biet-thu-view-song-tay-ho",
      listingType: "sale",
      description:
        "Biệt thự 4 tầng view sông Tây Hồ, 4 phòng ngủ, sân vườn rộng, thích hợp ở và kinh doanh.",
      price: 15000000000,
      area: 200,
      bedrooms: 4,
      bathrooms: 4,
      address: "Đường Đào Tấn",
      city: "Hà Nội",
      district: "Tây Hồ",
      propertyType: "Biệt thự",
      thumbnail: "",
      featured: true,
    },
    {
      title: "Căn hộ chung cư Goldmark City",
      slug: "can-ho-chung-cu-goldmark-city",
      listingType: "rent",
      description:
        "Căn hộ 3PN cho thuê tại Goldmark City, nội thất sang trọng, view Hồ Tây đẹp mê mẩn.",
      price: 2800000000,
      area: 95,
      bedrooms: 3,
      bathrooms: 2,
      address: "Đường Lê Văn Lương",
      city: "Hà Nội",
      district: "Thanh Xuân",
      propertyType: "Căn hộ",
      thumbnail: "",
      featured: false,
    },
    {
      title: "Căn hộ dịch vụ cho thuê Vạn Phúc",
      slug: "can-ho-dich-vu-cho-thue-van-phuc",
      listingType: "rent",
      description:
        "Căn hộ dịch vụ 100m2 tại khu đô thị Vạn Phúc, tiểu khu Westlake, đầy đủ nội thất, vào ở ngay.",
      price: 3200000000,
      area: 100,
      bedrooms: 0,
      bathrooms: 0,
      address: "Khu đô thị Vạn Phúc",
      city: "Hà Nội",
      district: "Hà Đông",
      propertyType: "Căn hộ",
      thumbnail: "",
      featured: false,
    },
    {
      title: "Shop mặt phố Vincom Bà Triệu",
      slug: "shop-mat-pho-vincom-ba-trieu",
      listingType: "sale",
      description:
        "Cửa hàng kinh doanh tại Vincom Bà Triệu, vị trí vàng, khách hàng đông.",
      price: 5000000000,
      area: 50,
      bedrooms: 0,
      bathrooms: 1,
      address: "Đường Bà Triệu",
      city: "Hà Nội",
      district: "Hoàn Kiếm",
      propertyType: "Shop",
      thumbnail: "",
      featured: false,
    },
    {
      title: "Căn hộ 2PN cho thuê tại Vinhomes Ocean Park",
      slug: "can-ho-2pn-cho-thue-vinhomes-ocean-park",
      listingType: "rent",
      description:
        "Căn hộ 2 phòng ngủ full nội thất, gần hồ, tiện ích đồng bộ, phù hợp gia đình trẻ.",
      price: 12000000,
      area: 67,
      bedrooms: 2,
      bathrooms: 2,
      address: "Khu đô thị Vinhomes Ocean Park",
      city: "Hà Nội",
      district: "Gia Lâm",
      propertyType: "Căn hộ",
      thumbnail: "",
      featured: true,
    },
  ],
  projects: [
    {
      name: "Dự án Landmark 81",
      slug: "du-an-landmark-81",
      investor: "Tập đoàn Vingroup",
      address: "Đường Nguyễn Hữu Cảnh, Bình Thạnh, TP HCM",
      description:
        "Dự án tòa nhà cao nhất Việt Nam với 81 tầng, chứa căn hộ, officetel, khách sạn 5 sao, trung tâm mua sắm.",
      thumbnail: "",
    },
    {
      name: "Dự án Goldmark City",
      slug: "du-an-goldmark-city",
      investor: "Tập đoàn Nippon Paint",
      address: "Đường Lê Văn Lương, Thanh Xuân, Hà Nội",
      description:
        "Dự án chung cư cao cấp với hơn 10,000 cư dân, tiện ích đầy đủ, view Hồ Tây.",
      thumbnail: "",
    },
    {
      name: "Dự án Vạn Phúc",
      slug: "du-an-van-phuc",
      investor: "Tập đoàn Khải Tâm",
      address: "Hà Đông, Hà Nội",
      description:
        "Dự án khu đô thị quy mô 100 ha, tiêu chuẩn sống quốc tế, gần gũi với thiên nhiên.",
      thumbnail: "",
    },
  ],
  articles: [
    {
      title: "Cách chọn dự án đầu tư thông minh năm 2026",
      slug: "cach-chon-du-an-dau-tu-thong-minh",
      excerpt:
        "Những tiêu chí cần biết khi chọn dự án bất động sản để đầu tư dài hạn với lợi nhuận cao.",
      content:
        "Khi đầu tư bất động sản, bạn cần xem xét vị trí, tiến độ, pháp lý rõ ràng, nhà đầu tư uy tín và tiềm năng tăng giá.",
      thumbnail: "",
    },
    {
      title: "Thị trường nhà đất 2026: Xu hướng mới",
      slug: "thi-truong-nha-dat-2026-xu-huong-moi",
      excerpt:
        "Đánh giá thị trường và dự báo giá ở những khu vực nổi bật Hà Nội, TP HCM, Đà Nẵng.",
      content:
        "Năm 2026, thị trường bất động sản dự kiến tiếp tục ổn định với sự quan tâm lớn từ nhà đầu tư. Khu vực trung tâm sẽ tiếp tục tăng giá.",
      thumbnail: "",
    },
  ],
  setting: {
    siteName: "Next Estate",
    logo: "/logo.png",
    hotline: "0935 278 703",
    email: "info@nextestate.vn",
    facebook: "https://facebook.com/nextestate",
    zalo: "0935278703",
    address: "Hà Nội, Việt Nam",
  },
};

async function main() {
  console.log("🌱 Seeding database...");

  try {
    const hashedPassword = await bcrypt.hash(seedData.admin.password, 10);
    await prisma.admin.upsert({
      where: { username: seedData.admin.username },
      update: { ...seedData.admin, password: hashedPassword },
      create: { ...seedData.admin, password: hashedPassword },
    });
    console.log("✓ Admin account synced");

    for (const property of seedData.properties) {
      await prisma.property.upsert({
        where: { slug: property.slug },
        update: {},
        create: property,
      });
    }
    console.log(`✓ ${seedData.properties.length} properties synced`);

    for (const project of seedData.projects) {
      await prisma.project.upsert({
        where: { slug: project.slug },
        update: {},
        create: project,
      });
    }
    console.log(`✓ ${seedData.projects.length} projects synced`);

    for (const article of seedData.articles) {
      await prisma.article.upsert({
        where: { slug: article.slug },
        update: {},
        create: article,
      });
    }
    console.log(`✓ ${seedData.articles.length} articles synced`);

    await prisma.setting.upsert({
      where: { id: 1 },
      update: {},
      create: seedData.setting,
    });
    console.log("✓ Settings synced");

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
