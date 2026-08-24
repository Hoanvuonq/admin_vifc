"use client";

import { useEffect, useState, useCallback } from "react";
import { EventRegistrationItem } from "@/types/event";
import { toast } from "@/providers/ToastProvider";

const STORAGE_KEY = "admin_event_registrations_v2";

const INITIAL_REGISTRATIONS: EventRegistrationItem[] = [
  {
    id: "reg-1",
    email: "nguyen.hoanganh@capital.vn",
    full_name: "Nguyễn Hoàng Anh",
    phone: "0912 345 678",
    event_id: "event-1",
    event_title: "Conviction 2026 — Global Web3 & On-Chain Summit",
    event_date: "14 - 15 August 2026",
    location: "HCMC, Viet Nam",
    status: "confirmed",
    notes: "Đăng ký tham gia tiệc VIP Dinner",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "reg-2",
    email: "tranducminh@vng.com",
    full_name: "Trần Đức Minh",
    phone: "0988 776 554",
    event_id: "event-2",
    event_title: "CEO Summit Seoul 2026 — Capital & Innovation",
    event_date: "28 - 29 October 2026",
    location: "Seoul, Korea",
    status: "pending",
    notes: "Cần hỗ trợ thư mời Visa",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "reg-3",
    email: "le.quang.huy@fintech.sg",
    full_name: "Lê Quang Huy",
    phone: "+65 8123 4567",
    event_id: "event-3",
    event_title: "The St. Regis Doha — Institutional Capital Roundtable",
    event_date: "12 November 2026",
    location: "Doha, Qatar",
    status: "confirmed",
    notes: "Đại diện Family Office Singapore",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "reg-4",
    email: "pham.thanh.hang@invest.com",
    full_name: "Phạm Thanh Hằng",
    phone: "0903 112 233",
    event_id: "event-4",
    event_title: "Global Founders & Investors Gala 2026",
    event_date: "20 December 2026",
    location: "Singapore",
    status: "pending",
    notes: "Yêu cầu bàn VIP 4 người",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const useEventRegistrations = () => {
  const [registrations, setRegistrations] = useState<EventRegistrationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      localStorage.removeItem("admin_event_registrations"); // Clear old corrupted cache
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && !stored.includes("?") && !stored.includes("Ð")) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRegistrations(parsed);
          setIsLoading(false);
          return;
        }
      }
      setRegistrations(INITIAL_REGISTRATIONS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REGISTRATIONS));
    } catch {
      setRegistrations(INITIAL_REGISTRATIONS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateRegistrationStatus = useCallback(async (id: string, status: EventRegistrationItem["status"]) => {
    setRegistrations((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          return { ...item, status, updated_at: new Date().toISOString() };
        }
        return item;
      });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) { console.error(e); }
      return updated;
    });

    toast.success("Đã cập nhật trạng thái đơn thành: " + status.toUpperCase());
  }, []);

  const deleteRegistration = useCallback(async (id: string) => {
    setRegistrations((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) { console.error(e); }
      return updated;
    });

    toast.success("Đã xóa đơn đăng ký sự kiện.");
  }, []);

  return {
    registrations,
    isLoading,
    updateRegistrationStatus,
    deleteRegistration,
    stats: {
      total: registrations.length,
      pending: registrations.filter((r) => r.status === "pending").length,
      confirmed: registrations.filter((r) => r.status === "confirmed").length,
    }
  };
};
