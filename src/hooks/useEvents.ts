"use client";

import { useEffect, useState, useCallback } from "react";
import { EventItem, CreateEventPayload } from "@/types/event";
import { toast } from "@/providers/ToastProvider";

const STORAGE_KEY = "admin_events_list_v2";

const INITIAL_EVENTS: EventItem[] = [
  {
    id: "event-1",
    title: "Conviction 2026 — Global Web3 & On-Chain Summit",
    subtitle: "Welcome to Conviction 2026",
    location: "HCMC, Viet Nam",
    date: "14 - 15 August 2026",
    image: "/admin/card-event-01.png",
    badge: "Private Club Exclusive",
    luma_url: "https://lu.ma/conviction-2026",
    description: "Hội nghị thượng đỉnh quy tụ các quỹ đầu tư mạo hiểm hàng đầu, nhà sáng lập Web3 và các đối tác tài chính quốc tế. Thành viên On-Chainpass Private Club được dành riêng vị trí VIP tại khán phòng chính, vé mời tham dự tiệc tối Private VIP Dinner và quyền tiếp cận hệ sinh thái đối tác chiến lược.",
    status: "active",
    order_index: 1,
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "event-2",
    title: "CEO Summit Seoul 2026 — Capital & Innovation",
    subtitle: "CEO Summit",
    location: "Seoul, Korea",
    date: "28 - 29 October 2026",
    image: "/admin/card-event-02.png",
    badge: "Global Executive",
    luma_url: "https://lu.ma/ceo-summit-seoul",
    description: "Diễn đàn cấp cao kết nối các nhà hoạch định chiến lược, CEO tập đoàn công nghệ và định chế tài chính tại Seoul. Thảo luận chuyên sâu về cấu trúc vốn xuyên biên giới, giải pháp thanh khoản On-Chain và chiến lược mở rộng thị trường Đông Á.",
    status: "active",
    order_index: 2,
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "event-3",
    title: "The St. Regis Doha — Institutional Capital Roundtable",
    subtitle: "Private Roundtable",
    location: "Doha, Qatar",
    date: "12 November 2026",
    image: "/admin/private/private-03.png",
    badge: "Private Roundtable",
    luma_url: "https://lu.ma/st-regis-doha",
    description: "Phiên thảo luận bàn tròn giới hạn tại The St. Regis Doha dành riêng cho các quỹ gia đình (Family Offices) và nhà đầu tư tổ chức Trung Đông. Khám phá các mô hình token hóa tài sản thực (RWA) và cơ chế dịch chuyển dòng vốn quốc tế.",
    status: "active",
    order_index: 3,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "event-4",
    title: "Global Founders & Investors Gala 2026",
    subtitle: "Annual VIP Gala",
    location: "Singapore",
    date: "20 December 2026",
    image: "/admin/private/private-04.png",
    badge: "VIP Gala",
    luma_url: "https://lu.ma/founders-investors-gala",
    description: "Dạ tiệc thượng đỉnh cuối năm vinh danh những bước tiến đổi mới sáng tạo trong hạ tầng On-Chain. Đêm hội tụ hơn 200 đối tác chiến lược, quỹ đầu tư và thành viên On-Chainpass trong không gian sang trọng bậc nhất Singapore.",
    status: "active",
    order_index: 4,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const useEvents = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      localStorage.removeItem("admin_events_list"); // Clear old corrupted cache
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && !stored.includes("?") && !stored.includes("Ð")) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEvents(parsed);
          setIsLoading(false);
          return;
        }
      }
      setEvents(INITIAL_EVENTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
    } catch {
      setEvents(INITIAL_EVENTS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (payload: CreateEventPayload) => {
    const newEvent: EventItem = {
      id: "event-" + Date.now(),
      title: payload.title,
      subtitle: payload.subtitle || "",
      location: payload.location || "Online / TBD",
      date: payload.date || "Sắp diễn ra",
      image: payload.image || "/admin/card-event-01.png",
      badge: payload.badge || "Private Club",
      luma_url: payload.luma_url || "",
      description: payload.description || "",
      status: (payload.status as EventItem["status"]) || "active",
      order_index: events.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setEvents((prev) => {
      const updated = [newEvent, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) { console.error(e); }
      return updated;
    });

    toast.success("Tạo sự kiện mới thành công!");
    return newEvent;
  }, [events.length]);

  const updateEvent = useCallback(async (id: string, payload: Partial<CreateEventPayload>) => {
    setEvents((prev) => {
      const updated: EventItem[] = prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...payload,
            status: (payload.status ? (payload.status as EventItem["status"]) : item.status),
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

    toast.success("Cập nhật thông tin sự kiện thành công!");
  }, []);

  const deleteEvent = useCallback(async (id: string) => {
    setEvents((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) { console.error(e); }
      return updated;
    });

    toast.success("Đã xóa sự kiện thành công.");
  }, []);

  const toggleEventStatus = useCallback(async (id: string) => {
    setEvents((prev) => {
      const updated: EventItem[] = prev.map((item) => {
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

    toast.info("Đã thay đổi trạng thái sự kiện.");
  }, []);

  return {
    events,
    isLoading,
    createEvent,
    updateEvent,
    deleteEvent,
    toggleEventStatus,
    stats: {
      total: events.length,
      active: events.filter((e) => e.status === "active").length,
      hasLuma: events.filter((e) => Boolean(e.luma_url)).length,
    }
  };
};
