"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { EventRegistrationItem } from "@/types/event";
import { toast } from "@/providers/ToastProvider";

export const useEventRegistrations = () => {
  const [registrations, setRegistrations] = useState<EventRegistrationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRegistrations = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/api/db/events/registrations");
      if (res.data?.success && Array.isArray(res.data.data)) {
        setRegistrations(res.data.data);
      }
    } catch (err: any) {
      console.error("Failed to load event registrations from DB:", err);
      toast.error("Không thể tải danh sách đăng ký sự kiện từ Database");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const updateRegistrationStatus = useCallback(
    async (id: string, status: EventRegistrationItem["status"]) => {
      try {
        const res = await axios.put("/api/db/events/registrations", { id, status });
        if (res.data?.success) {
          setRegistrations((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status } : item))
          );
          toast.success("Đã cập nhật trạng thái đơn thành: " + status.toUpperCase());
        }
      } catch (err: any) {
        console.error("Failed to update registration status in DB:", err);
        toast.error("Lỗi khi cập nhật trạng thái đơn đăng ký");
      }
    },
    []
  );

  const deleteRegistration = useCallback(async (id: string) => {
    try {
      const res = await axios.delete(`/api/db/events/registrations?id=${id}`);
      if (res.data?.success) {
        setRegistrations((prev) => prev.filter((item) => item.id !== id));
        toast.success("Đã xóa đơn đăng ký sự kiện khỏi Database.");
      }
    } catch (err: any) {
      console.error("Failed to delete registration in DB:", err);
      toast.error("Lỗi khi xóa đơn đăng ký sự kiện");
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
      confirmed: registrations.filter((r) => r.status === "confirmed").length,
    },
  };
};
