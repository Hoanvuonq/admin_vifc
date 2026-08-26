import pg from "pg";

const connectionString = process.env.DIRECT_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  console.error("❌ DIRECT_URL or POSTGRES_URL missing in .env");
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

const SEED_COURSES = [
  {
    booking_type: "meeting-room",
    booking_title: "Khóa học chuyên sâu — Ngành hàng hóa",
    title: "KHÓA HỌC CHUYÊN SÂU — NGÀNH HÀNG HÓA",
    description:
      "Dành cho doanh nghiệp xuất khẩu, nhà sản xuất và nhà giao dịch hàng hóa đang muốn thoát khỏi thế bị động — khi tài sản nằm trong kho nhưng dòng vốn vẫn phụ thuộc vào sàn nước ngoài và ngân hàng truyền thống. Hạ tầng on-chain đang mở ra cơ chế mới: lô hàng cà phê, gạo, hồ tiêu có thể được số hóa thành chứng từ có giá trị tài chính — xác thực độc lập, giao dịch được, và tiếp cận thẳng dòng vốn quốc tế mà không qua trung gian bảo lãnh.",
    image: "/admin/booking-01.png",
    fallback_image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=90",
    instructor: "Chuyên Gia On-Chainpass",
    duration: "4 tuần (8 buổi)",
    schedule: "Tối Thứ 3 & Thứ 5",
    tuition_fee: 15000000,
    status: "active",
    order_index: 1,
  },
  {
    booking_type: "lounge",
    booking_title: "Khóa học chuyên sâu — Ngành du lịch",
    title: "KHÓA HỌC CHUYÊN SÂU — NGÀNH DU LỊCH",
    description:
      "Dành cho doanh nghiệp phát triển bất động sản du lịch, chủ tài sản và nhà đầu tư đang bị kẹt giữa tài sản lớn và thanh khoản thấp — khi muốn huy động vốn quốc tế nhưng không có cấu trúc tài chính phù hợp. Hạ tầng on-chain cho phép phân nhỏ quyền sở hữu tài sản nghỉ dưỡng thành các đơn vị đầu tư có thể giao dịch — mở ra nhóm nhà đầu tư tổ chức quốc tế mà trước đây không thể tiếp cận do rào cản ticket size và pháp lý.",
    image: "/admin/booking-02.png",
    fallback_image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1000&q=90",
    instructor: "Chuyên Gia Tài Chính & RWA",
    duration: "4 tuần (8 buổi)",
    schedule: "Tối Thứ 2 & Thứ 4",
    tuition_fee: 18000000,
    status: "active",
    order_index: 2,
  },
  {
    booking_type: "course",
    booking_title: "Khóa Học Chuyên Sâu On-Chainpass",
    title: "Chương Trình Đào Tạo Chiến Lược & Đầu Tư On-Chain",
    description: "Khóa học cao cấp trang bị kỹ năng phân tích on-chain, định giá tài sản số và quản trị danh mục đầu tư tổ chức.",
    image: "/admin/card-banner-01.png",
    fallback_image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
    instructor: "Chuyên Gia On-Chainpass & Các Quỹ Đối Tác",
    duration: "4 tuần (8 buổi)",
    schedule: "Thứ 3 & Thứ 5 (19:30 - 21:30)",
    tuition_fee: 15000000,
    status: "active",
    order_index: 3,
  },
  {
    booking_type: "workshop",
    booking_title: "Chuyên Đề RWA Tokenization",
    title: "Workshop Chuyên Đề: RWA & Token Hóa Tài Sản Doanh Nghiệp",
    description: "Phiên thảo luận và thực hành cấu trúc pháp lý, kỹ thuật phát hành token tài sản thực (Real World Assets) cho doanh nghiệp.",
    image: "/admin/card-banner-04.png",
    fallback_image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80",
    instructor: "Tiến Sĩ Kinh Tế & Luật Sư Tài Chính",
    duration: "1 Ngày (Thứ Bảy)",
    schedule: "08:30 - 17:30 (Thứ 7 tuần thứ 3 mỗi tháng)",
    tuition_fee: 8000000,
    status: "active",
    order_index: 4,
  },
];

const SEED_EVENTS = [
  {
    title: "Recap các hoạt động tại SURF Đà nẵng",
    subtitle: "Tổng kết chuỗi hội thảo công nghệ tài chính và kết nối đầu tư tại SURF Đà Nẵng",
    location: "Da Nang Innovation Hub, TP. Đà Nẵng",
    date: "SUN 17 MAY 15:29",
    image: "/admin/card-event-01.png",
    badge: "SURF Recap",
    luma_url: "https://lu.ma/vifc-surf-danang",
    description: "Gặp gỡ hơn 500 nhà sáng lập, quỹ đầu tư công nghệ và chuyên gia Web3 hàng đầu Việt Nam.",
    status: "active",
    order_index: 1,
  },
  {
    title: "On-Chain RWA Summit 2026 — Gala Dinner & Investor Meetup",
    subtitle: "Tương lai số hóa tài sản thực và cơ hội tiếp cận dòng vốn quốc tế",
    location: "GEM Center, TP. Hồ Chí Minh",
    date: "14 - 15 August 2026 / 18:30 - 21:30",
    image: "/admin/card-event-01.png",
    badge: "VIP Exclusive",
    luma_url: "https://lu.ma/vifc-rwa-summit-2026",
    description: "Phiên hội nghị thượng đỉnh quy tụ các định chế tài chính, quỹ đầu tư mạo hiểm và doanh nghiệp tiên phong.",
    status: "active",
    order_index: 2,
  },
];

const SEED_EVENT_REGISTRATIONS = [
  {
    email: "hoang.nam.investor@gmail.com",
    full_name: "Nguyễn Hoàng Nam",
    phone: "0908123456",
    event_title: "On-Chain RWA Summit 2026 — Gala Dinner & Investor Meetup",
    event_date: "14 - 15 August 2026 / 18:30 - 21:30",
    location: "GEM Center, TP. Hồ Chí Minh",
    status: "confirmed",
    notes: "Đại diện Quỹ đầu tư mạo hiểm Lotus Capital",
  },
  {
    email: "tran.thanh.hang@vinaexport.vn",
    full_name: "Trần Thanh Hằng",
    phone: "0912345678",
    event_title: "Recap các hoạt động tại SURF Đà nẵng",
    event_date: "SUN 17 MAY 15:29",
    location: "Da Nang Innovation Hub, TP. Đà Nẵng",
    status: "pending",
    notes: "Đăng ký tham dự phiên thảo luận bàn tròn",
  },
];

const SEED_COURSE_REGISTRATIONS = [
  {
    full_name: "Lê Quốc Bảo",
    email: "bao.le@saigonassets.com",
    phone: "0987654321",
    booking_type: "meeting-room",
    booking_title: "Khóa học chuyên sâu — Ngành hàng hóa",
    title: "KHÓA HỌC CHUYÊN SÂU — NGÀNH HÀNG HÓA",
    tuition_fee: 15000000,
    status: "approved",
    notes: "Doanh nghiệp xuất khẩu cà phê Buôn Ma Thuột",
  },
  {
    full_name: "Phạm Minh Thư",
    email: "thu.pham@resortinvest.vn",
    phone: "0934567890",
    booking_type: "lounge",
    booking_title: "Khóa học chuyên sâu — Ngành du lịch",
    title: "KHÓA HỌC CHUYÊN SÂU — NGÀNH DU LỊCH",
    tuition_fee: 18000000,
    status: "pending",
    notes: "Muốn tìm hiểu cơ chế phân mảnh tài sản BĐS du lịch",
  },
];

const SEED_NEWSLETTER = [
  {
    email: "contact.ceo@techhub.vn",
    full_name: "Vũ Tuấn Anh",
    source: "dashboard",
    status: "subscribed",
  },
  {
    email: "partner@globalventure.sg",
    full_name: "David Tan",
    source: "landing",
    status: "subscribed",
  },
];

async function runSeed() {
  console.log("🌱 Bắt đầu nạp dữ liệu mẫu vào PostgreSQL...");
  const client = await pool.connect();

  try {
    // 1. Seed courses
    for (const c of SEED_COURSES) {
      await client.query(
        `INSERT INTO courses (title, booking_type, booking_title, description, image, fallback_image, instructor, duration, schedule, tuition_fee, status, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (booking_type) DO UPDATE SET
           title = EXCLUDED.title,
           booking_title = EXCLUDED.booking_title,
           description = EXCLUDED.description,
           image = EXCLUDED.image,
           fallback_image = EXCLUDED.fallback_image,
           instructor = EXCLUDED.instructor,
           duration = EXCLUDED.duration,
           schedule = EXCLUDED.schedule,
           tuition_fee = EXCLUDED.tuition_fee,
           status = EXCLUDED.status,
           order_index = EXCLUDED.order_index;`,
        [
          c.title,
          c.booking_type,
          c.booking_title,
          c.description,
          c.image,
          c.fallback_image,
          c.instructor,
          c.duration,
          c.schedule,
          c.tuition_fee,
          c.status,
          c.order_index,
        ]
      );
    }
    console.log("✅ Đã nạp thành công 4 khóa học vào bảng courses!");

    // 2. Seed events
    for (const e of SEED_EVENTS) {
      await client.query(
        `INSERT INTO events (title, subtitle, location, date, image, badge, luma_url, description, status, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT DO NOTHING;`,
        [
          e.title,
          e.subtitle,
          e.location,
          e.date,
          e.image,
          e.badge,
          e.luma_url,
          e.description,
          e.status,
          e.order_index,
        ]
      );
    }
    console.log("✅ Đã nạp thành công các sự kiện vào bảng events!");

    // 3. Seed event_registrations
    for (const er of SEED_EVENT_REGISTRATIONS) {
      await client.query(
        `INSERT INTO event_registrations (email, full_name, phone, event_title, event_date, location, status, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT DO NOTHING;`,
        [
          er.email,
          er.full_name,
          er.phone,
          er.event_title,
          er.event_date,
          er.location,
          er.status,
          er.notes,
        ]
      );
    }
    console.log("✅ Đã nạp thành công danh sách đăng ký sự kiện vào bảng event_registrations!");

    for (const cr of SEED_COURSE_REGISTRATIONS) {
      await client.query(
        `INSERT INTO course_registrations (full_name, email, phone, booking_type, booking_title, tuition_fee, status, note)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT DO NOTHING;`,
        [
          cr.full_name,
          cr.email,
          cr.phone,
          cr.booking_type,
          cr.booking_title,
          cr.tuition_fee,
          cr.status,
          cr.notes,
        ]
      );
    }
    console.log("✅ Đã nạp thành công danh sách học viên vào bảng course_registrations!");

    for (const n of SEED_NEWSLETTER) {
      await client.query(
        `INSERT INTO newsletter_subscriptions (email, full_name, source, status)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email) DO NOTHING;`,
        [n.email, n.full_name, n.source, n.status]
      );
    }
    console.log("✅ Đã nạp thành công danh sách email vào bảng newsletter_subscriptions!");
  } catch (err) {
    console.error("❌ Lỗi khi nạp dữ liệu:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

runSeed();
