"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { NewsletterRegistrationItem } from "@/types/newsletter";
import { toast } from "@/providers/ToastProvider";

export const useNewsletterRegistrations = () => {
  const [registrations, setRegistrations] = useState<NewsletterRegistrationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRegistrations = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/api/db/newsletters/registrations");
      if (res.data?.success && Array.isArray(res.data.data)) {
        setRegistrations(res.data.data);
      }
    } catch (err: any) {
      console.error("Failed to load newsletter registrations from DB:", err);
      toast.error("Không thể tải danh sách đăng ký bản tin từ Database");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const updateRegistrationStatus = useCallback(
    async (id: string, status: string, note?: string) => {
      try {
        const res = await axios.put("/api/db/newsletters/registrations", { id, status, note });
        if (res.data?.success) {
          setRegistrations((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status, note: note !== undefined ? note : item.note } : item))
          );
          toast.success("Cập nhật trạng thái đơn thành công: " + status.toUpperCase());
        }
      } catch (err: any) {
        console.error("Failed to update newsletter registration status:", err);
        toast.error("Lỗi khi cập nhật trạng thái đơn đăng ký");
      }
    },
    []
  );

  const deleteRegistration = useCallback(async (id: string) => {
    try {
      const res = await axios.delete(`/api/db/newsletters/registrations?id=${id}`);
      if (res.data?.success) {
        setRegistrations((prev) => prev.filter((item) => item.id !== id));
        toast.success("Đã xóa đơn đăng ký bản tin khỏi Database.");
      }
    } catch (err: any) {
      console.error("Failed to delete newsletter registration:", err);
      const msg = err.response?.data?.error?.message || "Lỗi khi xóa đơn đăng ký";
      toast.error(msg);
    }
  }, []);

  return {
    registrations,
    isLoading,
    refreshRegistrations: fetchRegistrations,
    updateRegistrationStatus,
    deleteRegistration,
    stats: {
      total: registrations.length,
      pending: registrations.filter((r) => r.status === "pending").length,
      approved: registrations.filter((r) => r.status === "approved").length,
      rejected: registrations.filter((r) => r.status === "rejected").length,
    },
  };
};
