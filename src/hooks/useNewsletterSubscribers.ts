"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { NewsletterSubscriberItem } from "@/types/newsletter";
import { toast } from "@/providers/ToastProvider";

export const useNewsletterSubscribers = () => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriberItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscribers = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/api/db/newsletters/subscribers");
      if (res.data?.success && Array.isArray(res.data.data)) {
        setSubscribers(res.data.data);
      }
    } catch (err: any) {
      console.error("Failed to load subscribers from DB:", err);
      toast.error("Không thể tải danh sách subscriber từ Database");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const toggleSubscriberStatus = useCallback(
    async (id: string) => {
      const target = subscribers.find((s) => s.id === id);
      if (!target) return;
      const nextStatus = target.status === "subscribed" ? "unsubscribed" : "subscribed";

      try {
        const res = await axios.put("/api/db/newsletters/subscribers", { id, status: nextStatus });
        if (res.data?.success) {
          setSubscribers((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
          );
          toast.info(
            `Đã chuyển trạng thái subscriber sang ${
              nextStatus === "subscribed" ? "ĐANG NHẬN TIN" : "ĐÃ HỦY"
            }.`
          );
        }
      } catch (err: any) {
        console.error("Failed to toggle subscriber status:", err);
        toast.error("Lỗi khi cập nhật trạng thái subscriber");
      }
    },
    [subscribers]
  );

  const deleteSubscriber = useCallback(
    async (id: string) => {
      try {
        const res = await axios.delete(`/api/db/newsletters/subscribers?id=${id}`);
        if (res.data?.success) {
          setSubscribers((prev) => prev.filter((item) => item.id !== id));
          toast.success("Đã xóa subscriber khỏi Database.");
        }
      } catch (err: any) {
        console.error("Failed to delete subscriber:", err);
        const msg = err.response?.data?.error?.message || "Lỗi khi xóa subscriber";
        toast.error(msg);
      }
    },
    []
  );

  const addSubscriber = useCallback(
    async (email: string, fullName?: string, source?: string) => {
      try {
        const res = await axios.post("/api/db/newsletters/subscribers", {
          email,
          full_name: fullName,
          source: source || "Admin Manual",
          status: "subscribed",
        });
        if (res.data?.success && res.data.data) {
          const newSub = res.data.data;
          setSubscribers((prev) => {
            const exists = prev.some((s) => s.id === newSub.id || s.email === newSub.email);
            if (exists) {
              return prev.map((s) => (s.email === newSub.email ? newSub : s));
            }
            return [newSub, ...prev];
          });
          toast.success("Thêm email nhận bản tin thành công!");
          return newSub;
        }
      } catch (err: any) {
        console.error("Failed to add subscriber:", err);
        const msg = err.response?.data?.error?.message || "Lỗi khi thêm subscriber vào Database";
        toast.error(msg);
        throw err;
      }
    },
    []
  );

  return {
    subscribers,
    isLoading,
    refreshSubscribers: fetchSubscribers,
    toggleSubscriberStatus,
    deleteSubscriber,
    addSubscriber,
    stats: {
      total: subscribers.length,
      subscribed: subscribers.filter((s) => s.status === "subscribed").length,
      unsubscribed: subscribers.filter((s) => s.status === "unsubscribed").length,
    },
  };
};
