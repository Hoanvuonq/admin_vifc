import axios from "axios";
import {
  ApiResponse,
  BookingRequestItem,
  CreateBookingPayload,
  ReviewBookingPayload,
} from "@/types/course";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "";

const getAuthHeaders = () => {
  if (typeof window === "undefined") return { "Content-Type": "application/json" };
  const token = localStorage.getItem("access_token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
};

export const bookingAdminApi = {
  // 1. Lấy danh sách toàn bộ đơn đăng ký (Có phân trang, search, lọc status & bookingType)
  getAllBookings: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    bookingType?: string;
    search?: string;
  }): Promise<{
    items: BookingRequestItem[];
    total: number;
    totalPages: number;
    stats?: any;
  }> => {
    try {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set("page", params.page.toString());
      if (params?.limit) searchParams.set("limit", params.limit.toString());
      if (params?.status && params.status !== "ALL") searchParams.set("status", params.status);
      if (params?.bookingType && params.bookingType !== "ALL") searchParams.set("bookingType", params.bookingType);
      if (params?.search) searchParams.set("search", params.search);

      const url = `/api/db/courses/registrations?${searchParams.toString()}`;
      const res = await axios.get<ApiResponse<BookingRequestItem[]>>(url, {
        headers: getAuthHeaders(),
        timeout: 10000,
      });

      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        return {
          items: res.data.data,
          total: res.data.meta?.pagination?.total ?? res.data.data.length,
          totalPages: res.data.meta?.pagination?.totalPages ?? 1,
          stats: res.data.meta?.stats,
        };
      }

      return { items: [], total: 0, totalPages: 1 };
    } catch (err: any) {
      console.warn("API /api/db/courses/registrations failed:", err?.message);
      return { items: [], total: 0, totalPages: 1 };
    }
  },

  // 2. Lấy chi tiết 1 đơn
  getBookingById: async (id: string): Promise<BookingRequestItem | null> => {
    try {
      const res = await axios.get<ApiResponse<BookingRequestItem>>(
        `/api/db/courses/registrations/${id}`,
        {
          headers: getAuthHeaders(),
          timeout: 10000,
        }
      );
      if (res.data && res.data.success) {
        return res.data.data;
      }
      return null;
    } catch (err: any) {
      console.warn(`API /api/db/courses/registrations/${id} failed:`, err?.message);
      return null;
    }
  },

  // 3. Duyệt / Cập nhật trạng thái đơn (Confirm / Approve / Reject)
  reviewBooking: async (
    id: string,
    payload: ReviewBookingPayload
  ): Promise<BookingRequestItem> => {
    const res = await axios.patch<ApiResponse<BookingRequestItem>>(
      `/api/db/courses/registrations/${id}`,
      payload,
      {
        headers: getAuthHeaders(),
        timeout: 10000,
      }
    );
    if (res.data && res.data.success && res.data.data) {
      return res.data.data;
    }
    throw new Error(res.data?.error?.message || "Cập nhật trạng thái thất bại");
  },

  // 4. Tạo mới đơn đăng ký
  createBooking: async (
    payload: Partial<CreateBookingPayload>
  ): Promise<BookingRequestItem> => {
    const res = await axios.post<ApiResponse<BookingRequestItem>>(
      "/api/db/courses/registrations",
      payload,
      {
        headers: getAuthHeaders(),
        timeout: 10000,
      }
    );
    if (res.data && res.data.success && res.data.data) {
      return res.data.data;
    }
    throw new Error(res.data?.error?.message || "Tạo đơn đăng ký thất bại");
  },

  // 5. Xóa đơn đăng ký
  deleteBooking: async (id: string): Promise<boolean> => {
    const res = await axios.delete<ApiResponse<null>>(
      `/api/db/courses/registrations/${id}`,
      {
        headers: getAuthHeaders(),
        timeout: 10000,
      }
    );
    return !!res.data?.success;
  },
};

// Export alias for courseApi
export const courseApi = bookingAdminApi;
