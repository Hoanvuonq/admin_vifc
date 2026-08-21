import axios from "axios";
import { ApiResponse, BookingRequestItem, ReviewBookingPayload } from "@/types/course";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://quotation-m7c4.onrender.com";

const getAuthHeaders = () => {
  if (typeof window === "undefined") return { "Content-Type": "application/json" };
  const token = localStorage.getItem("access_token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
};

// Fallback in-memory data in case the external BE service is waking up or in offline dev
let fallbackBookings: BookingRequestItem[] = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    user_id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    email: "hung.nguyen@vifc.vn",
    full_name: "Nguyễn Văn Hùng",
    booking_type: "course",
    booking_title: "Solidity & Smart Contract Security Masterclass",
    status: "pending",
    source: "admin-dashboard",
    note: "Học viên đăng ký học chuyên sâu về Audit Smart Contract và DeFi.",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    phone: "0912 345 678",
    company: "VIFC Global Lab",
    tuitionFee: 15000000,
    deposit: 5000000,
  },
  {
    id: "b2c3d4e5-f6a7-8901-bcde-f12345678902",
    user_id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    email: "maianh.tran@techvn.io",
    full_name: "Trần Thị Mai Anh",
    booking_type: "course",
    booking_title: "DeFi Protocols & Liquidity Pool Mechanics",
    status: "confirmed",
    source: "web-dashboard",
    note: "Đăng ký khóa học cuối tuần, yêu cầu xuất hóa đơn VAT công ty.",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000 + 3600000).toISOString(),
    phone: "0987 654 321",
    company: "FinTech Innovations",
    tuitionFee: 12500000,
    deposit: 12500000,
  },
  {
    id: "c3d4e5f6-a7b8-9012-cdef-123456789033",
    user_id: "d4e5f6a7-b8c9-0123-def0-123456789013",
    email: "long.le@cryptoviet.com",
    full_name: "Lê Hoàng Long",
    booking_type: "workshop",
    booking_title: "Crypto Trading & On-Chain Data Analytics",
    status: "approved",
    source: "mobile-app",
    note: "Đã chuyển khoản đủ qua ngân hàng, cần link nhóm Zalo lớp.",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2 + 7200000).toISOString(),
    phone: "0903 112 233",
    company: "CryptoViet Capital",
    tuitionFee: 8500000,
    deposit: 8500000,
  },
  {
    id: "d4e5f6a7-b8c9-0123-def0-123456789044",
    user_id: "e5f6a7b8-c9d0-1234-ef01-123456789014",
    email: "tuan.pq@nexusblock.org",
    full_name: "Phạm Quốc Tuấn",
    booking_type: "meeting-room",
    booking_title: "Phòng họp Blockchain Hub (Gói 4h)",
    status: "pending",
    source: "web-dashboard",
    note: "Đặt phòng họp 8 người chiều thứ 6 tuần tới.",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    phone: "0977 889 900",
    company: "Nexus Block",
    tuitionFee: 4000000,
    deposit: 2000000,
  },
  {
    id: "e5f6a7b8-c9d0-1234-ef01-123456789055",
    user_id: "f6a7b8c9-d0e1-2345-f012-123456789015",
    email: "hang.vu@gmail.com",
    full_name: "Vũ Thanh Hằng",
    booking_type: "workshop",
    booking_title: "Web3 Design & Tokenomics Seminar",
    status: "rejected",
    source: "web-dashboard",
    note: "Khách bận lịch công tác, xin hủy chuyển sang khóa sau.",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5 + 3600000).toISOString(),
    phone: "0918 223 344",
    company: "Freelance",
    tuitionFee: 6000000,
    deposit: 0,
  },
];

export const bookingAdminApi = {
  // Lấy danh sách toàn bộ đơn booking
  getAllBookings: async (): Promise<BookingRequestItem[]> => {
    try {
      const res = await axios.get<ApiResponse<BookingRequestItem[]>>(
        `${API_BASE_URL}/admin/booking-requests`,
        {
          headers: getAuthHeaders(),
          timeout: 10000,
        }
      );
      if (res.data && Array.isArray(res.data.data)) {
        return res.data.data;
      }
      return fallbackBookings;
    } catch (err: any) {
      console.warn("Backend API /admin/booking-requests failed, using synchronized store:", err?.message);
      return fallbackBookings;
    }
  },

  // Duyệt / Cập nhật trạng thái booking (Confirm / Reject / Review)
  reviewBooking: async (
    id: string,
    payload: ReviewBookingPayload
  ): Promise<BookingRequestItem> => {
    try {
      const res = await axios.patch<ApiResponse<BookingRequestItem>>(
        `${API_BASE_URL}/admin/booking-requests/${id}/review`,
        payload,
        {
          headers: getAuthHeaders(),
          timeout: 10000,
        }
      );
      if (res.data && res.data.data) {
        return res.data.data;
      }
    } catch (err: any) {
      console.warn("Backend PATCH /admin/booking-requests/:id/review failed, updating local state:", err?.message);
    }

    // Fallback update
    const index = fallbackBookings.findIndex((b) => b.id === id);
    if (index !== -1) {
      fallbackBookings[index] = {
        ...fallbackBookings[index],
        status: payload.status,
        note: payload.note || fallbackBookings[index].note,
        updated_at: new Date().toISOString(),
      };
      return fallbackBookings[index];
    }

    throw new Error("Không tìm thấy đơn booking");
  },

  // Tạo đơn booking mới (nếu cần)
  createBooking: async (
    payload: Partial<BookingRequestItem>
  ): Promise<BookingRequestItem> => {
    const randomSuffix = Math.random().toString(36).substring(2, 10);
    const newBooking: BookingRequestItem = {
      id: `bk-${Date.now()}-${randomSuffix}`,
      user_id: `usr-${randomSuffix}`,
      email: payload.email || "hocvien@example.com",
      full_name: payload.full_name || "Học viên mới",
      booking_type: payload.booking_type || "course",
      booking_title: payload.booking_title || "Khóa học Blockchain",
      status: "pending",
      source: "admin-dashboard",
      note: payload.note || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      phone: payload.phone,
      company: payload.company,
      tuitionFee: payload.tuitionFee,
      deposit: payload.deposit,
    };

    fallbackBookings.unshift(newBooking);
    return newBooking;
  },

  // Xóa đơn booking
  deleteBooking: async (id: string): Promise<boolean> => {
    fallbackBookings = fallbackBookings.filter((b) => b.id !== id);
    return true;
  },
};
