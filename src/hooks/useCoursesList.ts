"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { CourseItem, CreateCourseItemPayload } from "@/types/course";
import { toast } from "@/providers/ToastProvider";

export const useCoursesList = () => {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/api/db/courses");
      if (res.data?.success && Array.isArray(res.data.data)) {
        setCourses(res.data.data);
      }
    } catch (err: any) {
      console.error("Failed to load courses from DB:", err);
      toast.error("Không thể tải danh sách khóa học từ Database");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const createCourse = useCallback(
    async (payload: CreateCourseItemPayload) => {
      try {
        const res = await axios.post("/api/db/courses", payload);
        if (res.data?.success && res.data.data) {
          const newCourse = res.data.data;
          setCourses((prev) => [newCourse, ...prev.filter((c) => c.booking_type !== newCourse.booking_type)]);
          toast.success("Thêm khóa học / dịch vụ vào Database thành công!");
          return newCourse;
        }
      } catch (err: any) {
        console.error("Failed to create course in DB:", err);
        const msg = err.response?.data?.error?.message || "Lỗi khi lưu khóa học vào Database";
        toast.error(msg);
        throw err;
      }
    },
    []
  );

  const updateCourse = useCallback(
    async (id: string, payload: Partial<CreateCourseItemPayload>) => {
      try {
        const res = await axios.put("/api/db/courses", { id, ...payload });
        if (res.data?.success && res.data.data) {
          const updatedCourse = res.data.data;
          setCourses((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...updatedCourse } : item))
          );
          toast.success("Cập nhật thông tin khóa học thành công!");
        }
      } catch (err: any) {
        console.error("Failed to update course in DB:", err);
        const msg = err.response?.data?.error?.message || "Lỗi khi cập nhật khóa học";
        toast.error(msg);
        throw err;
      }
    },
    []
  );

  const deleteCourse = useCallback(
    async (id: string) => {
      try {
        const res = await axios.delete(`/api/db/courses?id=${id}`);
        if (res.data?.success) {
          setCourses((prev) => prev.filter((item) => item.id !== id));
          toast.success("Đã xóa khóa học khỏi Database.");
        }
      } catch (err: any) {
        console.error("Failed to delete course in DB:", err);
        const msg = err.response?.data?.error?.message || "Lỗi khi xóa khóa học";
        toast.error(msg);
        throw err;
      }
    },
    []
  );

  const toggleCourseStatus = useCallback(
    async (id: string) => {
      const target = courses.find((c) => c.id === id);
      if (!target) return;
      const nextStatus = target.status === "active" ? "inactive" : "active";

      try {
        const res = await axios.put("/api/db/courses", { id, status: nextStatus });
        if (res.data?.success) {
          setCourses((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
          );
          toast.info(
            `Đã chuyển trạng thái khóa học sang ${nextStatus === "active" ? "ĐANG MỞ" : "TẠM ẨN"}.`
          );
        }
      } catch (err: any) {
        console.error("Failed to toggle course status in DB:", err);
        toast.error("Lỗi khi chuyển đổi trạng thái khóa học");
      }
    },
    [courses]
  );

  return {
    courses,
    isLoading,
    refreshCourses: fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    toggleCourseStatus,
    stats: {
      total: courses.length,
      active: courses.filter((c) => c.status === "active").length,
      inactive: courses.filter((c) => c.status !== "active").length,
    },
  };
};
