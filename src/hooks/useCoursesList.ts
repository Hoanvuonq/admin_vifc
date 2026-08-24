"use client";

import { useEffect, useState, useCallback } from "react";
import { CourseItem, CreateCourseItemPayload } from "@/types/course";
import { toast } from "@/providers/ToastProvider";

const STORAGE_KEY = "admin_courses_list_v2";

const INITIAL_COURSES: CourseItem[] = [
  {
    id: "course-1",
    title: "Chương Trình Đào Tạo Chiến Lược & Đầu Tư On-Chain",
    booking_type: "course",
    booking_title: "Khóa Học Chuyên Sâu On-Chainpass",
    description: "Khóa học cao cấp trang bị kỹ năng phân tích on-chain, định giá tài sản số và quản trị danh mục đầu tư tổ chức.",
    image: "/admin/card-banner-01.png",
    fallback_image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
    instructor: "Chuyên Gia On-Chainpass & Các Quỹ Đối Tác",
    duration: "4 tuần (8 buổi)",
    schedule: "Thứ 3 & Thứ 5 (19:30 - 21:30)",
    tuition_fee: 15000000,
    status: "active",
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "course-2",
    title: "Đặc Quyền Tiếp Cận & Sử Dụng VIP Lounge Thượng Đỉnh",
    booking_type: "lounge",
    booking_title: "Private VIP Lounge Access",
    description: "Không gian lounge sang trọng, đẳng cấp dành riêng cho thành viên gặp gỡ đối tác chiến lược và thư giãn cao cấp.",
    image: "/admin/card-banner-02.png",
    fallback_image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
    instructor: "On-Chainpass Concierge Service",
    duration: "24/7 Priority Booking",
    schedule: "Linh hoạt theo yêu cầu thành viên",
    tuition_fee: 0,
    status: "active",
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "course-3",
    title: "Phòng Họp & Hội Nghị Chiến Lược Tiêu Chuẩn 5 Sao",
    booking_type: "meeting-room",
    booking_title: "Phòng Họp Doanh Nghiệp Cấp Cao",
    description: "Hệ thống phòng họp bảo mật cao, trang bị màn hình tương tác và thiết bị hội nghị trực tuyến quốc tế.",
    image: "/admin/card-banner-03.png",
    fallback_image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
    instructor: "Ban Quản Lý On-Chainpass Hub",
    duration: "Theo giờ / Theo buổi",
    schedule: "Đặt lịch trước 24h",
    tuition_fee: 5000000,
    status: "active",
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "course-4",
    title: "Workshop Chuyên Đề: RWA & Token Hóa Tài Sản Doanh Nghiệp",
    booking_type: "workshop",
    booking_title: "Chuyên Đề RWA Tokenization",
    description: "Phiên thảo luận và thực hành cấu trúc pháp lý, kỹ thuật phát hành token tài sản thực (Real World Assets) cho doanh nghiệp.",
    image: "/admin/card-banner-04.png",
    fallback_image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80",
    instructor: "Tiến Sĩ Kinh Tế & Luật Sư Tài Chính",
    duration: "1 Ngày (Thứ Bảy)",
    schedule: "08:30 - 17:30 (Thứ 7 tuần thứ 3 mỗi tháng)",
    tuition_fee: 8000000,
    status: "active",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const useCoursesList = () => {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount with auto-migration
  useEffect(() => {
    try {
      localStorage.removeItem("admin_courses_list"); // Clear old corrupted cache
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && !stored.includes("?") && !stored.includes("Ð")) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCourses(parsed);
          setIsLoading(false);
          return;
        }
      }
      setCourses(INITIAL_COURSES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COURSES));
    } catch {
      setCourses(INITIAL_COURSES);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCourse = useCallback(async (payload: CreateCourseItemPayload) => {
    const newCourse: CourseItem = {
      id: "course-" + Date.now(),
      title: payload.title,
      booking_type: payload.booking_type || "course",
      booking_title: payload.booking_title || payload.title,
      description: payload.description || "",
      image: payload.image || "/admin/card-banner-01.png",
      fallback_image: payload.fallback_image || "",
      instructor: payload.instructor || "Chuyên Gia On-Chainpass",
      duration: payload.duration || "Linh hoạt",
      schedule: payload.schedule || "Liên hệ ban tổ chức",
      tuition_fee: payload.tuition_fee || 0,
      status: payload.status || "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setCourses((prev) => {
      const updated = [newCourse, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) { console.error(e); }
      return updated;
    });

    toast.success("Thêm khóa học / dịch vụ mới thành công!");
    return newCourse;
  }, []);

  const updateCourse = useCallback(async (id: string, payload: Partial<CreateCourseItemPayload>) => {
    setCourses((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...payload,
            updated_at: new Date().toISOString(),
          };
        }
        return item;
      });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) { console.error(e); }
      return updated;
    });

    toast.success("Cập nhật thông tin khóa học thành công!");
  }, []);

  const deleteCourse = useCallback(async (id: string) => {
    setCourses((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) { console.error(e); }
      return updated;
    });

    toast.success("Đã xóa khóa học thành công.");
  }, []);

  const toggleCourseStatus = useCallback(async (id: string) => {
    setCourses((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === "active" ? "inactive" : "active";
          return { ...item, status: nextStatus, updated_at: new Date().toISOString() };
        }
        return item;
      });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) { console.error(e); }
      return updated;
    });

    toast.info("Đã chuyển đổi trạng thái khóa học.");
  }, []);

  return {
    courses,
    isLoading,
    createCourse,
    updateCourse,
    deleteCourse,
    toggleCourseStatus,
    stats: {
      total: courses.length,
      active: courses.filter((c) => c.status === "active").length,
      inactive: courses.filter((c) => c.status !== "active").length,
    }
  };
};
