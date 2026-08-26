"use client";

import { useEffect, useState, useCallback } from "react";
import { CourseItem, CreateCourseItemPayload } from "@/types/course";
import { toast } from "@/providers/ToastProvider";

const STORAGE_KEY = "admin_courses_list_v3";

const INITIAL_COURSES: CourseItem[] = [
  {
    id: "course-1",
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
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "course-2",
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
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "course-3",
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
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "course-4",
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
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const useCoursesList = () => {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      localStorage.removeItem("admin_courses_list"); // Clear old corrupted cache
      localStorage.removeItem("admin_courses_list_v2");
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
