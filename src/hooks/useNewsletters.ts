"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { NewsletterItem, CreateNewsletterPayload } from "@/types/newsletter";
import { toast } from "@/providers/ToastProvider";

export const useNewsletters = () => {
  const [newsletters, setNewsletters] = useState<NewsletterItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNewsletters = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/api/db/newsletters");
      if (res.data?.success && Array.isArray(res.data.data)) {
        setNewsletters(res.data.data);
      }
    } catch (err: any) {
      console.error("Failed to load newsletters from DB:", err);
      toast.error("Không thể tải danh sách bản tin từ Database");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewsletters();
  }, [fetchNewsletters]);

  const createNewsletter = useCallback(
    async (payload: CreateNewsletterPayload) => {
      try {
        const res = await axios.post("/api/db/newsletters", payload);
        if (res.data?.success && res.data.data) {
          const newItem = res.data.data;
          setNewsletters((prev) => [newItem, ...prev]);
          toast.success("Khởi tạo ấn phẩm bản tin mới vào Database thành công!");
          return newItem;
        }
      } catch (err: any) {
        console.error("Failed to create newsletter in DB:", err);
        const msg = err.response?.data?.error?.message || "Lỗi khi tạo bản tin vào Database";
        toast.error(msg);
        throw err;
      }
    },
    []
  );

  const updateNewsletter = useCallback(
    async (id: string, payload: Partial<CreateNewsletterPayload>) => {
      try {
        const res = await axios.put("/api/db/newsletters", { id, ...payload });
        if (res.data?.success && res.data.data) {
          const updatedItem = res.data.data;
          setNewsletters((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...updatedItem } : item))
          );
          toast.success("Cập nhật thông tin bản tin thành công!");
          return updatedItem;
        }
      } catch (err: any) {
        console.error("Failed to update newsletter in DB:", err);
        const msg = err.response?.data?.error?.message || "Lỗi khi cập nhật bản tin";
        toast.error(msg);
        throw err;
      }
    },
    []
  );

  const deleteNewsletter = useCallback(
    async (id: string) => {
      try {
        const res = await axios.delete(`/api/db/newsletters?id=${id}`);
        if (res.data?.success) {
          setNewsletters((prev) => prev.filter((item) => item.id !== id));
          toast.success("Đã xóa bản tin khỏi Database.");
        }
      } catch (err: any) {
        console.error("Failed to delete newsletter in DB:", err);
        const msg = err.response?.data?.error?.message || "Lỗi khi xóa bản tin";
        toast.error(msg);
        throw err;
      }
    },
    []
  );

  const toggleNewsletterStatus = useCallback(
    async (id: string) => {
      const target = newsletters.find((n) => n.id === id);
      if (!target) return;
      const nextStatus = target.status === "active" ? "inactive" : "active";

      try {
        const res = await axios.put("/api/db/newsletters", { id, status: nextStatus });
        if (res.data?.success) {
          setNewsletters((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
          );
          toast.info(
            `Đã chuyển trạng thái bản tin sang ${
              nextStatus === "active" ? "ĐANG PHÁT HÀNH" : "TẠM ẨN"
            }.`
          );
        }
      } catch (err: any) {
        console.error("Failed to toggle newsletter status in DB:", err);
        toast.error("Lỗi khi chuyển đổi trạng thái bản tin");
      }
    },
    [newsletters]
  );

  return {
    newsletters,
    isLoading,
    refreshNewsletters: fetchNewsletters,
    createNewsletter,
    updateNewsletter,
    deleteNewsletter,
    toggleNewsletterStatus,
    stats: {
      total: newsletters.length,
      active: newsletters.filter((n) => n.status === "active").length,
      draft: newsletters.filter((n) => n.status === "draft").length,
      inactive: newsletters.filter((n) => n.status === "inactive").length,
    },
  };
};
