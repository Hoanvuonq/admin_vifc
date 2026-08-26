"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { EventItem, CreateEventPayload } from "@/types/event";
import { toast } from "@/providers/ToastProvider";

export const useEvents = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/api/db/events");
      if (res.data?.success && Array.isArray(res.data.data)) {
        setEvents(res.data.data);
      }
    } catch (err: any) {
      console.error("Failed to load events from DB:", err);
      toast.error("Không thể tải danh sách sự kiện từ Database");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const createEvent = useCallback(
    async (payload: CreateEventPayload) => {
      try {
        const res = await axios.post("/api/db/events", payload);
        if (res.data?.success && res.data.data) {
          const newEvent = res.data.data;
          setEvents((prev) => [newEvent, ...prev]);
          toast.success("Đã tạo sự kiện mới vào Database thành công!");
          return newEvent;
        }
      } catch (err: any) {
        console.error("Failed to create event in DB:", err);
        const msg = err.response?.data?.error?.message || "Lỗi khi lưu sự kiện vào Database";
        toast.error(msg);
        throw err;
      }
    },
    []
  );

  const updateEvent = useCallback(
    async (id: string, payload: Partial<CreateEventPayload>) => {
      try {
        const res = await axios.put("/api/db/events", { id, ...payload });
        if (res.data?.success && res.data.data) {
          const updatedEvent = res.data.data;
          setEvents((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...updatedEvent } : item))
          );
          toast.success("Cập nhật thông tin sự kiện thành công!");
        }
      } catch (err: any) {
        console.error("Failed to update event in DB:", err);
        const msg = err.response?.data?.error?.message || "Lỗi khi cập nhật sự kiện";
        toast.error(msg);
        throw err;
      }
    },
    []
  );

  const deleteEvent = useCallback(
    async (id: string) => {
      try {
        const res = await axios.delete(`/api/db/events?id=${id}`);
        if (res.data?.success) {
          setEvents((prev) => prev.filter((item) => item.id !== id));
          toast.success("Đã xóa sự kiện khỏi Database.");
        }
      } catch (err: any) {
        console.error("Failed to delete event in DB:", err);
        const msg = err.response?.data?.error?.message || "Lỗi khi xóa sự kiện";
        toast.error(msg);
        throw err;
      }
    },
    []
  );

  const toggleEventStatus = useCallback(
    async (id: string) => {
      const target = events.find((e) => e.id === id);
      if (!target) return;
      const nextStatus = target.status === "active" ? "inactive" : "active";

      try {
        const res = await axios.put("/api/db/events", { id, status: nextStatus });
        if (res.data?.success) {
          setEvents((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
          );
          toast.info(
            `Đã chuyển trạng thái sự kiện sang ${nextStatus === "active" ? "ĐANG MỞ" : "TẠM ẨN"}.`
          );
        }
      } catch (err: any) {
        console.error("Failed to toggle event status in DB:", err);
        toast.error("Lỗi khi chuyển đổi trạng thái sự kiện");
      }
    },
    [events]
  );

  return {
    events,
    isLoading,
    refreshEvents: fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    toggleEventStatus,
    stats: {
      total: events.length,
      active: events.filter((e) => e.status === "active").length,
      upcoming: events.filter((e) => e.status === "upcoming").length,
      inactive: events.filter((e) => e.status === "inactive").length,
      hasLuma: events.filter((e) => Boolean(e.luma_url)).length,
    },
  };
};
