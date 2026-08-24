"use client";

import { useEffect, useState, useCallback } from "react";
import { NewsletterSubscriberItem } from "@/types/newsletter";
import { toast } from "@/providers/ToastProvider";

const STORAGE_KEY = "admin_newsletter_subscribers_v2";

const INITIAL_SUBSCRIBERS: NewsletterSubscriberItem[] = [
  {
    id: "sub-1",
    email: "sarah.jenkins@sequoia-asia.com",
    full_name: "Sarah Jenkins",
    source: "Landing Page Hero",
    status: "subscribed",
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "sub-2",
    email: "alexander.chen@binance-labs.io",
    full_name: "Alexander Chen",
    source: "Event Conviction 2026",
    status: "subscribed",
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "sub-3",
    email: "minh.nguyen@dragoncapital.com.vn",
    full_name: "Minh Nguyen",
    source: "Footer Newsletter Form",
    status: "subscribed",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "sub-4",
    email: "elena.rostova@dubai-capital.ae",
    full_name: "Elena Rostova",
    source: "Private Club Invitation",
    status: "unsubscribed",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "sub-5",
    email: "david.kim@hashed.kr",
    full_name: "David Kim",
    source: "CEO Summit Seoul",
    status: "subscribed",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const useNewsletterSubscribers = () => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriberItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      localStorage.removeItem("admin_newsletter_subscribers"); // Clear old corrupted cache
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && !stored.includes("?") && !stored.includes("Ð")) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSubscribers(parsed);
          setIsLoading(false);
          return;
        }
      }
      setSubscribers(INITIAL_SUBSCRIBERS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SUBSCRIBERS));
    } catch {
      setSubscribers(INITIAL_SUBSCRIBERS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleSubscriberStatus = useCallback(async (id: string) => {
    setSubscribers((prev) => {
      const updated: NewsletterSubscriberItem[] = prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === "subscribed" ? "unsubscribed" : "subscribed";
          return { ...item, status: nextStatus, updated_at: new Date().toISOString() };
        }
        return item;
      });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) { console.error(e); }
      return updated;
    });

    toast.info("Đã chuyển đổi trạng thái nhận bản tin.");
  }, []);

  const deleteSubscriber = useCallback(async (id: string) => {
    setSubscribers((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) { console.error(e); }
      return updated;
    });

    toast.success("Đã xóa subscriber khỏi danh sách.");
  }, []);

  const addSubscriber = useCallback(async (email: string, fullName?: string, source?: string) => {
    const newSub: NewsletterSubscriberItem = {
      id: "sub-" + Date.now(),
      email,
      full_name: fullName || "",
      source: source || "Admin Manual",
      status: "subscribed",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setSubscribers((prev) => {
      const updated = [newSub, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) { console.error(e); }
      return updated;
    });

    toast.success("Thêm email nhận bản tin thành công!");
  }, []);

  return {
    subscribers,
    isLoading,
    toggleSubscriberStatus,
    deleteSubscriber,
    addSubscriber,
    stats: {
      total: subscribers.length,
      subscribed: subscribers.filter((s) => s.status === "subscribed").length,
      unsubscribed: subscribers.filter((s) => s.status === "unsubscribed").length,
    }
  };
};
